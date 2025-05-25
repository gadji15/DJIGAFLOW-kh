import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  text_content: string
  variables: string[]
}

interface EmailCampaign {
  id: string
  name: string
  template_id: string
  trigger_type: "welcome" | "abandoned_cart" | "order_confirmation" | "promotional"
  trigger_conditions: any
  status: "active" | "paused" | "draft"
  send_delay?: number
}

export class EmailAutomationService {
  private supabase = createClientComponentClient()

  async sendWelcomeEmail(userId: string, userEmail: string, userName: string): Promise<void> {
    const template = await this.getTemplate("welcome")
    if (!template) return

    const personalizedContent = this.personalizeTemplate(template, {
      user_name: userName,
      user_email: userEmail,
      welcome_bonus: "10%",
      site_url: process.env.NEXT_PUBLIC_SITE_URL,
    })

    await this.sendEmail({
      to: userEmail,
      subject: personalizedContent.subject,
      html: personalizedContent.html,
      text: personalizedContent.text,
      campaign_type: "welcome",
      user_id: userId,
    })
  }

  async sendAbandonedCartEmail(userId: string, cartItems: any[]): Promise<void> {
    const user = await this.getUserInfo(userId)
    if (!user) return

    const template = await this.getTemplate("abandoned_cart")
    if (!template) return

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const cartItemsHtml = this.generateCartItemsHtml(cartItems)

    const personalizedContent = this.personalizeTemplate(template, {
      user_name: user.first_name,
      cart_items: cartItemsHtml,
      cart_total: this.formatPrice(cartTotal),
      checkout_url: `${process.env.NEXT_PUBLIC_SITE_URL}/panier`,
      discount_code: "COMEBACK10",
    })

    await this.sendEmail({
      to: user.email,
      subject: personalizedContent.subject,
      html: personalizedContent.html,
      text: personalizedContent.text,
      campaign_type: "abandoned_cart",
      user_id: userId,
    })
  }

  async sendOrderConfirmationEmail(orderId: string): Promise<void> {
    const order = await this.getOrderDetails(orderId)
    if (!order) return

    const template = await this.getTemplate("order_confirmation")
    if (!template) return

    const orderItemsHtml = this.generateOrderItemsHtml(order.items)

    const personalizedContent = this.personalizeTemplate(template, {
      user_name: order.user.first_name,
      order_number: order.order_number,
      order_date: new Date(order.created_at).toLocaleDateString("fr-FR"),
      order_items: orderItemsHtml,
      order_total: this.formatPrice(order.total),
      shipping_address: this.formatAddress(order.shipping_address),
      tracking_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commandes/${orderId}`,
    })

    await this.sendEmail({
      to: order.user.email,
      subject: personalizedContent.subject,
      html: personalizedContent.html,
      text: personalizedContent.text,
      campaign_type: "order_confirmation",
      user_id: order.user_id,
      order_id: orderId,
    })
  }

  async sendPromotionalEmail(segmentId: string, templateId: string, variables: Record<string, any>): Promise<void> {
    const users = await this.getUsersInSegment(segmentId)
    const template = await this.getTemplateById(templateId)

    if (!template || !users.length) return

    for (const user of users) {
      const personalizedVariables = {
        ...variables,
        user_name: user.first_name,
        user_email: user.email,
        unsubscribe_url: `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${user.unsubscribe_token}`,
      }

      const personalizedContent = this.personalizeTemplate(template, personalizedVariables)

      await this.sendEmail({
        to: user.email,
        subject: personalizedContent.subject,
        html: personalizedContent.html,
        text: personalizedContent.text,
        campaign_type: "promotional",
        user_id: user.id,
      })

      // Délai entre les envois pour éviter le spam
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  private async getTemplate(type: string): Promise<EmailTemplate | null> {
    const { data } = await this.supabase
      .from("email_templates")
      .select("*")
      .eq("name", type)
      .eq("active", true)
      .single()

    return data
  }

  private async getTemplateById(id: string): Promise<EmailTemplate | null> {
    const { data } = await this.supabase.from("email_templates").select("*").eq("id", id).single()

    return data
  }

  private personalizeTemplate(
    template: EmailTemplate,
    variables: Record<string, any>,
  ): { subject: string; html: string; text: string } {
    let subject = template.subject
    let html = template.html_content
    let text = template.text_content

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      subject = subject.replace(new RegExp(placeholder, "g"), value)
      html = html.replace(new RegExp(placeholder, "g"), value)
      text = text.replace(new RegExp(placeholder, "g"), value)
    })

    return { subject, html, text }
  }

  private async sendEmail(emailData: {
    to: string
    subject: string
    html: string
    text: string
    campaign_type: string
    user_id: string
    order_id?: string
  }): Promise<void> {
    // Intégration avec un service d'email (SendGrid, Mailgun, etc.)
    try {
      // Simuler l'envoi d'email
      console.log(`Envoi d'email à ${emailData.to}:`, emailData.subject)

      // Enregistrer l'envoi dans la base de données
      await this.supabase.from("email_logs").insert({
        user_id: emailData.user_id,
        email: emailData.to,
        subject: emailData.subject,
        campaign_type: emailData.campaign_type,
        order_id: emailData.order_id,
        status: "sent",
        sent_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi d'email:", error)

      await this.supabase.from("email_logs").insert({
        user_id: emailData.user_id,
        email: emailData.to,
        subject: emailData.subject,
        campaign_type: emailData.campaign_type,
        order_id: emailData.order_id,
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        sent_at: new Date().toISOString(),
      })
    }
  }

  private async getUserInfo(userId: string): Promise<any> {
    const { data } = await this.supabase.from("user_profiles").select("*").eq("id", userId).single()

    return data
  }

  private async getOrderDetails(orderId: string): Promise<any> {
    const { data } = await this.supabase
      .from("orders")
      .select(`
        *,
        user:user_profiles(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq("id", orderId)
      .single()

    return data
  }

  private async getUsersInSegment(segmentId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from("user_segments")
      .select(`
        user:user_profiles(*)
      `)
      .eq("segment_id", segmentId)

    return data?.map((item) => item.user) || []
  }

  private generateCartItemsHtml(items: any[]): string {
    return items
      .map(
        (item) => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; float: left; margin-right: 15px;">
        <div>
          <h4 style="margin: 0; font-size: 16px;">${item.name}</h4>
          <p style="margin: 5px 0; color: #666;">Quantité: ${item.quantity}</p>
          <p style="margin: 0; font-weight: bold;">${this.formatPrice(item.price * item.quantity)}</p>
        </div>
        <div style="clear: both;"></div>
      </div>
    `,
      )
      .join("")
  }

  private generateOrderItemsHtml(items: any[]): string {
    return items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.product.images[0]}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${this.formatPrice(item.price)}</td>
      </tr>
    `,
      )
      .join("")
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  private formatAddress(address: any): string {
    return `
      ${address.street}<br>
      ${address.city}, ${address.postal_code}<br>
      ${address.country}
    `
  }
}
