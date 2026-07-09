import { Resend } from "resend";
import type { User } from "@/db/schema";
import type { MatchAlert } from "./alerts";

const FROM = process.env.EMAIL_FROM ?? "GiveShare <onboarding@resend.dev>";

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

function client(): Resend | null {
  return process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;
}

const styles = {
  body: `font-family: Georgia, serif; color: #2b2418; background: #faf5ea; padding: 24px;`,
  card: `background: #fffdf6; border: 1px solid #2b2418; box-shadow: 4px 4px 0 #2b2418; padding: 20px; max-width: 480px;`,
  button: `display: inline-block; background: #3d6b46; color: #fffdf6; padding: 10px 18px; text-decoration: none; font-weight: bold; margin-top: 12px;`,
  muted: `color: #6b5f4b; font-size: 13px;`,
};

/** One email per neighbor whose open post(s) matched newly created post(s). */
export async function sendMatchAlerts(alerts: MatchAlert[]): Promise<void> {
  const resend = client();
  if (!resend || alerts.length === 0) return;

  const results = await Promise.allSettled(
    alerts.map(async (alert) => {
      const lines = alert.pairs
        .map(
          (p) =>
            `<li style="margin-bottom: 8px;"><strong>${p.theirs.user.name}</strong> posted the ${p.theirs.kind} “${p.theirs.title}” — it matches your ${p.yours.kind} <strong>“${p.yours.title}”</strong></li>`,
        )
        .join("");
      // Resend returns { data, error } — API failures do NOT throw.
      const { error } = await resend.emails.send({
        from: FROM,
        to: alert.user.email,
        subject: `🌻 ${alert.pairs.length === 1 ? "A neighbor matches" : `${alert.pairs.length} neighbors match`} your GiveShare post`,
        html: `<div style="${styles.body}"><div style="${styles.card}">
          <h2>Good news, ${alert.user.name}!</h2>
          <ul style="padding-left: 18px;">${lines}</ul>
          <a href="${siteUrl()}/matches" style="${styles.button}">See your matches →</a>
          <p style="${styles.muted}">You're getting this because you posted on the GiveShare neighborhood board.</p>
        </div></div>`,
      });
      if (error) throw new Error(`${error.name}: ${error.message}`);
    }),
  );
  for (const r of results) {
    if (r.status === "rejected") console.error("match alert failed:", r.reason);
  }
}

export async function sendWelcome(user: User, matchCount: number): Promise<void> {
  const resend = client();
  if (!resend) return;

  const matchLine =
    matchCount > 0
      ? `<p><strong>${matchCount} ${matchCount === 1 ? "neighbor already matches" : "neighbors already match"}</strong> what you posted — go say hi!</p>`
      : `<p>No matches yet, but the board refills all the time — we'll email you when a neighbor matches one of your posts.</p>`;

  try {
    // Resend returns { data, error } — API failures do NOT throw.
    const { error } = await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: `🌻 Welcome to the GiveShare board, ${user.name}!`,
      html: `<div style="${styles.body}"><div style="${styles.card}">
        <h2>${user.emoji} You're on the board!</h2>
        ${matchLine}
        <a href="${siteUrl()}/matches" style="${styles.button}">See your matches →</a>
        <p style="${styles.muted}">GiveShare · the neighborhood barter board · be kind, barter often</p>
      </div></div>`,
    });
    if (error) console.error("welcome email failed:", error.name, error.message);
  } catch (err) {
    console.error("welcome email failed:", err);
  }
}
