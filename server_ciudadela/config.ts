const JWT_SECRET = new TextEncoder().encode(Deno.env.get("JWT_SECRET") || "12345");

export { JWT_SECRET };