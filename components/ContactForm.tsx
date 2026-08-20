"use client";

import { useState } from "react";
import { FORM_ENDPOINT } from "@/lib/forms";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Shared form for the waitlist and for support enquiries. Posts to a
 * third-party form endpoint (see lib/forms.ts), because a static site cannot
 * receive submissions itself.
 *
 * Only rendered when an endpoint is configured, so it can never look like it
 * worked when the message went nowhere. Errors are stated plainly and the
 * fallback path (email) stays visible.
 */
export function ContactForm({
  kind,
  submitLabel,
  messageLabel,
  messagePlaceholder,
}: {
  kind: "waitlist" | "support";
  submitLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
}) {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", kind === "waitlist" ? "MagicBridge waitlist" : "MagicBridge support");
    setState("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p
        role="status"
        className="rounded-2xl border border-cyan/30 bg-cyan/[0.06] p-6 text-[15px] leading-relaxed text-ink"
      >
        Thanks, that reached me. I read every one of these myself and will reply to the address you
        gave.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5">
      <div className="grid gap-2">
        <label
          htmlFor="name"
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint"
        >
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="rounded-xl border border-line bg-stage px-4 py-3 text-ink outline-none transition-colors focus-visible:border-cyan/50"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="email"
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-xl border border-line bg-stage px-4 py-3 text-ink outline-none transition-colors focus-visible:border-cyan/50"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="message"
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint"
        >
          {messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={messagePlaceholder}
          className="rounded-xl border border-line bg-stage px-4 py-3 text-ink outline-none transition-colors focus-visible:border-cyan/50"
        />
      </div>

      {/* Honeypot: bots fill it, people never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="u-press rounded-full bg-cyan px-7 py-3 font-mono text-xs font-medium uppercase tracking-widest text-stage disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
        {state === "error" && (
          <p role="alert" className="text-sm text-ink-dim">
            That did not send. Please try again in a moment.
          </p>
        )}
      </div>
    </form>
  );
}
