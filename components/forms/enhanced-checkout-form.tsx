"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Loader2,
  Lock,
  Shield,
  Package,
  Clock,
  Euro,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import { checkoutSchema, type CheckoutFormData } from "./form-validation"

interface EnhancedCheckoutFormProps {
  onSuccess?: (orderData: any) => void
  className?: string
}

const countries = [
  { value: "FR", label: "France" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
  { value: "LU", label: "Luxembourg" },
  { value: "MC", label: "Monaco" },
]

const shippingMethods = [
  {
    id: "standard",
    name: "Livraison standard",
    description: "3-5 jours ouvrés",
    price: 5.9,
    icon: Package,
  },
  {
    id: "express",
    name: "Livraison express",
    description: "1-2 jours ouvrés",
    price: 9.9,
    icon: Truck,
  },
]

const paymentMethods = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    secure: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Paiement sécurisé via PayPal",
    icon: Shield,
    secure: true,
  },
]

export function EnhancedCheckoutForm({ onSuccess, className }: EnhancedCheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "FR",
      shippingMethod: "standard",
      paymentMethod: "card",
      saveInfo: false,
      notes: "",
    },
    mode: "onChange",
  })

  const {
    watch,
    formState: { errors, isValid, touchedFields },
  } = form

  const watchedValues = watch()
  const selectedShipping = shippingMethods.find((m) => m.id === watchedValues.shippingMethod)
  const selectedPayment = paymentMethods.find((m) => m.id === watchedValues.paymentMethod)

  const shippingCost = selectedShipping?.price || 0
  const total = subtotal + shippingCost

  const getFieldStatus = (fieldName: keyof CheckoutFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasError = errors[fieldName]
    const hasValue = watch(fieldName)

    if (!isTouched) return "default"
    if (hasError) return "error"
    if (hasValue) return "success"
    return "default"
  }

  const validateStep = (step: number) => {
    const stepFields: Record<number, (keyof CheckoutFormData)[]> = {
      1: ["firstName", "lastName", "email", "phone"],
      2: ["address", "city", "postalCode", "country"],
      3: ["shippingMethod"],
      4: ["paymentMethod"],
    }

    const fields = stepFields[step] || []
    return fields.every((field) => !errors[field] && watchedValues[field])
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    } else {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis avant de continuer.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des articles avant de passer commande.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const orderData = {
        id: `ORD-${Date.now()}`,
        items,
        subtotal,
        shipping: shippingCost,
        total,
        customerInfo: data,
        status: "confirmed",
        createdAt: new Date(),
      }

      toast({
        title: "Commande confirmée !",
        description: "Votre commande a été traitée avec succès. Vous recevrez un email de confirmation.",
      })

      clearCart()

      if (onSuccess) {
        onSuccess(orderData)
      }
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement de votre commande.",
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

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Finaliser votre commande
              </CardTitle>
              <CardDescription>Paiement sécurisé SSL - Vos données sont protégées</CardDescription>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 h-0.5 mx-2 transition-colors ${
                          step < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Informations</span>
                <span>Adresse</span>
                <span>Livraison</span>
                <span>Paiement</span>
              </div>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <CardContent className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informations personnelles
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Prénom *</FormLabel>
                                  <div className="relative">
                                    <FormControl>
                                      <motion.div
                                        animate={fieldVariants[getFieldStatus("firstName")]}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Input
                                          {...field}
                                          placeholder="Jean"
                                          disabled={isLoading}
                                          autoComplete="given-name"
                                        />
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                    Téléphone *
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
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Shipping Address */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Adresse de livraison
                          </h3>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Adresse *</FormLabel>
                                  <FormControl>
                                    <motion.div
                                      animate={fieldVariants[getFieldStatus("address")]}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Input
                                        {...field}
                                        placeholder="123 Rue de la Paix"
                                        disabled={isLoading}
                                        autoComplete="street-address"
                                      />
                                    </motion.div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ville *</FormLabel>
                                    <FormControl>
                                      <motion.div
                                        animate={fieldVariants[getFieldStatus("city")]}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Input
                                          {...field}
                                          placeholder="Paris"
                                          disabled={isLoading}
                                          autoComplete="address-level2"
                                        />
                                      </motion.div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Code postal *</FormLabel>
                                    <FormControl>
                                      <motion.div
                                        animate={fieldVariants[getFieldStatus("postalCode")]}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Input
                                          {...field}
                                          placeholder="75001"
                                          disabled={isLoading}
                                          autoComplete="postal-code"
                                        />
                                      </motion.div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pays *</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isLoading}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un pays" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {countries.map((country) => (
                                        <SelectItem key={country.value} value={country.value}>
                                          {country.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Shipping Method */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Méthode de livraison
                          </h3>

                          <FormField
                            control={form.control}
                            name="shippingMethod"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-3"
                                  >
                                    {shippingMethods.map((method) => {
                                      const Icon = method.icon
                                      return (
                                        <div
                                          key={method.id}
                                          className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                        >
                                          <RadioGroupItem value={method.id} id={method.id} />
                                          <div className="flex items-center gap-3 flex-1">
                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1">
                                              <div className="flex items-center justify-between">
                                                <label htmlFor={method.id} className="font-medium cursor-pointer">
                                                  {method.name}
                                                </label>
                                                <span className="font-semibold">{method.price.toFixed(2)} €</span>
                                              </div>
                                              <p className="text-sm text-muted-foreground">{method.description}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Payment Method */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Méthode de paiement
                          </h3>

                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-3"
                                  >
                                    {paymentMethods.map((method) => {
                                      const Icon = method.icon
                                      return (
                                        <div
                                          key={method.id}
                                          className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                        >
                                          <RadioGroupItem value={method.id} id={method.id} />
                                          <div className="flex items-center gap-3 flex-1">
                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2">
                                                <label htmlFor={method.id} className="font-medium cursor-pointer">
                                                  {method.name}
                                                </label>
                                                {method.secure && (
                                                  <Badge variant="secondary" className="text-xs">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    Sécurisé
                                                  </Badge>
                                                )}
                                              </div>
                                              <p className="text-sm text-muted-foreground">{method.description}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Card Details (if card payment selected) */}
                          <AnimatePresence>
                            {watchedValues.paymentMethod === "card" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 p-4 border rounded-lg space-y-4"
                              >
                                <h4 className="font-medium">Informations de carte</h4>

                                <FormField
                                  control={form.control}
                                  name="cardNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Numéro de carte *</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="1234 5678 9012 3456"
                                          disabled={isLoading}
                                          autoComplete="cc-number"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="expiryDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Date d'expiration *</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="MM/AA"
                                            disabled={isLoading}
                                            autoComplete="cc-exp"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="cvv"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>CVV *</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="123"
                                            disabled={isLoading}
                                            autoComplete="cc-csc"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control}
                                  name="cardName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nom sur la carte *</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Jean Dupont"
                                          disabled={isLoading}
                                          autoComplete="cc-name"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Additional Options */}
                          <div className="space-y-4 mt-6">
                            <FormField
                              control={form.control}
                              name="saveInfo"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal">
                                      Sauvegarder ces informations pour la prochaine fois
                                    </FormLabel>
                                    <FormDescription>
                                      Vos informations seront stockées de manière sécurisée
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instructions de livraison (optionnel)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder="Instructions spéciales pour la livraison..."
                                      className="min-h-[80px] resize-none"
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormDescription>{watch("notes")?.length || 0}/500 caractères</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1 || isLoading}
                    >
                      Précédent
                    </Button>

                    {currentStep < 4 ? (
                      <Button type="button" onClick={nextStep} disabled={!validateStep(currentStep) || isLoading}>
                        Suivant
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading || !isValid} className="min-w-[120px]">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Payer {total.toFixed(2)} €
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </form>
            </Form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Récapitulatif de commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.variant)}`} className="flex gap-3">
                    <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg?height=48&width=48"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Qté: {item.quantity}</span>
                        <span className="font-medium text-sm">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                      {item.variant && (
                        <div className="text-xs text-muted-foreground">
                          {Object.entries(item.variant)
                            .filter(([key]) => key !== "id")
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Livraison
                    {selectedShipping && (
                      <span className="text-xs text-muted-foreground">({selectedShipping.name})</span>
                    )}
                  </span>
                  <span>{shippingCost.toFixed(2)} €</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Estimated Delivery */}
              {selectedShipping && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Livraison estimée:</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{selectedShipping.description}</p>
                </div>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-200 font-medium">Paiement 100% sécurisé</span>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Livraison gratuite dès 50€</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Retours gratuits sous 30 jours</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Service client 7j/7</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Garantie satisfaction</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
