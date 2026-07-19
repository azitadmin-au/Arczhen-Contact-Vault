# ArchZen Contact Vault — Version 1

A mobile-first business-card capture app. It sends the card and meeting notes to n8n, receives extracted contact details plus an email draft, and displays them for review.

## Architecture

Phone/PWA → Next.js on Vercel → protected n8n webhook → AI vision extraction → Supabase/Postgres → email draft → return JSON to app.

No CRM is involved. Every record begins as a personal networking contact.

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Set your n8n production webhook URL and a long random secret.
4. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` on your phone or computer.

## Deploy

1. Push this folder to a private GitHub repository.
2. Import the repository into Vercel.
3. Add `N8N_CARD_WEBHOOK_URL` and `N8N_WEBHOOK_SECRET` in Vercel Environment Variables.
4. Deploy.

## Expected n8n response

```json
{
  "contactId": "uuid",
  "name": "John Smith",
  "company": "ABC Electrical",
  "title": "Director",
  "email": "john@example.com.au",
  "phone": "0400 000 000",
  "website": "https://example.com.au",
  "address": "Melbourne VIC",
  "emailSubject": "Great meeting you at BNI",
  "emailBody": "Hi John, ...",
  "warning": "Review the email address before sending."
}
```

## n8n workflow nodes

1. **Webhook** — POST path `contact-vault-scan`; receive binary property `card`.
2. **IF secret valid** — compare `x-contact-vault-secret` with your configured secret.
3. **AI Vision extraction** — send the card image and require structured JSON.
4. **Validate and normalise** — lowercase email, trim phone and URL, flag missing/uncertain email.
5. **Duplicate check** — search Supabase by email, then by name + company.
6. **Upload card** — store original image in Supabase Storage or SharePoint.
7. **Insert/update contact** — use `supabase/schema.sql`.
8. **Draft email** — use meeting location and notes; keep it friendly and non-salesy.
9. **Respond to Webhook** — return the JSON shown above.

## AI extraction prompt

```
Read this business card carefully. Return only valid JSON with these keys:
full_name, company, job_title, email, phone, website, address, confidence, warnings.
Never invent missing values. Use an empty string when information is not visible.
The confidence field must be a number from 0 to 1. Put uncertain characters or fields in warnings.
```

## Email-draft prompt

```
Write a short and natural follow-up email from Esh at ArchZen to the person below.
They gave Esh their business card. This is relationship-building, not a sales email.
Mention where they met and one genuine detail from the notes when available.
Use simple Australian English. Do not claim that Esh researched them unless research was actually completed.
Maximum 110 words. Return JSON with subject and body.
```

## Safety rule

Do not send immediately after OCR. First show the extracted email address and draft for approval. Enable Microsoft Graph sending only after the review screen is working reliably.
