import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, TrendingUp } from "lucide-react"

export default function AdminReportsPage() {
  const reports = [
    {
      title: "Rapport des ventes mensuelles",
      description: "Analyse détaillée des ventes du mois en cours",
      type: "sales",
      lastGenerated: "15/01/2024",
      icon: TrendingUp,
    },
    {
      title: "Rapport des produits",
      description: "Inventaire et performance des produits",
      type: "products",
      lastGenerated: "14/01/2024",
      icon: FileText,
    },
    {
      title: "Rapport des clients",
      description: "Analyse du comportement et segmentation client",
      type: "customers",
      lastGenerated: "13/01/2024",
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rapports</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Générer un rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <p className="text-xs text-muted-foreground mb-4">Dernière génération: {report.lastGenerated}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button size="sm">Générer</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapports récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Ventes_Janvier_2024.pdf", date: "15/01/2024", size: "2.3 MB" },
              { name: "Produits_Performance_Decembre.pdf", date: "31/12/2023", size: "1.8 MB" },
              { name: "Clients_Analyse_Q4.pdf", date: "28/12/2023", size: "3.1 MB" },
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.date} • {file.size}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
