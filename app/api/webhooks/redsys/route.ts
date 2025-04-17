import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.formData()
    const merchantParams = body.get("Ds_MerchantParameters")
    const signature = body.get("Ds_Signature")

    // In a real application, you would:
    // 1. Verify the Redsys signature
    // 2. Decode the merchant parameters
    // 3. Handle different response codes
    // 4. Update booking status based on payment status

    // Mock successful webhook handling
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
