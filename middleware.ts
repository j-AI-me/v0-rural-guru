import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Create a Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })

  // Get the token from the request
  const token = request.cookies.get("sb-access-token")?.value

  if (!token) {
    // If no token, redirect to login for protected routes
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/host-dashboard") ||
      request.nextUrl.pathname.startsWith("/bookings") ||
      request.nextUrl.pathname.startsWith("/profile")
    ) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  try {
    // Verify the token
    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error("Invalid token")
    }

    // Get user role from our custom users table
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    // Check if the user is trying to access admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!userData || userData.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    // Check if the user is trying to access host routes
    if (request.nextUrl.pathname.startsWith("/host-dashboard")) {
      if (!userData || (userData.role !== "host" && userData.role !== "admin")) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }
  } catch (error) {
    // If token verification fails, redirect to login for protected routes
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/host-dashboard") ||
      request.nextUrl.pathname.startsWith("/bookings") ||
      request.nextUrl.pathname.startsWith("/profile")
    ) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Add GDPR cookie consent banner if not already accepted
  if (!request.cookies.has("cookie-consent")) {
    const response = NextResponse.next()
    response.headers.set("x-middleware-cookie-consent", "required")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/host-dashboard/:path*", "/bookings/:path*", "/profile/:path*"],
}
