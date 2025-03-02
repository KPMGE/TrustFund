import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/auth/lib/session";

const protectedRoutes = ["dashboard/borrower", "dashboard/lender"];
const publicRoutes = ["/auth/signin", "auth/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.find(route => path.includes(route));
  const isPublicRoute = publicRoutes.find(route => path.includes(route));

  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    const role = (session?.role as string).toLowerCase();

    if (!role) {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
    }

    return NextResponse.redirect(new URL(`/dashboard/${role}`, req.nextUrl));
  }

  return NextResponse.next();
}