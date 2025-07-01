import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().min(1, "L'email est requis").email("Format d'email invalide")

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
  .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial")

export const phoneSchema = z
  .string()
  .min(1, "Le numéro de téléphone est requis")
  .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Format de téléphone français invalide")

export const nameSchema = z
  .string()
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom ne peut pas dépasser 50 caractères")
  .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes")

export const addressSchema = z
  .string()
  .min(5, "L'adresse doit contenir au moins 5 caractères")
  .max(200, "L'adresse ne peut pas dépasser 200 caractères")

export const postalCodeSchema = z
  .string()
  .min(1, "Le code postal est requis")
  .regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres")

export const citySchema = z
  .string()
  .min(2, "La ville doit contenir au moins 2 caractères")
  .max(100, "La ville ne peut pas dépasser 100 caractères")
  .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "La ville ne peut contenir que des lettres, espaces, tirets et apostrophes")

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().optional(),
})

// Registration form schema
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
    newsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

// Contact form schema
export const contactSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
  category: z.enum(["general", "support", "sales", "partnership"], {
    required_error: "Veuillez sélectionner une catégorie",
  }),
})

// Checkout form schema
export const checkoutSchema = z
  .object({
    // Personal information
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,

    // Shipping address
    address: addressSchema,
    city: citySchema,
    postalCode: postalCodeSchema,
    country: z.string().min(1, "Le pays est requis"),

    // Shipping method
    shippingMethod: z.enum(["standard", "express"], {
      required_error: "Veuillez sélectionner une méthode de livraison",
    }),

    // Payment method
    paymentMethod: z.enum(["card", "paypal"], {
      required_error: "Veuillez sélectionner une méthode de paiement",
    }),

    // Card details (conditional)
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    cardName: z.string().optional(),

    // Options
    saveInfo: z.boolean().optional(),
    notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "card") {
        return data.cardNumber && data.expiryDate && data.cvv && data.cardName
      }
      return true
    },
    {
      message: "Les informations de carte sont requises",
      path: ["cardNumber"],
    },
  )

// Newsletter form schema
export const newsletterSchema = z.object({
  email: emailSchema,
  preferences: z.array(z.string()).optional(),
})

// Profile update schema
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  bio: z.string().max(500, "La biographie ne peut pas dépasser 500 caractères").optional(),
})

// Password change schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
  })

// Address form schema
export const addressFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'adresse est requis"),
  firstName: nameSchema,
  lastName: nameSchema,
  company: z.string().optional(),
  address: addressSchema,
  addressComplement: z.string().max(100, "Le complément d'adresse ne peut pas dépasser 100 caractères").optional(),
  city: citySchema,
  postalCode: postalCodeSchema,
  country: z.string().min(1, "Le pays est requis"),
  phone: phoneSchema.optional(),
  isDefault: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
export type AddressFormData = z.infer<typeof addressFormSchema>
