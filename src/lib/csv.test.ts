import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("writes a header row and data rows", () => {
    const csv = toCsv([{ a: 1, b: "x" }, { a: 2, b: "y" }]);
    expect(csv).toBe("a,b\n1,x\n2,y");
  });

  it("quotes a field containing a comma", () => {
    const csv = toCsv([{ name: "Doe, John" }]);
    expect(csv).toBe('name\n"Doe, John"');
  });

  it("escapes internal quotes by doubling them", () => {
    const csv = toCsv([{ note: 'He said "hi"' }]);
    expect(csv).toBe('note\n"He said ""hi"""');
  });

  it("quotes a field containing a newline", () => {
    const csv = toCsv([{ note: "line1\nline2" }]);
    expect(csv).toBe('note\n"line1\nline2"');
  });

  it("renders null/undefined as an empty cell", () => {
    const csv = toCsv([{ a: null, b: undefined }]);
    expect(csv).toBe("a,b\n,");
  });

  it("returns an empty string for no rows and no explicit columns", () => {
    expect(toCsv([])).toBe("");
  });

  it("uses explicit columns when given, even with no rows", () => {
    expect(toCsv([], ["a", "b"])).toBe("a,b");
  });

  it("respects explicit column order over object key order", () => {
    const csv = toCsv([{ b: 2, a: 1 }], ["a", "b"]);
    expect(csv).toBe("a,b\n1,2");
  });
});
