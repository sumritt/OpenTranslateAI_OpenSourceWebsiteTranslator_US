import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  validateRequest,
  isOriginAllowed,
  parseAllowedOrigins,
  buildMessages,
  parseTranslations,
  type ChatMessage,
} from "./lib.ts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function corsHeaders(origin: string | null, allowed: string[]): Record<string, string> {
  const allowOrigin = allowed.includes("*")
    ? "*"
    : origin && allowed.includes(origin)
    ? origin
    : allowed[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Widget-Token",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, temperature: 0, messages }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("OpenRouter error", res.status, detail);
    throw new Error(`OpenRouter ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

Deno.serve(async (req: Request) => {
  const allowed = parseAllowedOrigins(Deno.env.get("ALLOWED_ORIGINS"));
  const origin = req.headers.get("Origin");
  const cors = corsHeaders(origin, allowed);

  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);
  if (!isOriginAllowed(origin, allowed)) return json({ error: "Origin not allowed" }, 403, cors);

  const token = Deno.env.get("WIDGET_TOKEN");
  if (token && req.headers.get("X-Widget-Token") !== token) {
    return json({ error: "Forbidden" }, 403, cors);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, cors);
  }

  const v = validateRequest(body);
  if (!v.ok) return json({ error: v.error }, 400, cors);

  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  const model = Deno.env.get("OPENROUTER_MODEL");
  if (!apiKey || !model) return json({ error: "Server not configured" }, 500, cors);

  const { texts, target, source } = v.value;
  const messages = buildMessages(texts, target, source);

  try {
    let content = await callOpenRouter(apiKey, model, messages);
    let translations = parseTranslations(content, texts.length);
    if (!translations) {
      content = await callOpenRouter(apiKey, model, messages);
      translations = parseTranslations(content, texts.length);
    }
    if (!translations) return json({ translations: texts, degraded: true }, 200, cors);
    return json({ translations }, 200, cors);
  } catch (e) {
    console.error("translate error", e);
    return json({ translations: texts, degraded: true }, 200, cors);
  }
});
