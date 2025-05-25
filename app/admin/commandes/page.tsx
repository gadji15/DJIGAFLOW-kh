import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Package, Truck } from "lucide-react"

// Mock data for orders
const orders = [
  {
    id: "CMD-001",
    customer: "Jean Dupont",
    email: "jean.dupont@email.com",
    total: 299.99,
    status: "pending",
    date: "2024-01-15",
    items: 3,
  },
  {
    id: "CMD-002",
    customer: "Marie Martin",
    email: "marie.martin@email.com",
    total: 149.5,
    status: "shipped",
    date: "2024-01-14",
    items: 2,
  },
  {
    id: "CMD-003",
    customer: "Pierre Durand",
    email: "pierre.durand@email.com",
    total: 89.99,
    status: "delivered",
    date: "2024-01-13",
    items: 1,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">En attente</Badge>
    case "shipped":
      return <Badge className="bg-blue-500">Expédiée</Badge>
    case "delivered":
      return <Badge className="bg-green-500">Livrée</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des commandes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 depuis hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes expédiées</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+5 depuis hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus du jour</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234€</div>
            <p className="text-xs text-muted-foreground">+12% depuis hier</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{order.total}€</p>
                    <p className="text-sm text-muted-foreground">{order.items} article(s)</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>

                  {getStatusBadge(order.status)}

                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
