"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Download, Copy } from "lucide-react"
import { MFAService } from "@/lib/auth/mfa-service"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

export function MFASetup() {
  const { user } = useAuth()
  const [step, setStep] = useState<"generate" | "verify" | "backup">("generate")
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [token, setToken] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const mfaService = new MFAService()

  const handleGenerateSecret = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { secret: newSecret, qrCode: newQrCode } = await mfaService.generateMFASecret(user.id)
      setSecret(newSecret)
      setQrCode(newQrCode)
      setStep("verify")
    } catch (err) {
      setError("Erreur lors de la génération du secret MFA")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyToken = async () => {
    if (!user) return

    setLoading(true)
    try {
      const isValid = await mfaService.enableMFA(user.id, token)
      if (isValid) {
        const codes = await mfaService.generateBackupCodes(user.id)
        setBackupCodes(codes)
        setStep("backup")
      } else {
        setError("Code de vérification invalide")
      }
    } catch (err) {
      setError("Erreur lors de la vérification")
    } finally {
      setLoading(false)
    }
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
  }

  const downloadBackupCodes = () => {
    const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "djigaflow-backup-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configuration MFA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "generate" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
            </p>
            <Button onClick={handleGenerateSecret} disabled={loading} className="w-full">
              Configurer MFA
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Scannez ce QR code avec votre application d'authentification
              </p>
              {qrCode && (
                <Image
                  src={qrCode || "/placeholder.svg"}
                  alt="QR Code MFA"
                  width={200}
                  height={200}
                  className="mx-auto border rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Code de vérification</label>
              <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456" maxLength={6} />
            </div>

            <Button onClick={handleVerifyToken} disabled={loading || token.length !== 6} className="w-full">
              Vérifier et activer
            </Button>
          </div>
        )}

        {step === "backup" && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                MFA activé avec succès ! Sauvegardez ces codes de récupération dans un endroit sûr.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded text-sm font-mono">
              {backupCodes.map((code, index) => (
                <div key={index}>{code}</div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={copyBackupCodes} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
              <Button variant="outline" onClick={downloadBackupCodes} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
