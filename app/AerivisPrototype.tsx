"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Role =
  | "Housing operations"
  | "Field specialist"
  | "Laboratory"
  | "Clinical reviewer"
  | "Legal reviewer"
  | "Resident";

type View = "Case overview" | "Evidence" | "Custody" | "People" | "Reports";

const roles: Role[] = [
  "Housing operations",
  "Field specialist",
  "Laboratory",
  "Clinical reviewer",
  "Legal reviewer",
  "Resident",
];

const roleInitials: Record<Role, string> = {
  "Housing operations": "HO",
  "Field specialist": "FS",
  Laboratory: "LB",
  "Clinical reviewer": "CR",
  "Legal reviewer": "LR",
  Resident: "RS",
};

const roleFocus: Record<
  Role,
  { title: string; body: string; items: string[]; action: string }
> = {
  "Housing operations": {
    title: "Keep the case inside the clock",
    body: "Triage, assign, monitor evidence and commission the next safe action from one auditable workspace.",
    items: [
      "10-day investigation timer",
      "Written-summary readiness",
      "Remediation owner and status",
    ],
    action: "Advance case stage",
  },
  "Field specialist": {
    title: "Deploy a controlled sample",
    body: "Pair the sealed cartridge, verify identity and location, then record a time-integrated sampling run.",
    items: [
      "QR cartridge pairing",
      "Pre-run calibration check",
      "Tamper event and location log",
    ],
    action: "Confirm field handoff",
  },
  Laboratory: {
    title: "Accession with provenance intact",
    body: "Receive the cartridge, record controls, process the validated assay and release quality-controlled findings.",
    items: [
      "Receipt and seal condition",
      "Batch controls and QC",
      "Versioned analysis pipeline",
    ],
    action: "Release lab findings",
  },
  "Clinical reviewer": {
    title: "Interpret within clinical limits",
    body: "Review consented health context and exposure evidence without presenting an environmental result as a diagnosis.",
    items: [
      "Purpose-limited health access",
      "Risk-factor summary",
      "Clinical boundary statement",
    ],
    action: "Complete clinical review",
  },
  "Legal reviewer": {
    title: "Trace every material fact",
    body: "Inspect method, custody, version history, assumptions and expert sign-off before an evidence pack is released.",
    items: [
      "Immutable event history",
      "Method and limitation schedule",
      "CPR 35 expert declaration",
    ],
    action: "Prepare legal bundle",
  },
  Resident: {
    title: "See what happens next",
    body: "A plain-language view of access, consent, appointments, findings and the landlord’s stated next action.",
    items: [
      "Accessible case timeline",
      "Granular consent controls",
      "Written summary receipt",
    ],
    action: "Acknowledge update",
  },
};

const baseSteps = [
  {
    title: "Hazard reported & triaged",
    detail: "Resident report received 29 Jul, 09:12",
    owner: "Housing",
  },
  {
    title: "Inspection & device deployment",
    detail: "Field appointment verified; cartridge AV-40218",
    owner: "Field",
  },
  {
    title: "24-hour environmental capture",
    detail: "Controlled volumetric run with contextual telemetry",
    owner: "Device",
  },
  {
    title: "Accession & laboratory analysis",
    detail: "Seal, controls and method version recorded",
    owner: "Lab",
  },
  {
    title: "Fungal & clinical interpretation",
    detail: "Purpose-limited expert review with clear boundaries",
    owner: "Experts",
  },
  {
    title: "Evidence pack & written summary",
    detail: "Method, custody, limitations and next action bundled",
    owner: "Legal",
  },
  {
    title: "Remediation & verification",
    detail: "Works commissioned; follow-up capture scheduled",
    owner: "Housing",
  },
];

