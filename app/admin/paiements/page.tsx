import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
} from "lucide-react"

const payments = [
  {
    id: "PAY-001",
    order_id: "CMD-12345",
    customer: "Marie Dubois",
    amount: 299.99,
    method: "card",
    status: "completed",
    gateway: "Stripe",
    transaction_id: "pi_1234567890",
    created_at: "2024-01-20 14:30",
    fees: 8.99,
  },
  {
    id: "PAY-002",
    order_id: "CMD-12346",
    customer: "Jean Martin",
    amount: 149.5,
    method: "paypal",
    status: "pending",
    gateway: "PayPal",
    transaction_id: "PAYID-1234567",
    created_at: "2024-01-20 13:15",
    fees: 4.48,
  },
  {
    id: "PAY-003",
    order_id: "CMD-12347",
    customer: "Sophie Laurent",
    amount: 89.99,
    method: "card",
    status: "failed",
    gateway: "Stripe",
    transaction_id: "pi_0987654321",
    created_at: "2024-01-20 12:00",
    fees: 0,
  },
  {
    id: "PAY-004",
    order_id: "CMD-12348",
    customer: "Pierre Durand",
    amount: 199.99,
    method: "bank_transfer",
    status: "completed",
    gateway: "Virement",
    transaction_id: "VIR-789456123",
    created_at: "2024-01-19 16:45",
    fees: 2.5,
  },
]

const stats = [
  {
    title: "Revenus totaux",
    value: "€45,231",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Paiements réussis",
    value: "98.2%",
    change: "+0.3%",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Frais de transaction",
    value: "€1,247",
    change: "+8.1%",
    icon: CreditCard,
    color: "text-blue-600",
  },
  {
    title: "Paiements en attente",
    value: "12",
    change: "-15%",
    icon: Clock,
    color: "text-orange-600",
  },
]

const paymentMethods = [
  { method: "Carte bancaire", count: 156, percentage: 65, revenue: "€28,450" },
  { method: "PayPal", count: 89, percentage: 25, revenue: "€12,340" },
  { method: "Virement", count: 23, percentage: 8, revenue: "€3,890" },
  { method: "Crypto", count: 5, percentage: 2, revenue: "€551" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Complété</Badge>
    case "pending":
      return <Badge variant="secondary">En attente</Badge>
    case "failed":
      return <Badge variant="destructive">Échoué</Badge>
    case "refunded":
      return <Badge className="bg-blue-500">Remboursé</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getMethodIcon(method: string) {
  switch (method) {
    case "card":
      return <CreditCard className="h-4 w-4" />
    case "paypal":
      return <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">P</div>
    case "bank_transfer":
      return <div className="w-4 h-4 bg-gray-600 rounded text-white text-xs flex items-center justify-center">B</div>
    default:
      return <CreditCard className="h-4 w-4" />
  }
}

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Paiements</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez et suivez tous les paiements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className={`text-xs ${stat.color}`}>{stat.change} vs mois dernier</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Paiements récents</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {getMethodIcon(payment.method)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{payment.id}</h4>
                            {getStatusBadge(payment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {payment.customer} • {payment.created_at}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">€{payment.amount}</p>
                        {payment.fees > 0 && <p className="text-sm text-muted-foreground">Frais: €{payment.fees}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Commande</p>
                        <p className="font-medium">{payment.order_id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Passerelle</p>
                        <p className="font-medium">{payment.gateway}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transaction</p>
                        <p className="font-medium text-xs">{payment.transaction_id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {payment.status === "completed" && (
                          <Button variant="outline" size="sm">
                            Rembourser
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{method.method}</span>
                      <Badge variant="outline">{method.percentage}%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{method.count} transactions</span>
                      <span className="font-medium text-green-600">{method.revenue}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${method.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchroniser les paiements
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Rapport mensuel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Paiements échoués
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics paiements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
