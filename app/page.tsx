"use client";

import { FormEvent, useMemo, useState } from "react";

type Result = {
  contactId?: string;
  name?: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  emailSubject?: string;
  emailBody?: string;
  warning?: string;
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return setMessage("Please take or select a photo of the business card.");
    setLoading(true); setMessage(""); setResult(null);
    const form = new FormData(event.currentTarget);
    form.set("card", file);
    try {
      const response = await fetch("/api/scan", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The card could not be processed.");
      setResult(data);
      setMessage("Card processed. Review the details and email draft below.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  return <main className="container">
    <header className="header">
      <div className="brand">ArchZen</div>
      <h1>Contact Vault</h1>
      <p className="sub">Photograph a visiting card, add a quick memory from the conversation, and prepare a personal follow-up without putting anyone into your CRM.</p>
    </header>

    <form className="card grid" onSubmit={submit}>
      <label className="upload">
        <span>Take a photo or choose a business card</span>
        <input required accept="image/*" capture="environment" type="file" name="card" onChange={(e) => {
          const selected = e.target.files?.[0] || null;
          setFile(selected);
          setPreview(selected ? URL.createObjectURL(selected) : "");
        }} />
        {preview && <img className="preview" src={preview} alt="Business card preview" />}
      </label>

      <label>Where did you meet?
        <select name="metAt" defaultValue="BNI">
          <option>BNI</option><option>Networking event</option><option>Client meeting</option><option>Expo</option><option>Referral</option><option>Other</option>
        </select>
      </label>
      <label>Date met<input type="date" name="dateMet" defaultValue={today} /></label>
      <label>What did you discuss?<textarea name="notes" placeholder="Example: Met at BNI. He owns an electrical business and mentioned issues managing job enquiries." /></label>

      <div className="actions"><button className="primary" disabled={loading}>{loading ? "Reading card…" : "Scan and prepare follow-up"}</button></div>
      {message && <div className={`notice ${result ? "success" : "error"}`}>{message}</div>}
    </form>

    {result && <section className="card contact">
      <h2>Review contact</h2>
      {[["Name",result.name],["Company",result.company],["Role",result.title],["Email",result.email],["Phone",result.phone],["Website",result.website],["Address",result.address]].map(([k,v]) => v ? <div className="row" key={k}><div className="key">{k}</div><div>{v}</div></div> : null)}
      {result.warning && <div className="notice">{result.warning}</div>}
      <h2>Email draft</h2>
      <label>Subject<input defaultValue={result.emailSubject || "Great meeting you"} /></label>
      <label style={{marginTop:12}}>Message<textarea style={{minHeight:260}} defaultValue={result.emailBody || ""} /></label>
      <div className="actions"><button className="secondary" type="button">Edit details</button><button className="primary" type="button" onClick={() => alert("Version 1 prepares the email. The Send button is enabled after the Microsoft Graph node is connected in n8n.")}>Approve and send</button></div>
    </section>}
  </main>;
}
