import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Seed endpoint disabled for deployment",
    })
  } catch (error: any) {
    console.error("Error in seed route:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while seeding the database",
      },
      { status: 500 },
    )
  }
}
