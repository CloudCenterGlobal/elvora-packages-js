"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import {
  buildSubmissionView,
  type SubmissionResult,
  type ViewRow,
  type ViewSection,
} from "@/sections/partner-apply/submission-view";

const MUTED = "var(--theme-elevation-600)";
const DIVIDER = "1px solid var(--theme-elevation-100)";

/** Type scale, largest to smallest: key fact, answer, value, question, label. */
const TYPE = {
  fact: { fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.2 },
  value: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.4 },
  answer: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
  question: { fontSize: "0.8125rem", color: MUTED },
  label: { fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED },
} as const;

const RESULT_COLORS: Record<SubmissionResult["outcome"], string> = {
  pass: "var(--theme-success-600)",
  fail: "var(--theme-error-500)",
};

const Fact = ({ label, large, children }: { label: string; large?: boolean; children: React.ReactNode }) => (
  <div>
    <div style={TYPE.label}>{label}</div>
    <div style={{ ...(large ? TYPE.fact : TYPE.value), marginTop: "calc(var(--base) / 3)", overflowWrap: "break-word" }}>{children}</div>
  </div>
);

const Value = ({ row }: { row: ViewRow }) => (row.href ? <a href={row.href}>{row.value}</a> : <>{row.value}</>);

/** One renderer per section kind. A new kind of section is a new entry here. */
const SECTION_RENDERERS: { [K in ViewSection["kind"]]: (section: Extract<ViewSection, { kind: K }>) => React.ReactNode } = {
  rows: (section) => (
    <dl style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "calc(var(--base) / 3) calc(var(--base) * 2)", margin: 0 }}>
      {section.rows.map((row) => (
        <div key={row.label} style={{ display: "contents" }}>
          <dt style={TYPE.question}>{row.label}</dt>
          <dd style={{ margin: 0, overflowWrap: "anywhere" }}>
            <Value row={row} />
          </dd>
        </div>
      ))}
    </dl>
  ),
  qa: (section) => (
    <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {section.items.map((item) => (
        <li key={item.id} style={{ borderTop: DIVIDER, padding: "var(--base) 0" }}>
          <div style={TYPE.question}>{item.question}</div>
          <ul style={{ listStyle: "none", margin: "calc(var(--base) / 4) 0 0", padding: 0, display: "grid", gap: "calc(var(--base) / 4)" }}>
            {(item.values.length ? item.values : [{ label: "—" }]).map((value) => (
              <li key={value.label} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--base)" }}>
                <span style={TYPE.answer}>{value.label}</span>
                {value.outcome === "fail" && (
                  <span style={{ ...TYPE.question, color: "var(--theme-error-500)", whiteSpace: "nowrap" }}>Does not qualify</span>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  ),
};

const renderSection = (section: ViewSection) =>
  (SECTION_RENDERERS[section.kind] as (section: ViewSection) => React.ReactNode)(section);

const Section = ({ section }: { section: ViewSection }) =>
  section.emphasis === "quiet" ? (
    <details style={{ borderTop: DIVIDER, paddingTop: "var(--base)" }}>
      <summary style={{ ...TYPE.label, cursor: "pointer" }}>{section.title}</summary>
      <div style={{ marginTop: "var(--base)" }}>{renderSection(section)}</div>
    </details>
  ) : (
    <section>
      <h3 style={{ ...TYPE.label, margin: "0 0 var(--base)" }}>{section.title}</h3>
      {renderSection(section)}
    </section>
  );

export const SubmissionPage = () => {
  const { savedDocumentData } = useDocumentInfo();
  if (!savedDocumentData) return null;

  const { partnerLabel, received, result, sections } = buildSubmissionView(savedDocumentData);
  const primary = sections.filter((section) => section.emphasis === "primary");
  const rest = sections.filter((section) => section.emphasis !== "primary");

  return (
    <div style={{ display: "grid", gap: "calc(var(--base) * 2)", maxWidth: 760, marginBottom: "calc(var(--base) * 2)" }}>
      <div>
        <div style={{ ...TYPE.question, marginBottom: "var(--base)" }}>
          {partnerLabel}
          {received && ` · Received ${received}`}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--base) calc(var(--base) * 3)" }}>
          {result && (
            <Fact label="Result" large>
              <span style={{ color: RESULT_COLORS[result.outcome] }}>{result.label}</span>
              <div style={{ ...TYPE.question, fontWeight: 400, marginTop: "calc(var(--base) / 4)" }}>{result.detail}</div>
            </Fact>
          )}
          {primary.flatMap((section) =>
            section.kind === "rows"
              ? section.rows.map((row) => (
                  <Fact key={row.label} label={row.label}>
                    <Value row={row} />
                  </Fact>
                ))
              : [],
          )}
        </div>
      </div>
      {rest.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
};
