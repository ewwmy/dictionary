import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  // Forward request to real backend with token
  const response = await fetch(`${process.env.BACKEND_URL}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return new Response("Unauthorized", { status: 401 });

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
