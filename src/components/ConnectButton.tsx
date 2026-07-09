"use client";

import { useTransition } from "react";
import { logConnection } from "@/lib/actions";

export function ConnectButton({
  fromPostId,
  toPostId,
  email,
  subject,
  body,
}: {
  fromPostId: string;
  toPostId: string;
  email: string;
  subject: string;
  body: string;
}) {
  const [pending, startTransition] = useTransition();
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logConnection(fromPostId, toPostId);
          window.location.href = mailto;
        })
      }
      className="card-pin rounded-sm px-3 py-1 text-sm font-bold text-give hover:text-ink disabled:opacity-50"
    >
      {pending ? "Connecting…" : "✉️ Connect"}
    </button>
  );
}
