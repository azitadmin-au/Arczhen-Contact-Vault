import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const webhookUrl = process.env.N8N_CARD_WEBHOOK_URL;
    const secret = process.env.N8N_WEBHOOK_SECRET;

    if (!webhookUrl) {
      return Response.json(
        { error: "N8N_CARD_WEBHOOK_URL is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret
          ? { "x-contact-vault-secret": secret }
          : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        message:
          responseText || "The n8n workflow was triggered.",
      };
    }

    if (!response.ok) {
      return Response.json(data, {
        status: response.status,
      });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Follow-up webhook error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to trigger the follow-up workflow.",
      },
      { status: 500 }
    );
  }
}
