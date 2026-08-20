/**
 * Form delivery endpoint.
 *
 * A static export has no backend, so both the waitlist and the contact form
 * post to a third-party form service (Formspree, Tally, Basin, or similar).
 * Set NEXT_PUBLIC_FORM_ENDPOINT to that service's POST URL and both forms go
 * live on the next deploy. Until it is set, the forms are NOT rendered at all:
 * a form that silently swallows a customer's message is worse than no form.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export const FORMS_ENABLED = FORM_ENDPOINT.length > 0;
