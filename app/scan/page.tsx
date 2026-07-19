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

  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [contact, setContact] = useState<ContactDetails>(initialContact);
  const [isReading, setIsReading] = useState(false);
  const [showReview, setShowReview] = useState(false);

  function openCardScanner() {
    fileInputRef.current?.click();
  }

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  function handleReadCard() {
    if (!imagePreview) {
      alert("Please select a business card first.");
      return;
    }

    setIsReading(true);

    // Temporary animation until n8n and AI are connected.
    window.setTimeout(() => {
      setIsReading(false);
      setShowReview(true);
    }, 1800);
  }

  function updateContact(
    field: keyof ContactDetails,
    value: string
  ) {
    setContact((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function removeImage() {
    setImagePreview("");
    setFileName("");
    setShowReview(false);
    setContact(initialContact);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function saveContact() {
    if (!contact.fullName.trim()) {
      alert("Please enter the person's name.");
      return;
    }

    if (!contact.email.trim() && !contact.phone.trim()) {
      alert("Please enter an email address or phone number.");
      return;
    }

    alert(
      `${contact.fullName} is ready to be saved. Database connection comes next.`
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
          <p className="scan-eyebrow">ARCHZEN CONNECT</p>
          <h1>Scan Business Card</h1>
          <p>
            Take a clear photo of the card. You can review everything before
            saving.
          </p>
        </div>
      </header>

      <section className="scan-layout">
        <article className="upload-panel">
          {!imagePreview ? (
            <button
              type="button"
              className="upload-zone"
              onClick={openCardScanner}
            >
              <div className="upload-icon">📷</div>

              <h2>Take or upload a photo</h2>

              <p>
                Position the complete business card inside the photo.
              </p>

              <span>Choose business card</span>
            </button>
          ) : (
            <div className="card-preview">
              <img src={imagePreview} alt="Selected business card" />

              <div className="preview-footer">
                <div>
                  <small>Selected card</small>
                  <strong>{fileName}</strong>
                </div>

                <button type="button" onClick={removeImage}>
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
              {isReading ? "Reading business card..." : "Read business card"}
            </button>
          )}

          {isReading && (
            <div className="reading-panel">
              <div className="reading-line">
                <span />
              </div>

              <p>Reading contact details...</p>

              <div className="reading-items">
                <span>✓ Name</span>
                <span>✓ Company</span>
                <span>✓ Email</span>
                <span>✓ Phone</span>
              </div>
            </div>
          )}
        </article>

        <article
          className={`review-panel ${
            showReview ? "review-panel-visible" : ""
          }`}
        >
          <div className="review-heading">
            <div>
              <p className="scan-eyebrow">REVIEW CONTACT</p>
              <h2>Check the details</h2>
            </div>

            <span className="review-status">
              {showReview ? "Ready for review" : "Waiting for card"}
            </span>
          </div>

          {!showReview ? (
            <div className="review-empty">
              <div>✨</div>
              <h3>Contact details will appear here</h3>
              <p>
                Upload a card and select “Read business card” to continue.
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
                      updateContact("fullName", event.target.value)
                    }
                    placeholder="John Smith"
                    required
                  />
                </label>

                <label>
                  Company
                  <input
                    type="text"
                    value={contact.company}
                    onChange={(event) =>
                      updateContact("company", event.target.value)
                    }
                    placeholder="ABC Construction"
                  />
                </label>

                <label>
                  Position
                  <input
                    type="text"
                    value={contact.jobTitle}
                    onChange={(event) =>
                      updateContact("jobTitle", event.target.value)
                    }
                    placeholder="Director"
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(event) =>
                      updateContact("email", event.target.value)
                    }
                    placeholder="john@example.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(event) =>
                      updateContact("phone", event.target.value)
                    }
                    placeholder="0400 000 000"
                  />
                </label>

                <label>
                  Website
                  <input
                    type="text"
                    value={contact.website}
                    onChange={(event) =>
                      updateContact("website", event.target.value)
                    }
                    placeholder="example.com.au"
                  />
                </label>
              </div>

              <label>
                Address
                <input
                  type="text"
                  value={contact.address}
                  onChange={(event) =>
                    updateContact("address", event.target.value)
                  }
                  placeholder="Melbourne, Victoria"
                />
              </label>

              <label>
                Where did you meet?
                <select
                  value={contact.metAt}
                  onChange={(event) =>
                    updateContact("metAt", event.target.value)
                  }
                >
                  <option value="">Select an option</option>
                  <option value="BNI">BNI</option>
                  <option value="Business event">Business event</option>
                  <option value="Client meeting">Client meeting</option>
                  <option value="Referral">Referral</option>
                  <option value="Networking">Networking</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Conversation notes
                <textarea
                  value={contact.notes}
                  onChange={(event) =>
                    updateContact("notes", event.target.value)
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

                <button type="submit" className="save-contact-button">
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
