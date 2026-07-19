import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_CARD_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!webhookUrl) return Response.json({ error: "N8N_CARD_WEBHOOK_URL is not configured." }, { status: 500 });

  const incoming = await request.formData();
  const card = incoming.get("card");
  if (!(card instanceof File)) return Response.json({ error: "Business card image is required." }, { status: 400 });
  if (!card.type.startsWith("image/")) return Response.json({ error: "Please upload an image file." }, { status: 400 });
  if (card.size > 10 * 1024 * 1024) return Response.json({ error: "Image must be smaller than 10 MB." }, { status: 400 });

  const outgoing = new FormData();
  outgoing.set("card", card, card.name || "business-card.jpg");
  outgoing.set("metAt", String(incoming.get("metAt") || ""));
  outgoing.set("dateMet", String(incoming.get("dateMet") || ""));
  outgoing.set("notes", String(incoming.get("notes") || ""));

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: secret ? { "x-contact-vault-secret": secret } : undefined,
    body: outgoing,
    cache: "no-store"
  });

  const text = await response.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = { error: text || "Invalid n8n response." }; }
  if (!response.ok) return Response.json(data, { status: response.status });
  return Response.json(data);
}