const publicComparison = [
  {
    topic: "Capture",
    public:
      "A trained specialist takes surface swab samples in the home and ships them under guidance.",
    aerivis:
      "A controlled 24-hour volumetric air sample is paired with temperature, humidity, particulate, time and air-volume context.",
  },
  {
    topic: "Laboratory",
    public:
      "An independent contract laboratory sequences swab material to identify fungal species.",
    aerivis:
      "A versioned, quality-controlled partner-lab workflow links accession, controls, biological results and method limitations to the case.",
  },
  {
    topic: "People",
    public:
      "Health-record access is described via an NHS partner practice, subject to formal consent.",
    aerivis:
      "A consent centre gives purpose-limited access to the resident, clinical reviewer and legal team with visible expiry and revocation.",
  },
  {
    topic: "Interpretation",
    public:
      "Fungal and medically qualified experts interpret laboratory and occupant-health information.",
    aerivis:
      "The same expert chain is orchestrated digitally, with independent sign-offs, structured limitations and no automated clinical diagnosis.",
  },
  {
    topic: "Litigation",
    public:
      "The public site says assessments follow CPR 35 guidance and are suitable for civil proceedings if needed.",
    aerivis:
      "The proposed evidence pack adds a traceable method record, custody events, data versions, consent history and expert declaration.",
  },
  {
    topic: "Portfolio",
    public:
      "The public site presents an end-to-end professional service and enquiry-led customer journey.",
    aerivis:
      "A live operating layer tracks deadlines, repeat cases, remediation outcomes and exposure patterns across a housing portfolio.",
  },
];

const auditSeed = [
  {
    time: "29 Jul · 11:08",
    title: "Cartridge paired",
    detail: "AV-40218 · seal 9B71 · field specialist K. Shah",
  },
  {
    time: "29 Jul · 11:10",
    title: "Calibration check passed",
    detail: "Flow check 1.00 L/min · firmware 0.8.4",
  },
  {
    time: "29 Jul · 11:12",
    title: "Sampling run started",
    detail: "Bedroom 2 · device AER-C-014",
  },
];

