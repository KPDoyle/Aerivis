"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AerivisMark from "./AerivisMark";

type Role =
  | "Housing operations"
  | "Field specialist"
  | "Laboratory"
  | "Clinical reviewer"
  | "Legal reviewer"
  | "Resident";

type View = "Case overview" | "Evidence" | "Custody" | "People" | "Reports";
type IntakeAnswer = "yes" | "no" | "unsure";

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

const residentQuestions = [
  {
    title: "Do you rent your home?",
    body: "This may be from a council, housing association or private landlord.",
  },
  {
    title: "Is there visible damp or mould in the home?",
    body: "Include recurring patches, condensation, staining or a persistent musty smell.",
  },
  {
    title: "Have you told your landlord or agent in writing?",
    body: "An email, repair portal message, letter or text can help establish a clear record.",
  },
  {
    title: "Is anyone in the household experiencing symptoms you are concerned about?",
    body: "Aerivis cannot diagnose illness. A clinician may review relevant health context with consent.",
  },
];

const publicComparison = [
  {
    topic: "Capture",
    public:
      "Photos or a surface swab may record one visible patch at one moment, with limited environmental context.",
    aerivis:
      "A controlled 24-hour air sample is paired with temperature, humidity, particulate, time and air-volume context.",
  },
  {
    topic: "Record",
    public:
      "Reports, repair messages, appointments and health concerns can sit across phones, inboxes and organisations.",
    aerivis:
      "The resident’s history, property evidence, sample identity, custody events and next actions remain in one case record.",
  },
  {
    topic: "Laboratory",
    public:
      "A result can arrive without enough method, quality-control or chain-of-custody detail for legal scrutiny.",
    aerivis:
      "A partner laboratory works per case, with accession, controls, method version and limitations attached to the result.",
  },
  {
    topic: "Health context",
    public:
      "Residents may be asked to repeat sensitive information without a clear view of who can access it.",
    aerivis:
      "A clinician is paid by the hour for consented review. Environmental evidence is never presented as a diagnosis.",
  },
  {
    topic: "Legal route",
    public:
      "The resident may be left to assemble a claim while evidence, experts and legal review remain disconnected.",
    aerivis:
      "The partner law firm owns the client relationship, assesses merits and decides whether repairs or compensation should be pursued.",
  },
  {
    topic: "Outcome",
    public:
      "A mould result alone cannot prove health causation, landlord liability or entitlement to compensation.",
    aerivis:
      "Aerivis makes the evidence and its limits visible. The solicitor advises on the claim; no result or award is guaranteed.",
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
  const [role, setRole] = useState<Role>("Resident");
  const [view, setView] = useState<View>("Case overview");
  const [stage, setStage] = useState(1);
  const [consents, setConsents] = useState({
    environmental: true,
    health: false,
    legal: false,
  });
  const [intakeStep, setIntakeStep] = useState(0);
  const [intakeAnswers, setIntakeAnswers] = useState<IntakeAnswer[]>([]);
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

  const showResidentCheck = () => {
    document.getElementById("resident-check")?.scrollIntoView({ behavior: "smooth" });
  };

  const recordIntakeAnswer = (answer: IntakeAnswer) => {
    const nextAnswers = [...intakeAnswers];
    nextAnswers[intakeStep] = answer;
    setIntakeAnswers(nextAnswers);
    setIntakeStep((current) => Math.min(current + 1, residentQuestions.length));
  };

  const restartIntake = () => {
    setIntakeStep(0);
    setIntakeAnswers([]);
  };

  const intakeMaySuitReview =
    intakeAnswers[0] === "yes" && intakeAnswers[1] === "yes";

  return (
    <main className="site-shell">
      <div className="announcement">
        <span className="live-dot" aria-hidden="true" />
        Resident support prototype
        <span className="announcement-separator" aria-hidden="true" />
        Damp, mould and housing disrepair
      </div>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Aerivis home">
          <AerivisMark />
          <span className="wordmark-lockup">
            <span className="wordmark-text">Aerivis</span>
            <span className="wordmark-tagline">Exposure intelligence</span>
          </span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#system">How it works</a>
          <a href="#resident-check">Check my situation</a>
          <a href="#case-demo">My case</a>
          <a href="#comparison">Evidence</a>
          <a href="#legal-partner">For law firms</a>
          <a className="nav-cta" href="#resident-check">
            Start case check <span aria-hidden="true">↘</span>
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-coordinate" aria-hidden="true">
          53.4808° N · 2.2426° W
        </div>
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Support for tenants living with damp and mould</p>
            <h1>
              <span>Your home has mould.</span>
              <em>Your family deserves answers.</em>
            </h1>
            <p className="hero-lead">
              Aerivis helps tenants document what is happening, preserve a
              traceable evidence record and connect their case with a partner law
              firm—so a solicitor can assess whether to pursue repairs and
              compensation.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={showResidentCheck}>
                Check your situation <span aria-hidden="true">↘</span>
              </button>
              <a className="secondary-button" href="#system">
                See how your case is built <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className="hero-assurance">
              <li>
                <strong>01</strong>
                Private first step
              </li>
              <li>
                <strong>02</strong>
                Consent controlled
              </li>
              <li>
                <strong>03</strong>
                No outcome promised
              </li>
            </ul>
          </div>

          <div className="device-stage" aria-label="Aerivis Collector concept">
            <div className="device-label">
              <span>Collector / C-014</span>
              <span>Concept hardware</span>
            </div>
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
                <span>Live capture</span>
                <b className="live-dot" aria-hidden="true" />
              </div>
              <strong>06:42:18</strong>
              <span>1.00 L/min · sealed cartridge paired</span>
            </div>
            <p className="device-caption">
              Time-integrated air capture. Environmental context. One digital
              provenance record.
            </p>
          </div>
        </div>

        <div className="hero-metrics" aria-label="Aerivis resident support model">
          <div className="hero-metric">
            <strong>1</strong>
            <span>Protected case journey</span>
          </div>
          <div className="hero-metric">
            <strong>24h</strong>
            <span>Controlled airborne capture</span>
          </div>
          <div className="hero-metric">
            <strong>Law firm</strong>
            <span>Leads the claim</span>
          </div>
          <div className="hero-metric">
            <strong>You</strong>
            <span>Control consent</span>
          </div>
        </div>
      </section>

      <section className="resident-check-section" id="resident-check">
        <div className="resident-check-grid">
          <div className="resident-check-intro">
            <p className="section-kicker">A private first step</p>
            <h2>
              Could your situation{" "}
              <span>be suitable for legal review?</span>
            </h2>
            <p>
              Answer four simple questions. This prototype does not ask for your
              name, address or health records, and nothing is sent or stored.
            </p>
            <div className="resident-check-note">
              <span>01</span>
              <p>
                In a live service, a partner law firm—not Aerivis—would assess the
                legal merits of your case and explain your options.
              </p>
            </div>
          </div>

          <div className="intake-card" aria-live="polite">
            {intakeStep < residentQuestions.length ? (
              <>
                <div className="intake-progress">
                  <span>
                    Question {intakeStep + 1} of {residentQuestions.length}
                  </span>
                  <div className="intake-progress-track" aria-hidden="true">
                    <i
                      style={{
                        width: `${((intakeStep + 1) / residentQuestions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="intake-question">
                  <span className="intake-index">
                    {String(intakeStep + 1).padStart(2, "0")}
                  </span>
                  <h3>{residentQuestions[intakeStep].title}</h3>
                  <p>{residentQuestions[intakeStep].body}</p>
                </div>
                <div className="intake-actions">
                  {(
                    [
                      ["yes", "Yes"],
                      ["no", "No"],
                      ["unsure", "Not sure"],
                    ] as [IntakeAnswer, string][]
                  ).map(([answer, label]) => (
                    <button key={answer} onClick={() => recordIntakeAnswer(answer)}>
                      {label}
                      <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="intake-outcome">
                <span className="intake-outcome-label">Your next step</span>
                <h3>
                  {intakeMaySuitReview
                    ? "Your situation may be suitable for review by a partner law firm."
                    : "Start by building a clear record of what is happening."}
                </h3>
                <p>
                  {intakeMaySuitReview
                    ? "A solicitor would still need to check the tenancy, notice given, evidence, losses and legal merits before deciding whether to act."
                    : "Keep photographs, dates, repair reports and written messages. A law firm can then decide whether it is able to review the matter."}
                </p>
                <div className="intake-outcome-actions">
                  <button className="primary-button" onClick={showDemo}>
                    See the case journey <span aria-hidden="true">↘</span>
                  </button>
                  <button className="text-button" onClick={restartIntake}>
                    Start again
                  </button>
                </div>
              </div>
            )}
            <p className="intake-disclaimer">
              This check does not assess legal merits, diagnose illness or
              guarantee compensation.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="system">
        <div className="section-inner">
          <div className="section-heading">
            <p className="section-kicker">What happens after you ask for help</p>
            <div>
              <h2>
                Tell your story once.{" "}
                <span>The evidence moves with your case.</span>
              </h2>
              <p>
                Your report, property record, controlled sample, laboratory result
                and consented specialist reviews are joined into one traceable
                journey. You can see what happens next while the partner law firm
                decides how the evidence should be used.
              </p>
            </div>
          </div>

          <div className="system-flow">
            {[
              ["01", "Check", "Describe the home, the mould and what you have already reported."],
              ["02", "Record", "Bring dates, photographs, messages and repair history into one timeline."],
              ["03", "Capture", "Take a controlled air sample with a sealed, identity-linked cartridge."],
              ["04", "Review", "Add laboratory findings and consented clinical context within clear limits."],
              ["05", "Litigate", "The partner law firm assesses merits and decides whether to pursue the claim."],
              ["06", "Redress", "Repairs and compensation are pursued only where the evidence and legal merits support them."],
            ].map(([index, title, body]) => (
              <article className="flow-card" key={index}>
                <span className="flow-card-index">{index}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="flow-card-status">Resident-visible stage</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="demo-section" id="case-demo">
        <div className="demo-header">
          <div>
            <p className="eyebrow">Your case, step by step</p>
            <h2>
              See exactly what happens{" "}
              <span>to your evidence.</span>
            </h2>
          </div>
          <p>
            Start in the resident view. Follow the case, control consent and see
            how the field specialist, laboratory, clinician and partner law firm
            contribute without making unsupported promises.
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
              <AerivisMark compact />
              <span className="app-brand-copy">
                <strong>AERIVIS</strong>
                <span>Resident evidence case</span>
              </span>
            </div>

            <p className="rail-label">My case</p>
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
                  <span>Reported damp & mould</span>
                  <span>Landlord notified</span>
                </div>
              </div>
              <button
                className="case-chip"
                onClick={() => setToast("Case switcher contains 18 demo records.")}
              >
                <span>My case · partner law firm</span>
                <strong>1 active case ▾</strong>
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
            <p className="section-kicker">
              Why ordinary mould evidence can let residents down
            </p>
            <h2>
              Your case needs more{" "}
              <span>than a surface result.</span>
            </h2>
            <p>
              A photograph or swab can be useful, but a contested housing claim may
              also need the condition history, controlled environmental context,
              chain of custody, method limitations, expert boundaries and the
              landlord’s response. Aerivis keeps that journey connected.
            </p>
            <span className="source-link">Evidence is strongest when its limits are visible.</span>
          </div>

          <div className="comparison-table" role="table" aria-label="Process comparison">
            <div className="comparison-row header" role="row">
              <span role="columnheader">Evidence question</span>
              <span role="columnheader">A fragmented route</span>
              <span role="columnheader">The Aerivis resident-to-law-firm model</span>
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
            <p className="section-kicker">
              What Aerivis can—and cannot—prove
            </p>
            <div>
              <h2>
                Evidence may strengthen a claim.{" "}
                <span>It cannot promise the result.</span>
              </h2>
              <p>
                Aerivis is designed to show what was recorded, measured and reviewed,
                as well as what remains uncertain. A clinician considers health
                context; a solicitor considers legal merits. Neither step is replaced
                by an automated score.
              </p>
            </div>
          </div>

          <div className="evidence-ladder">
            {[
              [
                "Prototype ready",
                "Resident case journey",
                "The private check, consent controls, case timeline and role-scoped handoffs are demonstrated in this working prototype.",
                "Digital workflow",
              ],
              [
                "Validate next",
                "Sampling science",
                "Bench and field studies must establish airflow stability, filter recovery, storage performance and comparative representativeness.",
                "Alpha → beta",
              ],
              [
                "Clinical boundary",
                "Health review is not a diagnosis",
                "A paid clinical reviewer may consider consented health context, but environmental evidence does not prove illness causation.",
                "Professional judgment",
              ],
              [
                "No guarantee",
                "Compensation depends on legal merits",
                "The partner law firm decides whether to act and what remedy to pursue. Aerivis cannot promise a settlement, award or repair outcome.",
                "Solicitor-led claim",
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
              investigation, issue a clinical diagnosis, establish legal liability
              or guarantee compensation. Those responsibilities remain with the
              relevant qualified professional and organisation.
            </p>
          </div>
        </div>
      </section>

      <section className="partner-section" id="legal-partner">
        <div className="partner-grid">
          <div className="partner-copy">
            <p className="section-kicker">Proposed commercial model</p>
            <h2>
              The law firm is the partner.{" "}
              <span>Specialists support the case.</span>
            </h2>
            <p>
              The partner law firm owns the client relationship, assesses legal
              merits and conducts the claim. Aerivis operates the evidence workflow.
              Laboratories are engaged per case; clinical reviewers are paid for
              consented work by the hour. Proposed economics remain subject to
              regulation, contracting, validation and clearance.
            </p>
            <ul className="partner-types" aria-label="Proposed service model">
              <li>Primary partner · claimant law firm</li>
              <li>Paid service · laboratory per case</li>
              <li>Paid service · clinician by the hour</li>
            </ul>
          </div>

          <div className="partner-roadmap">
            {[
              [
                "01",
                "Resident check and triage",
                "Give mould-affected tenants a calm, private route to structure the property history and immediate concerns.",
                "Acquisition",
              ],
              [
                "02",
                "Law firm merit review",
                "The partner law firm checks tenancy, notice, evidence, losses, limitation and legal prospects before accepting the client.",
                "Partner",
              ],
              [
                "03",
                "Evidence and clinical services",
                "Aerivis coordinates field capture, the paid laboratory workflow and consented hourly clinical review where instructed.",
                "Variable cost",
              ],
              [
                "04",
                "Repairs and compensation",
                "The law firm pursues an appropriate remedy only where the evidence, instructions and legal merits justify it.",
                "Outcome",
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
          <p className="section-kicker">For tenants and families</p>
          <h2>
            Living with mould?
            <em>Start by protecting your story.</em>
          </h2>
          <div className="final-side">
            <p>
              Take the private four-question check. No personal information is
              collected in this prototype, and no legal or compensation outcome is
              promised.
            </p>
            <button className="dark-button" onClick={showResidentCheck}>
              Start the case check ↑
            </button>
          </div>
        </div>

        <footer className="footer">
          <p className="footer-copy">
            Resident support and legal partnership prototype · July 2026. Product
            imagery is illustrative. All case data is fictional. Scientific,
            clinical and legal outputs shown are proposed workflow examples and
            require validation, governance and qualified professional review before
            operational use.
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
