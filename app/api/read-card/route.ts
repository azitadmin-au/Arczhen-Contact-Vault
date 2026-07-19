import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ExtractedContact = {
  fullName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  address: string;
};

function emptyContact(): ExtractedContact {
  return {
    fullName: "",
    company: "",
    jobTitle: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("card");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Business card image is required.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "The uploaded file must be an image.",
        },
        { status: 400 }
      );
    }

    const maximumFileSize = 4 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      return NextResponse.json(
        {
          error: "The business card image must be smaller than 4 MB.",
        },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");
    const imageDataUrl = `data:${file.type};base64,${base64Image}`;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `
Read this business card carefully.

Return only valid JSON with exactly these fields:

{
  "fullName": "",
  "company": "",
  "jobTitle": "",
  "email": "",
  "phone": "",
  "website": "",
  "address": ""
}

Rules:
- Do not invent missing information.
- Use an empty string when a field is not visible.
- Preserve names and company names as printed.
- Normalize email addresses to lowercase.
- Keep phone numbers readable.
- Do not include markdown.
- Do not include explanations.
                  `.trim(),
                },
                {
                  type: "input_image",
                  image_url: imageDataUrl,
                },
              ],
            },
          ],
        }),
      }
    );

    const responseData = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error("OpenAI error:", responseData);

      return NextResponse.json(
        {
          error:
            responseData?.error?.message ||
            "The AI service could not read the business card.",
        },
        { status: openAIResponse.status }
      );
    }

    const outputText =
      responseData?.output_text ||
      responseData?.output
        ?.flatMap((item: any) => item?.content || [])
        ?.find((item: any) => item?.type === "output_text")
        ?.text;

    if (!outputText) {
      return NextResponse.json(
        {
          error: "The AI response did not contain contact details.",
        },
        { status: 500 }
      );
    }

    let extractedContact: ExtractedContact;

    try {
      extractedContact = {
        ...emptyContact(),
        ...JSON.parse(outputText),
      };
    } catch {
      console.error("Invalid AI JSON:", outputText);

      return NextResponse.json(
        {
          error: "The AI returned contact details in an invalid format.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      contact: extractedContact,
    });
  } catch (error) {
    console.error("Read card error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while reading the business card.",
      },
      { status: 500 }
    );
  }
}
