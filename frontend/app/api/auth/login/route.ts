import { cookies } from "next/headers";


export const POST = async (req: Request) => {
  const { email, password } = await req.json();

  // Call real backend
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

    const { access_token } = await response.json();
    const cookieStore = await cookies();

  // Store tokens securely in HTTP-only cookies
  cookieStore.set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 15 minutes
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