function downloadEvidencePack(stage: number, role: Role) {
  const pack = {
    prototype: true,
    caseId: "AV-26-0418",
    generatedAt: new Date().toISOString(),
    generatedByRole: role,
    currentStage: baseSteps[stage]?.title ?? baseSteps.at(-1)?.title,
    methodStatus: "Concept workflow — analytical validation not complete",
    chainOfCustody: auditSeed,
    limitations: [
      "This prototype does not constitute a clinical diagnosis.",
      "It does not guarantee legal or regulatory compliance.",
      "Viability-selective fungal sequencing requires staged validation.",
      "Commercial operation remains gated by partner agreements and non-compete clearance.",
    ],
  };
  const blob = new Blob([JSON.stringify(pack, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aerivis-demo-evidence-pack.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AerivisPrototype() {
  const [role, setRole] = useState<Role>("Housing operations");
  const [view, setView] = useState<View>("Case overview");
  const [stage, setStage] = useState(2);
  const [consents, setConsents] = useState({
    environmental: true,
    health: true,
    legal: false,
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const focus = roleFocus[role];
  const progress = useMemo(() => Math.round(((stage + 0.45) / 7) * 100), [stage]);

  const advanceCase = () => {
    setStage((current) => Math.min(current + 1, baseSteps.length - 1));
    setToast(
      stage >= baseSteps.length - 1
        ? "This demo case is already at the verification stage."
        : `${role} handoff recorded in the case audit trail.`,
    );
  };

  const handleRoleAction = () => {
    if (role === "Legal reviewer") {
      downloadEvidencePack(stage, role);
      setToast("Prototype evidence pack generated locally.");
      return;
    }
    if (role === "Resident") {
      setToast("Resident acknowledgement recorded with timestamp.");
      return;
    }
    advanceCase();
  };

  const showDemo = () => {
    document.getElementById("case-demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <div className="announcement">
        <span className="live-dot" aria-hidden="true" />
        Partner prototype · concept workflow · validation gates clearly marked
      </div>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Aerivis home">
          <span className="wordmark-mark" aria-hidden="true" />
          <span className="wordmark-text">Aerivis</span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#system">System</a>
          <a href="#case-demo">Live case</a>
          <a href="#comparison">Market gap</a>
          <a href="#validation">Validation</a>
          <a className="nav-cta" href="#case-demo">
            Open prototype <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Environmental exposure intelligence</p>
            <h1>
              Evidence that moves <em>with the case.</em>
            </h1>
            <p className="hero-lead">
              Aerivis connects the resident report, the building, a controlled
              24-hour air sample, laboratory analysis, clinical context and legal
              review in one secure, traceable workflow.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={showDemo}>
                Run the partner demo <span aria-hidden="true">↓</span>
              </button>
              <a className="secondary-button" href="#system">
                See the whole system <span aria-hidden="true">↘</span>
              </a>
            </div>
            <ul className="hero-assurance">
              <li>Role-based workflow</li>
              <li>Consent by purpose</li>
              <li>Immutable custody trail</li>
            </ul>
          </div>

          <div className="device-stage" aria-label="Aerivis Collector concept">
            <div className="device-image-wrap">
              <Image
                className="device-image"
                src="/aerivis-collector.jpg"
                alt="Aerivis Collector concept with transparent sensor cartridge"
                width={1280}
                height={853}
                priority
                sizes="(max-width: 820px) 92vw, 54vw"
              />
            </div>
            <div className="device-signals" aria-label="Live concept telemetry">
              {[
                ["RH", "68%"],
                ["PM₂.₅", "12"],
                ["VOC", "0.18"],
              ].map(([label, value]) => (
                <span className="device-signal" key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </span>
              ))}
            </div>
            <div className="device-badge">
              <div className="device-badge-head">
                <span>Collector 014</span>
                <b className="live-dot" aria-hidden="true" />
              </div>
              <strong>Sampling</strong>
              <span>1.00 L/min · telemetry linked</span>
            </div>
          </div>
        </div>

        <div className="hero-metrics" aria-label="Awaab's Law timeframes">
          <div className="hero-metric">
            <strong>24h</strong>
            <span>Emergency hazards: investigate and make safe</span>
          </div>
          <div className="hero-metric">
            <strong>10</strong>
            <span>Working days to investigate significant damp or mould</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>Working days to provide the written investigation summary</span>
          </div>
          <div className="hero-metric">
            <strong>5</strong>
            <span>Working days after investigation to make the hazard safe</span>
          </div>
        </div>
      </section>

      <section className="section" id="system">
        <div className="section-inner">
          <div className="section-heading">
            <p className="section-kicker">One evidence spine</p>
            <div>
              <h2>Every specialist sees the same truth—at the right level.</h2>
              <p>
                The market already assembles skilled field, laboratory, fungal,
                medical and legal contributors. Aerivis turns that chain into an
                operating system: secure handoffs, shared deadlines, explicit
                limitations and a single evidence history.
              </p>
            </div>
          </div>

          <div className="system-flow">
            {[
              ["01", "Resident", "Report, access needs, consent and updates."],
              ["02", "Housing", "Triage, statutory clock, works and oversight."],
              ["03", "Field", "Inspect, pair, place and seal the sample."],
              ["04", "Laboratory", "Accession, controls, analysis and QC."],
              ["05", "Clinical", "Review consented context within clear limits."],
              ["06", "Legal", "Trace method, custody and expert sign-off."],
            ].map(([index, title, body]) => (
              <article className="flow-card" key={index}>
                <span className="flow-card-index">{index}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="flow-card-status">Role-scoped access</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="demo-section" id="case-demo">
        <div className="demo-header">
          <div>
            <p className="eyebrow">Interactive case workspace</p>
            <h2>Follow one report from triage to verified remediation.</h2>
          </div>
          <p>
            Switch roles inside the prototype. Advance the case, change consent,
            inspect live device telemetry and generate a local evidence pack.
          </p>
        </div>

        <div className="prototype-notice">
          <strong>Demo data only</strong>
          <span>
            No real resident, health or property data is stored or transmitted.
            Actions reset when this page is refreshed.
          </span>
        </div>

        <div className="app-frame">
          <aside className="app-rail" aria-label="Prototype navigation">
            <div className="app-brand">
              <span className="app-brand-mark">A</span>
              <span>
                <strong>AERIVIS</strong>
                <span>Compliance workspace</span>
              </span>
            </div>

            <p className="rail-label">Case workspace</p>
            <nav className="rail-nav">
              {(
                [
                  ["Case overview", "01"],
                  ["Evidence", "02"],
                  ["Custody", "03"],
                  ["People", "04"],
                  ["Reports", "05"],
                ] as [View, string][]
              ).map(([item, icon]) => (
                <button
                  className={`rail-button ${view === item ? "active" : ""}`}
                  key={item}
                  onClick={() => {
                    setView(item);
                    setToast(`${item} view selected for ${role}.`);
                  }}
                >
                  <span className="rail-icon">{icon}</span>
                  {item}
                </button>
              ))}
            </nav>

            <div className="role-switcher">
              <label htmlFor="role-select">View as</label>
              <select
                id="role-select"
                value={role}
                onChange={(event) => {
                  const nextRole = event.target.value as Role;
                  setRole(nextRole);
                  setToast(`Role switched to ${nextRole}.`);
                }}
              >
                {roles.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <div className="app-user">
                <span className="avatar">{roleInitials[role]}</span>
                <span>
                  <strong>{role}</strong>
                  <span>Demo access · scoped</span>
                </span>
              </div>
            </div>
          </aside>

          <div className="app-top">
            <div className="app-top-title">
              <strong>{view}</strong>
              <span className="secure-pill">Demo-safe session</span>
            </div>
            <div className="app-actions">
              <button
                className="icon-button"
                aria-label="Show notifications"
                onClick={() =>
                  setToast("2 actions are waiting: lab handoff and resident update.")
                }
              >
                2
              </button>
              <button
                className="small-button"
                onClick={() => {
                  downloadEvidencePack(stage, role);
                  setToast("Prototype evidence pack generated locally.");
                }}
              >
                Export pack
              </button>
              <button className="small-button dark" onClick={advanceCase}>
                Advance case
              </button>
            </div>
          </div>

          <div className="app-content">
            <div className="case-bar">
              <div>
                <h3>14 Calder Row, Flat 8</h3>
                <div className="case-meta">
                  <span>AV-26-0418</span>
                  <span>Significant damp & mould</span>
                  <span>Resident update due</span>
                </div>
              </div>
              <button
                className="case-chip"
                onClick={() => setToast("Case switcher contains 18 demo records.")}
              >
                <span>Portfolio · North region</span>
                <strong>18 open cases ▾</strong>
              </button>
            </div>

            <div className="deadline-grid">
              {[
                ["Investigation", "6d 4h", "Within 10-working-day window", false],
                ["Written summary", "Pending", "Starts on investigation finish", false],
                ["Make safe", "Unstarted", "Owner: Repairs & Assets", true],
                ["Case confidence", "82%", "Telemetry and custody complete", false],
              ].map(([label, value, note, warning]) => (
                <article
                  className={`deadline ${warning ? "warning" : ""}`}
                  key={String(label)}
                >
                  <div className="deadline-top">
                    <span>{label}</span>
                    <b aria-hidden="true" />
                  </div>
                  <strong>{value}</strong>
                  <p>{note}</p>
                </article>
              ))}
            </div>

            <div className="workspace-grid">
              <section className="panel">
                <div className="panel-head">
                  <h4>End-to-end case flow</h4>
                  <span>{progress}% evidence assembled</span>
                </div>
                <div className="case-flow">
                  {baseSteps.map((step, index) => {
                    const state =
                      index < stage ? "complete" : index === stage ? "current" : "";
                    return (
                      <div className={`case-step ${state}`} key={step.title}>
                        <span className="step-marker">
                          {index < stage ? "✓" : String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="step-copy">
                          <strong>{step.title}</strong>
                          <span>{step.detail}</span>
                        </span>
                        <span className="step-owner">{step.owner}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="panel role-focus">
                <p className="eyebrow">Your focus · {role}</p>
                <h4>{focus.title}</h4>
                <p>{focus.body}</p>
                <ul className="focus-list">
                  {focus.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button className="focus-action" onClick={handleRoleAction}>
                  {focus.action} →
                </button>
              </section>

              <section className="panel telemetry-panel">
                <div className="panel-head">
                  <h4>Collector 014 · live run</h4>
                  <span>AV-40218 · bedroom 2</span>
                </div>
                <div className="telemetry-body">
                  <div className="sample-orb">
                    <div className="sample-orb-inner">
                      <strong>06:42</strong>
                      <span>of 24 hours</span>
                    </div>
                  </div>
                  <div className="telemetry-readings">
                    {[
                      ["Flow rate", "1.00 L/min", "Stable"],
                      ["Volume", "402 L", "Expected"],
                      ["Humidity", "73% RH", "Elevated"],
                      ["Temperature", "18.4°C", "Stable"],
                      ["PM2.5", "13 µg/m³", "Context only"],
                    ].map(([label, value, state]) => (
                      <div className="reading" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                        <small>{state}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-head">
                  <h4>Chain of custody</h4>
                  <span>Hash-linked event log</span>
                </div>
                <ul className="audit-list">
                  {auditSeed.map((item) => (
                    <li className="audit-item" key={item.title}>
                      <span className="audit-time">{item.time}</span>
                      <span className="audit-copy">
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="panel">
                <div className="panel-head">
                  <h4>Consent centre</h4>
                  <span>Resident-controlled</span>
                </div>
                <div className="consent-body">
                  {(
                    [
                      ["environmental", "Environmental evidence", "Housing, field and lab"],
                      ["health", "Health context", "Clinical reviewer only"],
                      ["legal", "Legal case access", "Named legal reviewer"],
                    ] as [keyof typeof consents, string, string][]
                  ).map(([key, title, note]) => (
                    <div className="consent-row" key={key}>
                      <span>
                        <strong>{title}</strong>
                        <span>{note}</span>
                      </span>
                      <button
                        className={`toggle ${consents[key] ? "on" : ""}`}
                        aria-label={`${consents[key] ? "Disable" : "Enable"} ${title}`}
                        aria-pressed={consents[key]}
                        onClick={() => {
                          setConsents((current) => ({
                            ...current,
                            [key]: !current[key],
                          }));
                          setToast(`${title} permission updated in the consent log.`);
                        }}
                      />
                    </div>
                  ))}
                  <p className="consent-foot">
                    <span className="secure-pill">Scoped</span>
                    Health data is not visible to field or laboratory roles.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="compare-section" id="comparison">
        <div className="compare-grid">
          <div className="compare-intro">
            <p className="section-kicker">Competitor website review</p>
            <h2>Keep the expertise. Upgrade the evidence architecture.</h2>
            <p>
              Genetix’s public website presents a strong multidisciplinary service:
              trained sampling, contract-lab sequencing, consented health-record
              access, fungal interpretation, medical review and CPR 35 positioning.
              The opportunity is to make that chain digital, continuous and
              portfolio-operable—and to test airborne exposure, not only the sampled
              surface.
            </p>
            <a
              className="source-link"
              href="https://www.genetix.io/"
              target="_blank"
              rel="noreferrer"
            >
              Review the public Genetix journey ↗
            </a>
          </div>

          <div className="comparison-table" role="table" aria-label="Process comparison">
            <div className="comparison-row header" role="row">
              <span role="columnheader">Evidence question</span>
              <span role="columnheader">What Genetix publicly describes</span>
              <span role="columnheader">Aerivis proposed operating model</span>
            </div>
            {publicComparison.map((row) => (
              <div className="comparison-row" role="row" key={row.topic}>
                <h3 role="rowheader">{row.topic}</h3>
                <div className="comparison-cell public" role="cell">
                  {row.public}
                </div>
                <div className="comparison-cell aerivis" role="cell">
                  {row.aerivis}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="validation-section" id="validation">
        <div className="section-inner">
          <div className="section-heading">
            <p className="section-kicker">Honest by design</p>
            <div>
              <h2>A compelling demo with the scientific gates left visible.</h2>
              <p>
                Aerivis’s technical thesis is plausible, but the interpretation layer
                is not yet de-risked. The prototype makes provenance, uncertainty and
                validation status part of the product—not footnotes added later.
              </p>
            </div>
          </div>

          <div className="evidence-ladder">
            {[
              [
                "Concept ready",
                "Integrated Collector",
                "24-hour controlled airflow, cartridge identity, environmental sensing and secure export are defined for prototype development.",
                "Engineering specification",
              ],
              [
                "Validate next",
                "Sampling science",
                "Bench and field studies must establish airflow stability, filter recovery, storage performance and comparative representativeness.",
                "Alpha → beta",
              ],
              [
                "Highest risk",
                "Viability workflow",
                "PMA, PMAxx or an alternative must show repeatable live/dead discrimination across fungal genera and real environmental matrices.",
                "Decision gates required",
              ],
              [
                "Do not claim yet",
                "Health causation",
                "Exposure evidence may support professional interpretation. It is not, by itself, proof of infectivity, illness causation or clinical diagnosis.",
                "Expert boundary",
              ],
            ].map(([state, title, body, foot]) => (
              <article className="evidence-card" key={title}>
                <span className="evidence-state">{state}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <small>{foot}</small>
              </article>
            ))}
          </div>

          <div className="boundary-note">
            <strong>Product boundary</strong>
            <p>
              Aerivis is proposed as decision-support and evidence infrastructure. It
              does not guarantee Awaab’s Law compliance, replace a competent building
              investigation, issue a clinical diagnosis, or make an expert’s CPR 35
              judgment. Those responsibilities remain with the relevant professional
              and organisation.
            </p>
          </div>
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-grid">
          <div className="partner-copy">
            <p className="section-kicker">Partner pathway</p>
            <h2>Build the advantage before the market window closes.</h2>
            <p>
              The prototype is ready to align a hardware, laboratory, clinical and
              housing partner around one end-state. Commercial launch remains gated
              by method validation, information governance, partner contracting and
              clearance of the identified non-compete.
            </p>
          </div>

          <div className="partner-roadmap">
            {[
              [
                "01",
                "Co-design the service blueprint",
                "Lock roles, evidence standard, data boundary, lab accession and partner economics.",
                "Now",
              ],
              [
                "02",
                "Prove the measurement chain",
                "Prototype Collector and Cartridge; validate recovery, QC, secure handoff and usability.",
                "0–6 months",
              ],
              [
                "03",
                "Run controlled field pilots",
                "Compare across 50–100 buildings, conventional methods and pre/post remediation cases.",
                "6–12 months",
              ],
              [
                "04",
                "Convert to portfolio infrastructure",
                "After clearance and evidence gates, move from paid pilot to recurring compliance workspace.",
                "12–18 months",
              ],
            ].map(([index, title, body, state]) => (
              <div className="roadmap-item" key={index}>
                <span className="roadmap-index">{index}</span>
                <span className="roadmap-copy">
                  <strong>{title}</strong>
                  <span>{body}</span>
                </span>
                <span className="roadmap-state">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-card">
          <h2>
            One case. Every expert. <em>No broken handoffs.</em>
          </h2>
          <div className="final-side">
            <p>
              Use the working prototype to agree the partner model, field evidence
              standard and first validation pilot.
            </p>
            <button className="dark-button" onClick={showDemo}>
              Return to the live case ↑
            </button>
          </div>
        </div>

        <footer className="footer">
          <p className="footer-copy">
            Partner prototype · July 2026. Product imagery is illustrative. All case
            data is fictional. Scientific, clinical and legal outputs shown are
            proposed workflow examples and require validation, governance and
            qualified professional review before operational use.
          </p>
          <div className="footer-links">
            <a
              href="https://www.gov.uk/government/publications/awaabs-law-guidance-for-social-landlords/awaabs-law-guidance-for-social-landlords-timeframes-for-repairs-in-the-social-rented-sector"
              target="_blank"
              rel="noreferrer"
            >
              Awaab’s Law guidance
            </a>
            <a
              href="https://www.justice.gov.uk/courts/procedure-rules/civil/rules/part35"
              target="_blank"
              rel="noreferrer"
            >
              CPR Part 35
            </a>
            <a
              href="https://www.who.int/publications/i/item/9789289041683"
              target="_blank"
              rel="noreferrer"
            >
              WHO damp & mould
            </a>
          </div>
        </footer>
      </section>

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
