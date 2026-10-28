import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function newsErrorResponse(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Revisa los campos de la noticia", details: error.flatten() }, { status: 400 });
  if (error instanceof SyntaxError) return NextResponse.json({ error: "El cuerpo JSON no es válido" }, { status: 400 });
  if (error instanceof Error && "status" in error && typeof error.status === "number") {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("News operation failed", error instanceof Error ? error.name : "UnknownError");
  return NextResponse.json({ error: "No se pudo conectar con las noticias. Inténtalo de nuevo." }, { status: 503 });
}

export async function readNewsBody(request: Request): Promise<unknown> {
  const limit = 131072;
  const tooLarge = () => Object.assign(new Error("La noticia supera el tamaño permitido"), { status: 413 });
  if (Number(request.headers.get("content-length")) > limit) throw tooLarge();
  if (!request.body) throw new SyntaxError("Empty body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw tooLarge();
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(body));
}
