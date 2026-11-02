import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login?setup=1', request.url));
    }
    return response;
  }
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLogin = request.nextUrl.pathname.startsWith('/admin/login');
  if (isAdminPath && !isLogin && !user) return NextResponse.redirect(new URL('/admin/login', request.url));
  if (isAdminPath && !isLogin && user) {
    const { data: settings } = await supabase.from('app_settings').select('owner_id').eq('id', 1).maybeSingle();
    if (!settings || settings.owner_id !== user.id) return NextResponse.redirect(new URL('/admin/login?unauthorized=1', request.url));
  }
  if (isLogin && user) {
    const { data: settings } = await supabase.from('app_settings').select('owner_id').eq('id', 1).maybeSingle();
    if (settings?.owner_id === user.id) return NextResponse.redirect(new URL('/admin/perfumes', request.url));
  }
  return response;
}

export const config = { matcher: ['/admin/:path*'] };
