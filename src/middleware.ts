import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const authToken = req.cookies.get("authToken")?.value;

    if (!authToken || !(await isAuthTokenValid(authToken))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

async function isAuthTokenValid(authToken: string) {
    return authToken === process.env.NEXT_PUBLIC_STATIC_AUTH_TOKEN;
}

export const config = {
    matcher: "/admin/:path*",
};
