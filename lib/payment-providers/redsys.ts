// This is a mock implementation of Redsys integration
// In a real application, you would use the actual Redsys SDK

export async function createPaymentRequest(amount: number, orderId: string, description: string) {
  // Mock implementation
  const merchantParams = {
    DS_MERCHANT_AMOUNT: amount * 100, // Redsys uses cents
    DS_MERCHANT_ORDER: orderId,
    DS_MERCHANT_MERCHANTCODE: "999008881",
    DS_MERCHANT_CURRENCY: "978", // EUR
    DS_MERCHANT_TRANSACTIONTYPE: "0",
    DS_MERCHANT_TERMINAL: "1",
    DS_MERCHANT_MERCHANTURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/redsys`,
    DS_MERCHANT_URLOK: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success`,
    DS_MERCHANT_URLKO: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/error`,
    DS_MERCHANT_MERCHANTNAME: "AsturiasRural",
    DS_MERCHANT_PRODUCTDESCRIPTION: description,
  }

  // In a real implementation, you would encode and sign these parameters
  const encodedParams = Buffer.from(JSON.stringify(merchantParams)).toString("base64")
  const signature = "mock_signature"

  return {
    Ds_MerchantParameters: encodedParams,
    Ds_Signature: signature,
    Ds_SignatureVersion: "HMAC_SHA256_V1",
  }
}

export async function verifyPaymentResponse(merchantParams: string, signature: string) {
  // Mock implementation
  try {
    const decodedParams = JSON.parse(Buffer.from(merchantParams, "base64").toString())

    // In a real implementation, you would verify the signature

    return {
      valid: true,
      data: decodedParams,
    }
  } catch (error) {
    return {
      valid: false,
      data: null,
    }
  }
}
