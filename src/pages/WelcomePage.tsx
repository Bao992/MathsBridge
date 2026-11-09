import { useEffect, useState } from "react";
import { Link } from "../app/Router";
import { Button } from "../components/Button";
import { OfflineBanner } from "../components/OfflineBanner";
import "./WelcomePage.css";

interface WelcomePageProps {
  startupError?: boolean;
}

function BookBridgeArtwork() {
  return (
    <svg className="book-bridge-art" viewBox="0 0 280 150" aria-hidden="true" focusable="false">
      <ellipse cx="140" cy="132" rx="114" ry="10" fill="var(--color-illustration-shadow)" />
      <path d="M38 53c27-9 57-8 84 2v66c-27-11-56-13-84-5V53Z" fill="var(--color-illustration-book-blue)" stroke="var(--color-primary)" strokeWidth="4" />
      <path d="M158 55c28-10 58-11 84-2v63c-28-8-57-6-84 5V55Z" fill="var(--color-illustration-book-teal)" stroke="var(--color-accent-deep)" strokeWidth="4" />
      <path d="M140 53v67" stroke="var(--color-accent-deep)" strokeWidth="4" strokeDasharray="5 5" />
      <path d="M51 37c26-28 60-39 89-39s63 11 89 39" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
      <path d="M140 0v37" stroke="var(--color-accent-deep)" strokeWidth="4" strokeDasharray="4 5" />
      <circle cx="140" cy="0" r="7" fill="var(--color-accent-deep)" />
      <path d="M55 70c23-4 44-3 65 4m-65 13c22-3 43-1 65 6" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" opacity=".72" />
      <path d="M160 70c21-7 42-8 65-4m-65 23c22-7 43-9 65-6" fill="none" stroke="var(--color-accent-deep)" strokeWidth="3" strokeLinecap="round" opacity=".72" />
    </svg>
  );
}

function BrandBookIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M4 7c5-2 9-1 12 1v18c-3-2-7-3-12-1V7Zm24 0c-5-2-9-1-12 1v18c3-2 7-3 12-1V7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 5c3-3 7-3 10-1M26 5c-3-3-7-3-10-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type WelcomeIconName = "language" | "grades" | "math" | "speech" | "account" | "login";

function WelcomeIcon({ name }: { name: WelcomeIconName }) {
  const shared = {
    className: "welcome-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "language":
      return <svg {...shared}><path d="M4 5h9M8.5 3v2m3.7 0c-.6 4-3.4 7.2-7.2 9M5.5 8c1.3 2.5 3.7 4.7 6.4 6M15 17h6m-3-8 4 12m-8 0 4-12" /></svg>;
    case "grades":
      return <svg {...shared}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3.6 2.8 8.4 2.8 12 0v-5M22 9v6" /></svg>;
    case "math":
      return <svg {...shared}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 12h2m4 0h2M8 16h2m4 0h2" /></svg>;
    case "speech":
      return <svg {...shared}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9h8m-8 4h5" /></svg>;
    case "account":
      return <svg {...shared}><path d="M15 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20h13Z" /><circle cx="8.5" cy="7" r="3.5" /><path d="M19 7v6m-3-3h6" /></svg>;
    case "login":
      return <svg {...shared}><path d="M14 4h5v16h-5M10 8l4 4-4 4m4-4H3" /></svg>;
  }
}

function useOfflineStatus(): boolean {
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return offline;
}

export function WelcomePage({ startupError = false }: WelcomePageProps) {
  const offline = useOfflineStatus();

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <Link className="brand" to="/" aria-label="MathsBridge home">
          <span className="brand-mark"><BrandBookIcon /></span>
          <span className="brand-copy">
            <strong>MathsBridge</strong>
            <span>Sepedi &amp; English Companion</span>
          </span>
        </Link>
        <span className="language-pill" aria-label="Sepedi and English">
          <WelcomeIcon name="language" /> Sep / Eng
        </span>
      </header>

      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="welcome-illustration">
          <BookBridgeArtwork />
          <p className="welcome-tagline">Tseba Dipalo • Bridge to Fluency</p>
        </div>

        {startupError && (
          <p className="startup-error" role="alert">
            MathsBridge couldn’t start. Refresh the page.
          </p>
        )}

        <h1 id="welcome-title">Understand Mathematics, one topic at a time.</h1>
        <p className="welcome-description">
          Sepedi explanations, English Mathematics terms, worked examples and practice.
        </p>

        <ul className="welcome-badges" aria-label="Learning details">
          <li><WelcomeIcon name="grades" /> Grades 4–7</li>
          <li><WelcomeIcon name="math" /> Mathematics</li>
          <li className="welcome-badge--accent"><WelcomeIcon name="speech" /> Sepedi + English</li>
        </ul>
      </section>

      <OfflineBanner offline={offline} />

      <nav className="welcome-actions" aria-label="Account access">
        <Button href="/sign-up" variant="primary" className="welcome-action">
          <WelcomeIcon name="account" /> Create caregiver account
        </Button>
        <Button href="/login" variant="secondary" className="welcome-action">
          <WelcomeIcon name="login" /> Log in
        </Button>
      </nav>
    </main>
  );
}
