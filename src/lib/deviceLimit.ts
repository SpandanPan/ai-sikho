export const MAX_DEVICES = 2;

// A new sign-in is rejected outright once a user is already at the device
// cap — not silently evicting their oldest device. Silent eviction doesn't
// actually deter account sharing (whoever gets kicked just signs back in,
// endlessly displacing each other); an explicit block forces someone to
// deliberately sign out a device first, which is the actual point.
export function canRegisterNewDevice(existingActiveCount: number, maxDevices: number = MAX_DEVICES): boolean {
  if (maxDevices < 1) throw new Error("maxDevices must be at least 1");
  return existingActiveCount < maxDevices;
}
