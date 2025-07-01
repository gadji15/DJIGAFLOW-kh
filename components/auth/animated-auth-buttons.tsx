"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, UserPlus, User, Settings, ShoppingBag, Heart } from "lucide-react"
import { useAuthButtons } from "@/hooks/use-auth-buttons"
import { useUserInteraction } from "@/hooks/use-user-interaction"
import { useAuthState } from "@/hooks/use-auth-state"
import Link from "next/link"

interface AnimatedAuthButtonsProps {
  variant?: "header" | "mobile" | "sidebar"
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
}

export function AnimatedAuthButtons({ variant = "header", showLabels = true, size = "md" }: AnimatedAuthButtonsProps) {
  const { showLogin, showLogout, showRegister, showProfile, isTransitioning, getButtonAnimationClass, handleLogout } =
    useAuthButtons()

  const { user, isAuthenticated } = useAuthState()

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8, y: -10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -10 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (variant === "mobile") {
    return (
      <motion.div
        className="flex flex-col space-y-2 w-full"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <AuthenticatedMobileButtons key="authenticated" user={user} onLogout={handleLogout} />
          ) : (
            <UnauthenticatedMobileButtons key="unauthenticated" />
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div className="flex items-center space-x-2" variants={staggerContainer} initial="initial" animate="animate">
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <AuthenticatedButtons
            key="authenticated"
            user={user}
            onLogout={handleLogout}
            showLabels={showLabels}
            size={size}
          />
        ) : (
          <UnauthenticatedButtons key="unauthenticated" showLabels={showLabels} size={size} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function UnauthenticatedButtons({
  showLabels,
  size,
}: {
  showLabels: boolean
  size: string
}) {
  const loginInteraction = useUserInteraction()
  const registerInteraction = useUserInteraction()

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8, x: -20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.8, x: 20 },
  }

  return (
    <>
      <motion.div variants={buttonVariants}>
        <Button
          asChild
          variant="ghost"
          size={size as any}
          style={loginInteraction.getInteractionStyles()}
          {...loginInteraction.handlers}
        >
          <Link href="/connexion">
            <LogIn className="h-4 w-4" />
            {showLabels && <span className="ml-2">Connexion</span>}
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          asChild
          size={size as any}
          style={registerInteraction.getInteractionStyles()}
          {...registerInteraction.handlers}
        >
          <Link href="/inscription">
            <UserPlus className="h-4 w-4" />
            {showLabels && <span className="ml-2">Inscription</span>}
          </Link>
        </Button>
      </motion.div>
    </>
  )
}

function AuthenticatedButtons({
  user,
  onLogout,
  showLabels,
  size,
}: {
  user: any
  onLogout: () => void
  showLabels: boolean
  size: string
}) {
  const profileInteraction = useUserInteraction()

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8, x: 20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.8, x: -20 },
  }

  return (
    <motion.div variants={buttonVariants}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size as any}
            className="relative"
            style={profileInteraction.getInteractionStyles()}
            {...profileInteraction.handlers}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            {showLabels && (
              <span className="ml-2 max-w-[100px] truncate">{user?.user_metadata?.full_name || user?.email}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/compte">
              <User className="mr-2 h-4 w-4" />
              Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/compte?tab=commandes">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Mes commandes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/compte?tab=favoris">
              <Heart className="mr-2 h-4 w-4" />
              Favoris
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/compte?tab=parametres">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}

function UnauthenticatedMobileButtons() {
  const buttonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  return (
    <>
      <motion.div variants={buttonVariants}>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/connexion">
            <LogIn className="mr-2 h-4 w-4" />
            Connexion
          </Link>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button asChild className="w-full justify-start">
          <Link href="/inscription">
            <UserPlus className="mr-2 h-4 w-4" />
            Inscription
          </Link>
        </Button>
      </motion.div>
    </>
  )
}

function AuthenticatedMobileButtons({
  user,
  onLogout,
}: {
  user: any
  onLogout: () => void
}) {
  const buttonVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <>
      <motion.div variants={buttonVariants}>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/compte">
            <User className="mr-2 h-4 w-4" />
            Mon profil
          </Link>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/compte?tab=commandes">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mes commandes
          </Link>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/compte?tab=favoris">
            <Heart className="mr-2 h-4 w-4" />
            Favoris
          </Link>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/compte?tab=parametres">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </motion.div>
    </>
  )
}
