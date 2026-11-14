1mport { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // /login só existe para admin — redireciona direto para /admin
  // (o middleware do /admin já cuida do redirect para login se não autenticado)
  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // sem sessão: deixa passar para a página de login normalmente
    return NextResponse.next();
  }

  // Bloquear /registro — cadastro desabilitado
  if (pathname.startsWith("/registro")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin routes — requer role admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
    }
    if ((token as any).role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Rotas de usuário comum — redireciona para home (não há mais área de usuário)
  if (
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/pedidos") ||
    pathname.startsWith("/agendamentos")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/registro/:path*",
    "/login",
    "/perfil/:path*",
    "/pedidos/:path*",
    "/agendamentos/:path*",
  ],
};
