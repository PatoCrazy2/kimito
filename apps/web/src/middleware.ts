import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Si está autenticado e intenta ir a login o a la raíz, redirigir a dashboard
    if (isLoggedIn && (pathname === "/login" || pathname === "/")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Si NO está autenticado e intenta acceder al dashboard, onboarding o la raíz, redirigir a login
    if (!isLoggedIn && (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding") || pathname === "/")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*", "/onboarding/:path*"],
};