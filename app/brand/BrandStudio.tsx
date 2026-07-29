"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";
import AerivisMark from "../AerivisMark";

type CanvasMode = "deep" | "light" | "mono";
type LogoView = "lockup" | "mark";

const audit = [
  ["Distinctive", "92"],
  ["Relevant", "95"],
  ["Scalable", "88"],
  ["Ownable", "86"],
];

export default function BrandStudio() {
  const [mode, setMode] = useState<CanvasMode>("deep");
  const [view, setView] = useState<LogoView>("lockup");
  const [motion, setMotion] = useState(true);

  return (
    <main className="identity-page">
      <header className="identity-nav">
        <Link className="identity-home" href="/" aria-label="Aerivis home">
          <AerivisMark compact />
          <span>AERIVIS</span>
        </Link>
        <span className="identity-edition">Identity / Direction 02</span>
        <Link className="identity-exit" href="/">
          Platform demo <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="identity-hero">
        <div className="identity-hero-copy">
          <p className="identity-overline">Environmental exposure intelligence</p>
          <h1>
            Air becomes
            <span>evidence.</span>
          </h1>
          <p className="identity-hero-note">
            A sharper identity for a system that captures an invisible signal and
            carries it, intact, through every handoff.
          </p>
        </div>

        <div className="identity-live" aria-label="Interactive Aerivis logo demo">
          <div
            className={`identity-canvas canvas-${mode} view-${view} ${
              motion ? "is-live" : ""
            }`}
          >
            <span className="identity-canvas-index">A / 01</span>
            <div className="identity-lockup">
              <AerivisMark />
              {view === "lockup" ? (
                <span className="identity-wordmark">
                  <strong>AERIVIS</strong>
                  <small>Exposure intelligence</small>
                </span>
              ) : null}
            </div>
            <span className="identity-canvas-status">
              <i aria-hidden="true" />
              Live identity system
            </span>
          </div>

          <div className="identity-console">
            <div className="identity-control">
              <span>Canvas</span>
              <div>
                {(["deep", "light", "mono"] as CanvasMode[]).map((item) => (
                  <button
                    className={mode === item ? "active" : ""}
                    type="button"
                    key={item}
                    aria-pressed={mode === item}
                    onClick={() => setMode(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="identity-control">
              <span>Expression</span>
              <div>
                {(["lockup", "mark"] as LogoView[]).map((item) => (
                  <button
                    className={view === item ? "active" : ""}
                    type="button"
                    key={item}
                    aria-pressed={view === item}
                    onClick={() => setView(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`identity-motion ${motion ? "active" : ""}`}
              type="button"
              aria-pressed={motion}
              onClick={() => setMotion((current) => !current)}
            >
              <span>
                Motion
                <small>Purposeful motion only</small>
              </span>
              <i aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="identity-scroll-cue">
          <span>Explore the system</span>
          <i aria-hidden="true" />
        </div>
      </section>

      <div className="identity-marquee" aria-hidden="true">
        <span>AIR</span>
        <i />
        <span>CAPTURE</span>
        <i />
        <span>TRACE</span>
        <i />
        <span>EVIDENCE</span>
        <i />
        <span>TRUST</span>
      </div>

      <section className="identity-rationale">
        <div className="identity-section-label">
          <span>01</span>
          <p>Design rationale</p>
        </div>
        <div className="identity-rationale-main">
          <h2>Less symbol.<br />More signal.</h2>
          <p>
            The previous tile and orbit carried too much visual furniture. Direction
            02 removes the container and reduces the idea to two elements: an
            air-formed A and a trace line ending in a verified point.
          </p>
        </div>
        <div className="identity-principles">
          <article>
            <span>01 / Air</span>
            <strong>Open geometry</strong>
            <p>The rising form feels breathable, technical and directional.</p>
          </article>
          <article>
            <span>02 / Evidence</span>
            <strong>Unbroken trace</strong>
            <p>A single line carries the signal through a defined evidence point.</p>
          </article>
          <article>
            <span>03 / System</span>
            <strong>Built to reduce</strong>
            <p>The same mark holds from product interface to device and report.</p>
          </article>
        </div>
      </section>

      <section className="identity-audit">
        <div className="identity-audit-head">
          <div className="identity-section-label">
            <span>02</span>
            <p>Brand stress test</p>
          </div>
          <h2>Designed to survive the real world.</h2>
          <p>
            The new direction trades decoration for recognition. It remains clear in
            motion, in monochrome and at the compact sizes where the first concept
            became fragile.
          </p>
        </div>

        <div className="identity-scoreboard">
          {audit.map(([label, score]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{score}</strong>
              <i style={{ "--score": `${score}%` } as CSSProperties} />
            </div>
          ))}
        </div>
      </section>

      <section className="identity-uses">
        <div className="identity-section-label">
          <span>03</span>
          <p>Applied identity</p>
        </div>
        <div className="identity-use-grid">
          <article className="identity-use-product">
            <header>
              <span>Product / Navigation</span>
              <small>Dark expression</small>
            </header>
            <div className="identity-product-shell">
              <div className="identity-product-rail">
                <span className="identity-mini-lockup">
                  <AerivisMark compact />
                  <strong>AERIVIS</strong>
                </span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="identity-product-screen">
                <span>CASE / AV-26-0418</span>
                <strong>Evidence chain</strong>
                <div>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </article>

          <article className="identity-use-device">
            <header>
              <span>Collector / Hardware</span>
              <small>Mark expression</small>
            </header>
            <div className="identity-device">
              <span className="identity-device-screen">
                <small>Air sample</small>
                <strong>Sampling</strong>
                <i />
              </span>
              <AerivisMark />
            </div>
          </article>

          <article className="identity-use-report">
            <header>
              <span>Evidence / Formal output</span>
              <small>Monochrome expression</small>
            </header>
            <div className="identity-report">
              <span className="identity-report-brand">
                <AerivisMark compact />
                <strong>AERIVIS</strong>
              </span>
              <p>Environmental exposure evidence</p>
              <h3>Case AV-26-0418</h3>
              <div>
                <i />
                <i />
                <i />
              </div>
              <small>Controlled report / 29.07.26</small>
            </div>
          </article>
        </div>
      </section>

      <section className="identity-decision">
        <p className="identity-overline">Recommendation</p>
        <h2>
          Advance direction 02.
          <span>Optically refine before registration.</span>
        </h2>
        <div>
          <p>
            The strategic idea is now clear enough to own: invisible air becomes a
            visible, traceable evidence signal.
          </p>
          <Link href="/">Return to the Aerivis platform <span>↗</span></Link>
        </div>
      </section>

      <footer className="identity-footer">
        <span>© 2026 Aerivis</span>
        <span>Identity prototype / Partner review</span>
      </footer>
    </main>
  );
}
