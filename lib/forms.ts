/**
 * Form delivery.
 *
 * A static export has no backend of its own, so both the reservation list and
 * the support form post to FormSubmit (https://formsubmit.co), which is free
 * and needs no account: you post to an address-based or hashed URL and it
 * emails the submission on.
 *
 * To go live, set NEXT_PUBLIC_FORM_ENDPOINT to the AJAX endpoint:
 *
 *   https://formsubmit.co/ajax/you@example.com
 *
 * The first submission triggers a one-time confirmation email; click the link
 * in it and everything after that is delivered. FormSubmit then issues a
 * hashed URL (https://formsubmit.co/ajax/<random>) which does the same job
 * without putting the address in the page source, and swapping the variable to
 * that is worth doing.
 *
 * In CI the value comes from the repository variable of the same name, wired
 * into the build step in .github/workflows/deploy.yml. It is NEXT_PUBLIC_, so
 * it is compiled into the client bundle and is public by design: a form
 * endpoint has to be, since the browser is what posts to it.
 *
 * Until it is set, the forms are NOT rendered. A form that silently swallows a
 * customer's message is worse than no form at all.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export const FORMS_ENABLED = FORM_ENDPOINT.length > 0;

/**
 * Did the relay actually accept this, or just answer 200 politely?
 *
 * FormSubmit replies 200 with {"success":"false"} while the address is still
 * unconfirmed, and Formspree replies 200 with an `errors` array on validation
 * failures, so a status code is not proof of delivery. This reads the body
 * rather than sniffing the hostname: an earlier version tested the URL against
 * a regex that quietly never matched, and the form cheerfully told people their
 * message had arrived when it had not.
 *
 * A non-JSON body is treated as fine, since a relay that returns no JSON has
 * nothing to disagree with and the status code is all there is to go on.
 */
export function relayAccepted(body: unknown): boolean {
  if (!body || typeof body !== "object") return true;
  const b = body as { success?: unknown; errors?: unknown; error?: unknown };
  if (Array.isArray(b.errors) && b.errors.length > 0) return false;
  if (b.error) return false;
  if ("success" in b) return b.success === true || b.success === "true";
  return true;
}

/**
 * Extra fields FormSubmit reads off the payload. Harmless to other services,
 * which ignore unknown keys.
 *  - _subject   what the notification email is titled
 *  - _template  renders the submission as a table rather than a wall of text
 *  - _captcha   false, because the AJAX flow cannot show a captcha page and
 *               would otherwise reject the post; the honeypot covers bots
 */
export function deliveryFields(subject: string): Record<string, string> {
  return { _subject: subject, _template: "table", _captcha: "false" };
}
