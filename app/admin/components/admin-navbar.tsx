"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Store,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const notifications = [
  {
    id: 1,
    title: "Nouvelle commande",
    message: "Commande #12345 reçue",
    time: "Il y a 2 min",
    type: "success",
    icon: CheckCircle,
  },
  {
    id: 2,
    title: "Stock faible",
    message: "iPhone 15 Pro - 3 unités restantes",
    time: "Il y a 15 min",
    type: "warning",
    icon: AlertCircle,
  },
  {
    id: 3,
    title: "Synchronisation",
    message: "Mise à jour des prix terminée",
    time: "Il y a 1h",
    type: "info",
    icon: Activity,
  },
]

const quickStats = [
  { label: "Commandes", value: "24", change: "+12%", icon: TrendingUp },
  { label: "Revenus", value: "€2,450", change: "+8%", icon: TrendingUp },
  { label: "Visiteurs", value: "1,234", change: "+15%", icon: Activity },
]

export function AdminNavbar() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Mobile Logo & Desktop Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">JammShop</h1>
            </div>
          </div>

          {/* Desktop Quick Stats */}
          <div className="hidden xl:flex items-center gap-6">
            {quickStats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                  <div className="text-xs font-medium text-green-600 dark:text-green-400">{stat.change}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher produits, commandes..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {notifications.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">{notifications.length}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.type === "success"
                            ? "bg-green-100 text-green-600"
                            : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 dark:text-blue-400">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">JammShop15@gmail.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Quick Stats */}
      <div className="lg:hidden px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </header>
  )
}
