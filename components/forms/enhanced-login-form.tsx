"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, CheckCircle2, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères"),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export function EnhancedLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const watchedFields = watch()

  const onSubmit = async (data: LoginFormData) => {
    if (isLocked) {
      toast({
        title: "Compte temporairement verrouillé",
        description: `Veuillez attendre ${lockTimeRemaining} secondes avant de réessayer.`,
        variant: "destructive",
      })
      return
    }

    try {
      await login(data.email, data.password)

      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur JammShop",
        duration: 3000,
      })

      // Reset login attempts on success
      setLoginAttempts(0)

      // Redirect to account page or previous page
      router.push("/compte")
    } catch (error) {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)

      if (newAttempts >= 3) {
        setIsLocked(true)
        setLockTimeRemaining(30)

        // Start countdown
        const countdown = setInterval(() => {
          setLockTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdown)
              setIsLocked(false)
              setLoginAttempts(0)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        toast({
          title: "Trop de tentatives",
          description: "Votre compte est temporairement verrouillé pour 30 secondes.",
          variant: "destructive",
          duration: 5000,
        })
      } else {
        setError("password", {
          type: "manual",
          message: `Identifiants incorrects. ${3 - newAttempts} tentative(s) restante(s).`,
        })
      }
    }
  }

  const getFieldStatus = (fieldName: keyof LoginFormData) => {
    const hasError = !!errors[fieldName]
    const hasValue = !!watchedFields[fieldName]
    const isValidField = hasValue && !hasError

    return {
      hasError,
      hasValue,
      isValidField,
    }
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

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <Card className="w-full shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <motion.div variants={fieldVariants}>
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>Connectez-vous à votre compte JammShop</CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <motion.div variants={fieldVariants}>
            <SocialLoginButtons
              variant="default"
              orientation="vertical"
              showDivider={false}
              onSuccess={() => router.push("/compte")}
            />
          </motion.div>

          {/* Divider */}
          <motion.div variants={fieldVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou avec votre email</span>
            </div>
          </motion.div>

          {/* Login Attempts Warning */}
          <AnimatePresence>
            {(loginAttempts > 0 || isLocked) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                variants={fieldVariants}
              >
                <Alert variant={isLocked ? "destructive" : "default"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {isLocked
                      ? `Compte verrouillé. Réessayez dans ${lockTimeRemaining} secondes.`
                      : `${loginAttempts} tentative(s) échouée(s). ${3 - loginAttempts} restante(s).`}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <motion.div variants={fieldVariants} className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
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
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fieldVariants} className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
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
                  autoComplete="current-password"
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
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div variants={fieldVariants} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register("rememberMe")} />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Se souvenir de moi
                </Label>
              </div>
              <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fieldVariants}>
              <Button type="submit" className="w-full" disabled={isSubmitting || isLocked || !isValid}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Security Notice */}
          <motion.div variants={fieldVariants}>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-green-500" />
              <span>Connexion sécurisée SSL</span>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter>
          <motion.div variants={fieldVariants} className="w-full text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-primary hover:underline font-medium">
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
