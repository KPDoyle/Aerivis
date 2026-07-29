"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useState } from "react";
import AerivisMark from "../AerivisMark";

type Tone = "azure" | "light" | "mono";

const reviewItems = [
  {
    score: "Strong",
    title: "Strategic relevance",
    body: "The air-channel A, orbit and capture point connect naturally to airborne evidence, measurement and a joined-up case.",
  },
  {
    score: "Strong",
    title: "Distinctive silhouette",
    body: "The asymmetric tile and crossing orbit are recognisable without depending on the company name.",
  },
  {
    score: "Refine",
    title: "Small-size clarity",
    body: "The orbit detail needs a simplified micro-mark below 24px so favicons and device indicators stay crisp.",
  },
  {
    score: "Build",
    title: "Asset governance",
    body: "A launch identity needs master artwork, clear-space rules, colour values and locked assets for partners.",
  },
];

const applications = [
  {
    className: "application-navigation",
    label: "Platform navigation",
    detail: "Primary lockup · dark environment",
  },
  {
    className: "application-report",
    label: "Evidence report",
    detail: "Monochrome-safe · formal output",
  },
  {
    className: "application-device",
    label: "Collector identity",
    detail: "Mark-only · physical product",
  },
];

export default function BrandStudio() {
  const [tone, setTone] = useState<Tone>("azure");
  const [size, setSize] = useState(52);
  const [motion, setMotion] = useState(false);

  const previewStyle = {
    "--preview-scale": String(size / 38),
  } as CSSProperties;

  return (
    <main className="brand-studio">
      <header className="brand-studio-nav">
        <Link className="brand-studio-home" href="/" aria-label="Return to Aerivis">
          <AerivisMark compact />
          <span>
            <strong>AERIVIS</strong>
            <small>Brand lab · v0.2</small>
          </span>
        </Link>
        <Link className="brand-back-link" href="/">
          Return to platform demo <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="brand-studio-hero">
        <div className="brand-studio-intro">
          <p className="brand-lab-kicker">Identity review · live system</p>
          <h1>
            A mark for evidence <em>in motion.</em>
          </h1>
          <p>
            Aerivis needs to feel scientifically credible, operationally serious and
            modern enough to lead a new category. The current direction has a strong
            strategic idea; this lab tests whether it can behave like a mature brand.
          </p>
          <div className="brand-verdict">
            <span>Review verdict</span>
            <strong>Promising system. One refinement round from launch-ready.</strong>
          </div>
        </div>

        <div className="brand-lab" aria-label="Interactive Aerivis logo demo">
          <div className={`brand-lab-stage tone-${tone} ${motion ? "motion-on" : ""}`}>
            <div className="brand-lab-lockup" style={previewStyle}>
              <AerivisMark />
              <span className="brand-lab-wordmark">
                <strong>AERIVIS</strong>
                <small>Exposure intelligence</small>
              </span>
            </div>
            <span className="brand-lab-readout">
              {size}px · {tone} · {motion ? "motion" : "static"}
            </span>
          </div>

          <div className="brand-controls">
            <fieldset>
              <legend>Environment</legend>
              <div className="brand-segmented">
                {(["azure", "light", "mono"] as Tone[]).map((item) => (
                  <button
                    className={tone === item ? "active" : ""}
                    key={item}
                    type="button"
                    aria-pressed={tone === item}
                    onClick={() => setTone(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="brand-size-control">
              <span>
                Mark size <strong>{size}px</strong>
              </span>
              <input
                type="range"
                min="24"
                max="72"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
              />
            </label>

            <label className="brand-motion-control">
              <span>
                <strong>Purposeful motion</strong>
                <small>Digital product contexts only</small>
              </span>
              <input
                type="checkbox"
                checked={motion}
                onChange={(event) => setMotion(event.target.checked)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="brand-review-section">
        <div className="brand-section-heading">
          <p className="brand-lab-kicker">Brand audit</p>
          <div>
            <h2>What an established brand team would test.</h2>
            <p>
              The question is not whether the mark looks attractive at one size. It is
              whether it stays recognisable, controlled and credible across every
              touchpoint.
            </p>
          </div>
        </div>

        <div className="brand-review-grid">
          {reviewItems.map((item, index) => (
            <article key={item.title}>
              <span className="brand-review-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`brand-review-score score-${item.score.toLowerCase()}`}>
                {item.score}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-scale-section">
        <div className="brand-section-heading">
          <p className="brand-lab-kicker">Responsive identity</p>
          <div>
            <h2>One idea, calibrated for the context.</h2>
            <p>
              Mature systems do not force one ornate file everywhere. They define a
              primary lockup, a compact product mark and a simplified micro-mark.
            </p>
          </div>
        </div>

        <div className="brand-scale-grid">
          <article className="scale-card scale-primary">
            <div className="scale-preview">
              <AerivisMark />
              <span>
                <strong>AERIVIS</strong>
                <small>Exposure intelligence</small>
              </span>
            </div>
            <div>
              <strong>Primary lockup</strong>
              <span>Website, proposals, partner materials</span>
            </div>
          </article>

          <article className="scale-card scale-compact">
            <div className="scale-preview">
              <AerivisMark compact />
              <strong>AERIVIS</strong>
            </div>
            <div>
              <strong>Compact lockup</strong>
              <span>Application navigation, narrow formats</span>
            </div>
          </article>

          <article className="scale-card scale-micro">
            <div className="micro-mark" aria-label="Proposed simplified micro-mark">
              A
            </div>
            <div>
              <strong>Micro-mark · proposed</strong>
              <span>Favicon, alerts, device status under 24px</span>
            </div>
          </article>
        </div>
      </section>

      <section className="brand-application-section">
        <div className="brand-section-heading">
          <p className="brand-lab-kicker">Application test</p>
          <div>
            <h2>The identity has to work where trust is earned.</h2>
            <p>
              Digital casework, formal evidence and physical sampling each demand a
              different level of expression while preserving one recognisable system.
            </p>
          </div>
        </div>

        <div className="brand-application-grid">
          {applications.map((item) => (
            <article className={item.className} key={item.label}>
              <div className="application-canvas">
                {item.className === "application-navigation" ? (
                  <>
                    <span className="application-lockup">
                      <AerivisMark compact />
                      <strong>AERIVIS</strong>
                    </span>
                    <span className="application-nav-lines">
                      <i />
                      <i />
                      <i />
                    </span>
                  </>
                ) : null}

                {item.className === "application-report" ? (
                  <>
                    <span className="report-mark">
                      <span className="micro-mark">A</span>
                      <strong>AERIVIS</strong>
                    </span>
                    <span className="report-copy">
                      <small>Evidence record</small>
                      <strong>Environmental exposure summary</strong>
                      <i />
                      <i />
                      <i />
                    </span>
                  </>
                ) : null}

                {item.className === "application-device" ? (
                  <span className="device-application-shell">
                    <span className="device-application-screen">SAMPLING</span>
                    <AerivisMark />
                  </span>
                ) : null}
              </div>
              <footer>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-next-section">
        <div>
          <p className="brand-lab-kicker">Recommendation</p>
          <h2>Keep the concept. Simplify the smallest expression.</h2>
        </div>
        <div className="brand-next-list">
          <span>
            <b>01</b>
            Commission master vector artwork and optical corrections.
          </span>
          <span>
            <b>02</b>
            Approve a micro-mark, monochrome master and minimum-size rule.
          </span>
          <span>
            <b>03</b>
            Complete trademark clearance before external launch.
          </span>
          <span>
            <b>04</b>
            Publish one controlled partner asset pack and usage guide.
          </span>
        </div>
      </section>

      <footer className="brand-studio-footer">
        <span>Aerivis identity prototype · partner review</span>
        <Link href="/">Open the platform demonstration →</Link>
      </footer>
    </main>
  );
}
