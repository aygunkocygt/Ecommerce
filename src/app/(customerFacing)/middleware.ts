import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const customerToken = req.cookies.get("customerToken")?.value;

    if (!customerToken || !(await isCustomerTokenValid(customerToken))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

async function isCustomerTokenValid(customerToken: string) {
    return customerToken === process.env.NEXT_PUBLIC_STATIC_CUSTOMER_TOKEN;
}

export const config = {
    matcher: "/customerFacing/:path*",
};