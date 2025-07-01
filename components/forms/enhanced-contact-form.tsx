"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, User, MessageSquare, Send, Loader2, CheckCircle, AlertCircle, MapPin, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { contactSchema, type ContactFormData } from "./form-validation"

interface EnhancedContactFormProps {
  onSuccess?: () => void
  className?: string
  showContactInfo?: boolean
}

const contactCategories = [
  { value: "general", label: "Question générale", icon: MessageSquare },
  { value: "support", label: "Support technique", icon: AlertCircle },
  { value: "sales", label: "Ventes et commandes", icon: CheckCircle },
  { value: "partnership", label: "Partenariat", icon: User },
]

export function EnhancedContactForm({ onSuccess, className, showContactInfo = true }: EnhancedContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      category: undefined,
    },
    mode: "onChange",
  })

  const {
    watch,
    formState: { errors, isValid, touchedFields },
  } = form

  const getFieldStatus = (fieldName: keyof ContactFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasError = errors[fieldName]
    const hasValue = watch(fieldName)

    if (!isTouched) return "default"
    if (hasError) return "error"
    if (hasValue) return "success"
    return "default"
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setIsSuccess(true)

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      })

      if (onSuccess) {
        onSuccess()
      }

      // Reset form after success
      setTimeout(() => {
        form.reset()
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fieldVariants = {
    default: { borderColor: "hsl(var(--border))" },
    success: { borderColor: "hsl(var(--success))" },
    error: { borderColor: "hsl(var(--destructive))" },
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl mx-auto ${className}`}
      >
        <Card>
          <CardContent className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Message envoyé !</h3>
            <p className="text-muted-foreground mb-4">
              Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <p className="text-sm text-muted-foreground">Temps de réponse habituel : 24-48 heures</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Nous contacter
              </CardTitle>
              <CardDescription>Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <CardContent className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Prénom *
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <motion.div
                                animate={fieldVariants[getFieldStatus("firstName")]}
                                transition={{ duration: 0.2 }}
                              >
                                <Input {...field} placeholder="Jean" disabled={isLoading} autoComplete="given-name" />
                              </motion.div>
                            </FormControl>
                            <AnimatePresence>
                              {getFieldStatus("firstName") === "success" && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <motion.div
                                animate={fieldVariants[getFieldStatus("lastName")]}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  {...field}
                                  placeholder="Dupont"
                                  disabled={isLoading}
                                  autoComplete="family-name"
                                />
                              </motion.div>
                            </FormControl>
                            <AnimatePresence>
                              {getFieldStatus("lastName") === "success" && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email *
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <motion.div
                                animate={fieldVariants[getFieldStatus("email")]}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="jean.dupont@email.com"
                                  className="pl-10"
                                  disabled={isLoading}
                                  autoComplete="email"
                                />
                              </motion.div>
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <AnimatePresence>
                              {getFieldStatus("email") === "success" && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Téléphone
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <motion.div
                                animate={fieldVariants[getFieldStatus("phone")]}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="06 12 34 56 78"
                                  className="pl-10"
                                  disabled={isLoading}
                                  autoComplete="tel"
                                />
                              </motion.div>
                            </FormControl>
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          <FormMessage />
                          <FormDescription>Optionnel - pour un contact plus rapide</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contactCategories.map((category) => {
                              const Icon = category.icon
                              return (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet *</FormLabel>
                        <FormControl>
                          <motion.div animate={fieldVariants[getFieldStatus("subject")]} transition={{ duration: 0.2 }}>
                            <Input {...field} placeholder="Résumé de votre demande" disabled={isLoading} />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <motion.div animate={fieldVariants[getFieldStatus("message")]} transition={{ duration: 0.2 }}>
                            <Textarea
                              {...field}
                              placeholder="Décrivez votre demande en détail..."
                              className="min-h-[120px] resize-none"
                              disabled={isLoading}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                        <FormDescription>{watch("message")?.length || 0}/1000 caractères</FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </CardContent>
              </form>
            </Form>
          </Card>
        </div>

        {/* Contact Information */}
        {showContactInfo && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Nos coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-muted-foreground">
                      123 Rue de la Paix
                      <br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">contact@djigaflow.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-muted-foreground">
                      Lun - Ven : 9h - 18h
                      <br />
                      Sam : 9h - 12h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temps de réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Questions générales</span>
                    <span className="text-sm font-medium text-green-600">24h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Support technique</span>
                    <span className="text-sm font-medium text-blue-600">4-8h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ventes</span>
                    <span className="text-sm font-medium text-purple-600">2-4h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Partenariat</span>
                    <span className="text-sm font-medium text-orange-600">48h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
