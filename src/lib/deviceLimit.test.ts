import { describe, expect, it } from "vitest";
import { canRegisterNewDevice, MAX_DEVICES } from "./deviceLimit";

describe("canRegisterNewDevice", () => {
  it("allows a first device", () => {
    expect(canRegisterNewDevice(0)).toBe(true);
  });

  it("allows the second device (right up to the cap)", () => {
    expect(canRegisterNewDevice(1, MAX_DEVICES)).toBe(true);
  });

  it("rejects a third device at the default cap", () => {
    expect(canRegisterNewDevice(2, MAX_DEVICES)).toBe(false);
  });

  it("rejects further sign-ins if somehow already over the cap", () => {
    expect(canRegisterNewDevice(5, MAX_DEVICES)).toBe(false);
  });

  it("respects a custom maxDevices", () => {
    expect(canRegisterNewDevice(0, 1)).toBe(true);
    expect(canRegisterNewDevice(1, 1)).toBe(false);
  });

  it("rejects a maxDevices below 1", () => {
    expect(() => canRegisterNewDevice(0, 0)).toThrow();
  });
});
