"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Check, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Le prénom est requis")
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères")
      .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le prénom ne peut contenir que des lettres"),
    lastName: z
      .string()
      .min(1, "Le nom est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères")
      .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le nom ne peut contenir que des lettres"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Format d'email invalide")
      .max(100, "L'email ne peut pas dépasser 100 caractères"),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(val), {
        message: "Format de téléphone français invalide",
      }),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
    acceptNewsletter: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export function EnhancedRegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const watchedFields = watch()
  const password = watch("password")

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: [], color: "bg-gray-200" }

    let score = 0
    const feedback: string[] = []

    // Length check
    if (password.length >= 8) {
      score += 25
    } else {
      feedback.push("Au moins 8 caractères")
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 25
    } else {
      feedback.push("Une lettre minuscule")
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 25
    } else {
      feedback.push("Une lettre majuscule")
    }

    // Number check
    if (/\d/.test(password)) {
      score += 25
    } else {
      feedback.push("Un chiffre")
    }

    // Special character bonus
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 10
    }

    // Length bonus
    if (password.length >= 12) {
      score += 10
    }

    const colors = {
      0: "bg-gray-200",
      25: "bg-red-500",
      50: "bg-orange-500",
      75: "bg-yellow-500",
      100: "bg-green-500",
    }

    const colorKey = Math.min(100, Math.floor(score / 25) * 25) as keyof typeof colors

    return {
      score: Math.min(100, score),
      feedback,
      color: colors[colorKey],
    }
  }

  const passwordStrength = calculatePasswordStrength(password || "")

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, `${data.firstName} ${data.lastName}`)

      toast({
        title: "Compte créé avec succès !",
        description: "Bienvenue sur DjigaFlow",
        duration: 3000,
      })

      router.push("/compte")
    } catch (error) {
      toast({
        title: "Erreur lors de la création du compte",
        description: "Veuillez vérifier vos informations et réessayer.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const getFieldStatus = (fieldName: keyof RegisterFormData) => {
    const hasError = !!errors[fieldName]
    const hasValue = !!watchedFields[fieldName]
    const isValidField = hasValue && !hasError

    return {
      hasError,
      hasValue,
      isValidField,
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 ? (["firstName", "lastName", "email"] as const) : (["phone"] as const)

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <Card className="w-full shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <motion.div variants={fieldVariants}>
            <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
            <CardDescription>Rejoignez DjigaFlow et découvrez nos offres exclusives</CardDescription>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div variants={fieldVariants} className="pt-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <Check className="h-4 w-4" /> : step}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login Buttons - Only on first step */}
          {currentStep === 1 && (
            <motion.div variants={fieldVariants}>
              <SocialLoginButtons
                variant="default"
                orientation="vertical"
                showDivider={false}
                onSuccess={() => router.push("/compte")}
              />

              {/* Divider */}
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou créez un compte</span>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Prénom *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Votre prénom"
                        className={`pl-10 pr-10 transition-all duration-200 ${
                          getFieldStatus("firstName").hasError
                            ? "border-destructive focus:border-destructive"
                            : getFieldStatus("firstName").isValidField
                              ? "border-green-500 focus:border-green-500"
                              : ""
                        }`}
                        autoComplete="given-name"
                        {...register("firstName")}
                      />
                      <AnimatePresence>
                        {getFieldStatus("firstName").isValidField && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Nom *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Votre nom"
                        className={`pl-10 pr-10 transition-all duration-200 ${
                          getFieldStatus("lastName").hasError
                            ? "border-destructive focus:border-destructive"
                            : getFieldStatus("lastName").isValidField
                              ? "border-green-500 focus:border-green-500"
                              : ""
                        }`}
                        autoComplete="family-name"
                        {...register("lastName")}
                      />
                      <AnimatePresence>
                        {getFieldStatus("lastName").isValidField && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Adresse email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className={`pl-10 pr-10 transition-all duration-200 ${
                          getFieldStatus("email").hasError
                            ? "border-destructive focus:border-destructive"
                            : getFieldStatus("email").isValidField
                              ? "border-green-500 focus:border-green-500"
                              : ""
                        }`}
                        autoComplete="email"
                        {...register("email")}
                      />
                      <AnimatePresence>
                        {getFieldStatus("email").isValidField && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button type="button" onClick={nextStep} className="w-full">
                    Continuer
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Téléphone (optionnel)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        className={`pl-10 pr-10 transition-all duration-200 ${
                          getFieldStatus("phone").hasError
                            ? "border-destructive focus:border-destructive"
                            : getFieldStatus("phone").isValidField
                              ? "border-green-500 focus:border-green-500"
                              : ""
                        }`}
                        autoComplete="tel"
                        {...register("phone")}
                      />
                      <AnimatePresence>
                        {getFieldStatus("phone").isValidField && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                      Retour
                    </Button>
                    <Button type="button" onClick={nextStep} className="flex-1">
                      Continuer
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Password and Terms */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de passe *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className={`pl-10 pr-10 transition-all duration-200 ${
                          getFieldStatus("password").hasError
                            ? "border-destructive focus:border-destructive"
                            : getFieldStatus("password").isValidField
                              ? "border-green-500 focus:border-green-500"
                              : ""
                        }`}
                        autoComplete="new-password"
                        {...register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Force du mot de passe</span>
                          <span
                            className={`font-medium ${
                              passwordStrength.score >= 75
                                ? "text-green-600"
                                : passwordStrength.score >= 50
                                  ? "text-yellow-600"
                                  : passwordStrength.score >= 25
                                    ? "text-orange-600"
                                    : "text-red-600"
                            }`}
                          >
                            {passwordStrength.score >= 75
                              ? "Fort"
                              : passwordStrength.score >= 50
                                ? "Moyen"
                                : passwordStrength.score >= 25
                                  ? "Faible"
                                  : "Très faible"}
                          </span>
                        </div>
                        <Progress value={passwordStrength.score} className="h-2" />
                        {passwordStrength.feedback.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <p>Manque :</p>
                            <ul className="list-disc list-inside ml-2">
                              {passwordStrength.feedback.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <AnimatePresence>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmer le mot de passe *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        className={`pl-10 pr-10 transition-all duration-200 ${
                          getFieldStatus("confirmPassword").hasError
                            ? "border-destructive focus:border-destructive"
                            : getFieldStatus("confirmPassword").isValidField
                              ? "border-green-500 focus:border-green-500"
                              : ""
                        }`}
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.confirmPassword.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-4">
                    <Controller
                      name="acceptTerms"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="acceptTerms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                          <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer leading-relaxed">
                            J'accepte les{" "}
                            <Link href="/conditions-utilisation" className="text-primary hover:underline">
                              conditions d'utilisation
                            </Link>{" "}
                            et la{" "}
                            <Link href="/politique-confidentialite" className="text-primary hover:underline">
                              politique de confidentialité
                            </Link>
                          </Label>
                        </div>
                      )}
                    />
                    <AnimatePresence>
                      {errors.acceptTerms && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.acceptTerms.message}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <Controller
                      name="acceptNewsletter"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="acceptNewsletter"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                          <Label htmlFor="acceptNewsletter" className="text-sm font-normal cursor-pointer leading-relaxed">
                            Je souhaite recevoir la newsletter DjigaFlow
                          </Label>
                        </div>
                      )}
                    />
                    <AnimatePresence>
                      {errors.acceptNewsletter && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.acceptNewsletter.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button type="submit" className="w-full">
                    Créer mon compte
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
