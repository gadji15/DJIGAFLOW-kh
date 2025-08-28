export const siteConfig = {
  name: "JammShop",
  tagline: "Votre boutique tendance",
  contact: {
    email: "JammShop15@gmail.com",
    phone: "+221766304380",
    whatsapp: "+221766304380",
  },
  social: {
    facebook: "https://www.facebook.com/share/1Ch5odyw8Y/",
    tiktok: "https://www.tiktok.com/@jammshop5?_t=ZT-8zFw4JvFPva&_r=1",
    twitter: "https://x.com/SunuGain15?t=LiLJSyvhrNgBrnHhCeNftA&s=35",
    instagram: "https://www.instagram.com/jammshop15?igsh=MTNyamJlNWRnanB3OA==",
    youtube: "",
    linkedin: "",
  },
  address: {
    line1: "123 Rue du Commerce",
    postalCode: "75001",
    city: "Paris",
    country: "France",
  },
  paymentMethods: ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Klarna"],
} as const;

export type SiteConfig = typeof siteConfig;