// Minimal, dependency-free CSV writer — quotes any field containing a
// comma, quote, or newline, and escapes internal quotes by doubling them
// (the standard RFC 4180 approach). Good enough for a ledger export; not
// meant to handle exotic encodings.
export function toCsv(rows: Record<string, unknown>[], columns?: string[]): string {
  if (rows.length === 0 && !columns) return "";
  const cols = columns ?? Object.keys(rows[0]);

  function escapeCell(value: unknown): string {
    const s = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  const lines = [cols.map(escapeCell).join(",")];
  for (const row of rows) {
    lines.push(cols.map((c) => escapeCell(row[c])).join(","));
  }
  return lines.join("\n");
}
