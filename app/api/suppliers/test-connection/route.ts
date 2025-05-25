import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type, api_endpoint, api_key, api_secret } = await request.json()

    if (!type || !api_endpoint || !api_key) {
      return NextResponse.json({ success: false, error: "Paramètres manquants" }, { status: 400 })
    }

    // Test de connexion selon le type de fournisseur
    let testResult = false
    const errorMessage = ""

    switch (type) {
      case "aliexpress":
        testResult = await testAliExpressConnection(api_endpoint, api_key, api_secret)
        break
      case "jumia":
        testResult = await testJumiaConnection(api_endpoint, api_key)
        break
      case "amazon":
        testResult = await testAmazonConnection(api_endpoint, api_key, api_secret)
        break
      default:
        testResult = await testGenericConnection(api_endpoint, api_key)
    }

    if (testResult) {
      return NextResponse.json({ success: true, message: "Connexion réussie" })
    } else {
      return NextResponse.json({ success: false, error: errorMessage || "Échec de la connexion" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error testing connection:", error)
    return NextResponse.json({ success: false, error: error.message || "Erreur interne" }, { status: 500 })
  }
}

async function testAliExpressConnection(endpoint: string, apiKey: string, apiSecret?: string): Promise<boolean> {
  try {
    const response = await fetch(`${endpoint}/products?limit=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(apiSecret && { "X-API-Secret": apiSecret }),
      },
      timeout: 10000,
    })

    return response.ok
  } catch (error) {
    console.error("AliExpress connection test failed:", error)
    return false
  }
}

async function testJumiaConnection(endpoint: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${endpoint}/products?limit=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    })

    return response.ok
  } catch (error) {
    console.error("Jumia connection test failed:", error)
    return false
  }
}

async function testAmazonConnection(endpoint: string, apiKey: string, apiSecret?: string): Promise<boolean> {
  try {
    const response = await fetch(`${endpoint}/products?limit=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(apiSecret && { "X-API-Secret": apiSecret }),
      },
      timeout: 10000,
    })

    return response.ok
  } catch (error) {
    console.error("Amazon connection test failed:", error)
    return false
  }
}

async function testGenericConnection(endpoint: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${endpoint}/health`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    })

    return response.ok
  } catch (error) {
    console.error("Generic connection test failed:", error)
    return false
  }
}
