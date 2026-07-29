export default function AerivisMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`brand-symbol${compact ? " compact" : ""}`}
      aria-hidden="true"
    >
      <span className="brand-glyph" />
      <span className="brand-orbit" />
    </span>
  );
}
