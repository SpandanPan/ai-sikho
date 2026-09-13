"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Device = { id: string; deviceId: string; createdAt: string };

export default function DeviceManager() {
  const { status } = useSession();
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  function refresh() {
    fetch("/api/devices")
      .then((r) => r.json())
      .then((d) => {
        setDevices(d.devices ?? []);
        setCurrentDeviceId(d.currentDeviceId ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  useEffect(() => {
    if (status === "authenticated") refresh();
  }, [status]);

  async function signOutDevice(id: string) {
    await fetch(`/api/devices/${id}`, { method: "DELETE" });
    refresh();
  }

  if (status !== "authenticated") {
    return <p className="text-sm text-ink-soft">Sign in to manage your devices.</p>;
  }

  if (!loaded) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div>
      <p className="text-sm text-ink-soft mb-3">
        Up to 2 devices can be signed in at once — one account, no sharing. If you've hit the
        limit on a new device, sign out an old one here.
      </p>
      <div className="flex flex-col gap-2">
        {devices.map((d) => {
          const isCurrent = d.deviceId === currentDeviceId;
          return (
            <div key={d.id} className="flex items-center justify-between border border-paper-line rounded px-3.5 py-2.5">
              <div className="text-xs">
                <span className="font-mono">{isCurrent ? "This device" : "Other device"}</span>
                <span className="text-ink-soft"> · signed in {new Date(d.createdAt).toLocaleString()}</span>
              </div>
              <button
                onClick={() => signOutDevice(d.id)}
                className="font-mono text-[11px] border border-paper-line rounded px-2.5 py-1.5"
              >
                Sign out
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
