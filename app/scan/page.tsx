"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ContactDetails = {
  fullName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  metAt: string;
  notes: string;
};

const initialContact: ContactDetails = {
  fullName: "",
  company: "",
  jobTitle: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  metAt: "",
  notes: "",
};

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");

  const [contact, setContact] =
    useState<ContactDetails>(initialContact);

  const [isReading, setIsReading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function openCardScanner() {
    fileInputRef.current?.click();
  }

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose a valid image file.");
      return;
    }

    const maximumFileSize = 4 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      setErrorMessage(
        "The business card image must be smaller than 4 MB."
      );
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
    setFileName(file.name);
    setShowReview(false);
    setContact(initialContact);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(String(reader.result));
    };

    reader.onerror = () => {
      setErrorMessage("The selected image could not be opened.");
    };

    reader.readAsDataURL(file);
  }

  async function handleReadCard() {
    if (!selectedFile) {
      setErrorMessage("Please select a business card first.");
      return;
    }

    try {
      setIsReading(true);
      setErrorMessage("");
      setShowReview(false);

      const formData = new FormData();
      formData.append("card", selectedFile);

      const response = await fetch("/api/read-card", {
        method: "POST",
        body: formData,
      });

     const responseText = await response.text();

let result: any;

try {
  result = JSON.parse(responseText);
} catch {
  throw new Error(
    response.status === 413
      ? "This photo is too large. Please upload an image smaller than 4 MB."
      : responseText || "The server returned an unexpected response."
  );
}
      if (!response.ok) {
        throw new Error(
          result?.error ||
            "The business card could not be read."
        );
      }

      if (!result?.contact) {
        throw new Error(
          "No contact information was returned."
        );
      }

      setContact({
        fullName: result.contact.fullName || "",
        company: result.contact.company || "",
        jobTitle: result.contact.jobTitle || "",
        email: result.contact.email || "",
        phone: result.contact.phone || "",
        website: result.contact.website || "",
        address: result.contact.address || "",
        metAt: "",
        notes: "",
      });

      setShowReview(true);
    } catch (error) {
      console.error("Business card reading error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while reading the card."
      );
    } finally {
      setIsReading(false);
    }
  }

  function updateContact(
    field: keyof ContactDetails,
    value: string
  ) {
    setContact((currentContact) => ({
      ...currentContact,
      [field]: value,
    }));
  }

  function removeImage() {
    setSelectedFile(null);
    setImagePreview("");
    setFileName("");
    setShowReview(false);
    setIsReading(false);
    setErrorMessage("");
    setContact(initialContact);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function saveContact() {
    if (!contact.fullName.trim()) {
      setErrorMessage(
        "Please enter the person’s full name."
      );
      return;
    }

    if (
      !contact.email.trim() &&
      !contact.phone.trim()
    ) {
      setErrorMessage(
        "Please enter an email address or phone number."
      );
      return;
    }

    setErrorMessage("");

    alert(
      `${contact.fullName} is ready to save. We will connect Supabase next.`
    );
  }

  return (
    <main className="scan-page">
      <header className="scan-header">
        <button
          type="button"
          className="back-button"
          onClick={() => router.push("/")}
        >
          ← Back
        </button>

        <div>
          <p className="scan-eyebrow">
            ARCHZEN CONNECT
          </p>

          <h1>Scan Business Card</h1>

          <p>
            Take a clear photo of the card. You can check
            and edit everything before saving.
          </p>
        </div>
      </header>

      {errorMessage && (
        <div className="scan-error-message">
          <span>⚠️</span>

          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() => setErrorMessage("")}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      <section className="scan-layout">
        <article className="upload-panel">
          {!imagePreview ? (
            <button
              type="button"
              className="upload-zone"
              onClick={openCardScanner}
              disabled={isReading}
            >
              <div className="upload-icon">📷</div>

              <h2>Take or upload a photo</h2>

              <p>
                Make sure the complete business card is
                visible and the text is clear.
              </p>

              <span>Choose business card</span>
            </button>
          ) : (
            <div className="card-preview">
              <img
                src={imagePreview}
                alt="Selected business card"
              />

              <div className="preview-footer">
                <div>
                  <small>Selected card</small>
                  <strong>{fileName}</strong>
                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isReading}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            className="hidden-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelection}
          />

          {imagePreview && !showReview && (
            <button
              type="button"
              className="read-card-button"
              onClick={handleReadCard}
              disabled={isReading}
            >
              {isReading
                ? "AI is reading the business card..."
                : "Read business card with AI"}
            </button>
          )}

          {isReading && (
            <div className="reading-panel">
              <div className="reading-line">
                <span />
              </div>

              <p>Reading contact details...</p>

              <div className="reading-items">
                <span>Checking name</span>
                <span>Checking company</span>
                <span>Checking email</span>
                <span>Checking phone</span>
              </div>
            </div>
          )}

          {showReview && (
            <div className="reading-success">
              <span>✓</span>

              <div>
                <strong>Card successfully read</strong>
                <p>
                  Check the extracted information before
                  saving.
                </p>
              </div>
            </div>
          )}
        </article>

        <article
          className={`review-panel ${
            showReview
              ? "review-panel-visible"
              : ""
          }`}
        >
          <div className="review-heading">
            <div>
              <p className="scan-eyebrow">
                REVIEW CONTACT
              </p>

              <h2>Check the details</h2>
            </div>

            <span className="review-status">
              {showReview
                ? "Ready for review"
                : isReading
                  ? "AI is reading"
                  : "Waiting for card"}
            </span>
          </div>

          {!showReview ? (
            <div className="review-empty">
              <div>{isReading ? "🔎" : "✨"}</div>

              <h3>
                {isReading
                  ? "AI is reading the card"
                  : "Contact details will appear here"}
              </h3>

              <p>
                {isReading
                  ? "This usually takes only a few seconds."
                  : "Upload a card and select “Read business card with AI” to continue."}
              </p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={(event) => {
                event.preventDefault();
                saveContact();
              }}
            >
              <div className="form-grid">
                <label>
                  Full name

                  <input
                    type="text"
                    value={contact.fullName}
                    onChange={(event) =>
                      updateContact(
                        "fullName",
                        event.target.value
                      )
                    }
                    placeholder="Full name"
                    required
                  />
                </label>

                <label>
                  Company

                  <input
                    type="text"
                    value={contact.company}
                    onChange={(event) =>
                      updateContact(
                        "company",
                        event.target.value
                      )
                    }
                    placeholder="Company name"
                  />
                </label>

                <label>
                  Position

                  <input
                    type="text"
                    value={contact.jobTitle}
                    onChange={(event) =>
                      updateContact(
                        "jobTitle",
                        event.target.value
                      )
                    }
                    placeholder="Job title"
                  />
                </label>

                <label>
                  Email

                  <input
                    type="email"
                    value={contact.email}
                    onChange={(event) =>
                      updateContact(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="Email address"
                  />
                </label>

                <label>
                  Phone

                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(event) =>
                      updateContact(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="Phone number"
                  />
                </label>

                <label>
                  Website

                  <input
                    type="text"
                    value={contact.website}
                    onChange={(event) =>
                      updateContact(
                        "website",
                        event.target.value
                      )
                    }
                    placeholder="Website"
                  />
                </label>
              </div>

              <label>
                Address

                <input
                  type="text"
                  value={contact.address}
                  onChange={(event) =>
                    updateContact(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="Business address"
                />
              </label>

              <label>
                Where did you meet?

                <select
                  value={contact.metAt}
                  onChange={(event) =>
                    updateContact(
                      "metAt",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select an option
                  </option>

                  <option value="BNI">BNI</option>

                  <option value="Business event">
                    Business event
                  </option>

                  <option value="Client meeting">
                    Client meeting
                  </option>

                  <option value="Referral">
                    Referral
                  </option>

                  <option value="Networking">
                    Networking
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label>
                Conversation notes

                <textarea
                  value={contact.notes}
                  onChange={(event) =>
                    updateContact(
                      "notes",
                      event.target.value
                    )
                  }
                  placeholder="What did you discuss? What should you remember?"
                  rows={4}
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-review-button"
                  onClick={removeImage}
                >
                  Start again
                </button>

                <button
                  type="submit"
                  className="save-contact-button"
                >
                  Save contact →
                </button>
              </div>
            </form>
          )}
        </article>
      </section>
    </main>
  );
}
