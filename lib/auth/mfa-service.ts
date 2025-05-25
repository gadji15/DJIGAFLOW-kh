import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { authenticator } from "otplib"
import QRCode from "qrcode"

export class MFAService {
  private supabase = createClientComponentClient()

  async generateMFASecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const secret = authenticator.generateSecret()
    const service = "DjigaFlow"
    const account = `user-${userId}`

    const otpauth = authenticator.keyuri(account, service, secret)
    const qrCode = await QRCode.toDataURL(otpauth)

    // Stocker le secret temporairement
    await this.supabase.from("user_mfa_temp").upsert({
      user_id: userId,
      secret,
      created_at: new Date().toISOString(),
    })

    return { secret, qrCode }
  }

  async enableMFA(userId: string, token: string): Promise<boolean> {
    const { data: tempData } = await this.supabase.from("user_mfa_temp").select("secret").eq("user_id", userId).single()

    if (!tempData) return false

    const isValid = authenticator.verify({
      token,
      secret: tempData.secret,
    })

    if (isValid) {
      // Activer MFA pour l'utilisateur
      await this.supabase
        .from("user_profiles")
        .update({
          mfa_enabled: true,
          mfa_secret: tempData.secret,
        })
        .eq("id", userId)

      // Supprimer le secret temporaire
      await this.supabase.from("user_mfa_temp").delete().eq("user_id", userId)

      return true
    }

    return false
  }

  async verifyMFA(userId: string, token: string): Promise<boolean> {
    const { data: userData } = await this.supabase.from("user_profiles").select("mfa_secret").eq("id", userId).single()

    if (!userData?.mfa_secret) return false

    return authenticator.verify({
      token,
      secret: userData.mfa_secret,
    })
  }

  async generateBackupCodes(userId: string): Promise<string[]> {
    const codes = Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 10).toUpperCase())

    await this.supabase.from("user_backup_codes").delete().eq("user_id", userId)

    await this.supabase.from("user_backup_codes").insert(
      codes.map((code) => ({
        user_id: userId,
        code,
        used: false,
      })),
    )

    return codes
  }
}
