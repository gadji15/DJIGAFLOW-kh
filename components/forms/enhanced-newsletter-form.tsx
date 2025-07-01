"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, CheckCircle, Gift, Star, Zap, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { newsletterSchema, type NewsletterFormData } from "./form-validation"

interface EnhancedNewsletterFormProps {
  onSuccess?: () => void
  className?: string
  variant?: "default" | "compact" | "hero"
  showBenefits?: boolean
}

const newsletterBenefits = [
  {
    icon: Gift,
    title: "Offres exclusives",
    description: "Accès prioritaire aux promotions et codes de réduction",
  },
  {
    icon: Star,
    title: "Nouveautés en avant-première",
    description: "Découvrez nos nouveaux produits avant tout le monde",
  },
  {
    icon: Zap,
    title: "Conseils personnalisés",
    description: "Recevez des recommandations adaptées à vos goûts",
  },
]

const preferences = [
  { id: "promotions", label: "Promotions et offres spéciales" },
  { id: "nouveautes", label: "Nouveaux produits" },
  { id: "conseils", label: "Conseils et guides d'achat" },
  { id: "evenements", label: "Événements et ventes privées" },
]

export function EnhancedNewsletterForm({
  onSuccess,
  className,
  variant = "default",
  showBenefits = true,
}: EnhancedNewsletterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const { toast } = useToast()

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      preferences: [],
    },
    mode: "onChange",
  })

  const {
    watch,
    formState: { errors, isValid },
  } = form

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)

      toast({
        title: "Inscription réussie !",
        description: "Merci de vous être inscrit à notre newsletter. Vous recevrez bientôt nos dernières actualités.",
      })

      if (onSuccess) {
        onSuccess()
      }

      // Reset form after success
      setTimeout(() => {
        form.reset()
        setIsSuccess(false)
        setShowPreferences(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full ${className}`}
      >
        <Card className={variant === "compact" ? "border-0 shadow-none" : ""}>
          <CardContent className={`text-center ${variant === "compact" ? "p-4" : "p-6"}`}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Inscription confirmée !</h3>
            <p className="text-muted-foreground mb-4">
              Merci de vous être inscrit à notre newsletter. Vous recevrez bientôt nos dernières actualités.
            </p>
            <Badge variant="secondary" className="gap-1">
              <Gift className="h-3 w-3" />
              Code promo de bienvenue envoyé par email
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderCompactForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder="Votre adresse email"
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !isValid}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Form>
  )

  const renderHeroForm = () => (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Restez informé</h2>
        <p className="text-xl text-muted-foreground">
          Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre première commande
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="email"
                      placeholder="Votre adresse email"
                      className="pl-10 h-12 text-lg"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="w-full h-12 text-lg" disabled={isLoading || !isValid}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Inscription...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                Obtenir ma réduction
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            En vous inscrivant, vous acceptez de recevoir nos communications marketing. Vous pouvez vous désinscrire à
            tout moment.
          </p>
        </form>
      </Form>

      {showBenefits && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {newsletterBenefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderDefaultForm = () => (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          Newsletter
        </CardTitle>
        <CardDescription>Restez informé de nos dernières actualités et offres exclusives</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse email</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Préférences de contenu</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreferences(!showPreferences)}>
                  {showPreferences ? "Masquer" : "Personnaliser"}
                </Button>
              </div>

              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="preferences"
                      render={() => (
                        <FormItem>
                          <div className="space-y-3">
                            {preferences.map((preference) => (
                              <FormField
                                key={preference.id}
                                control={form.control}
                                name="preferences"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={preference.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(preference.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, preference.id])
                                              : field.onChange(field.value?.filter((value) => value !== preference.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">{preference.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {showBenefits && (
              <div className="space-y-3">
                <h4 className="font-medium">Avantages de l'inscription</h4>
                <div className="space-y-2">
                  {newsletterBenefits.map((benefit) => {
                    const Icon = benefit.icon
                    return (
                      <div key={benefit.title} className="flex items-start gap-3">
                        <Icon className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{benefit.title}</p>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  S'inscrire à la newsletter
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              En vous inscrivant, vous acceptez de recevoir nos communications marketing. Vous pouvez vous désinscrire à
              tout moment en cliquant sur le lien de désinscription dans nos emails ou en nous contactant.
            </p>
          </CardContent>
        </form>
      </Form>
    </Card>
  )

  return (
    <div className={className}>
      {variant === "compact" && renderCompactForm()}
      {variant === "hero" && renderHeroForm()}
      {variant === "default" && renderDefaultForm()}
    </div>
  )
}
