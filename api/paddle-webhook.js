// Orynza — Paddle webhook receiver (Vercel serverless function).
//
// Scope: one-time purchases only, no subscriptions. On a verified
// transaction.completed event, sends an order-notification email so
// fulfillment isn't fully manual. Everything else is safely ignored.
//
// Required env vars (set in Vercel, never in this repo):
//   PADDLE_WEBHOOK_SECRET  - signing secret from the notification destination
//   RESEND_API_KEY         - server-side only, sends the notification email
//   NOTIFY_EMAIL           - where the order notification is sent (defaults below)

import crypto from "node:crypto";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "support@orynzaglobal.shop";

function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const parts = {};
  for (const pair of signatureHeader.split(";")) {
    const [k, v] = pair.split("=");
    if (k && v) parts[k] = v;
  }
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${ts}:${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(h1, "hex"));
  } catch {
    return false;
  }
}

async function sendOrderNotification(transaction) {
  if (!process.env.RESEND_API_KEY) return; // no email configured yet — skip silently

  const item = (transaction.items && transaction.items[0]) || {};
  const total = transaction.details && transaction.details.totals ? transaction.details.totals.total : "?";
  const currency = transaction.currency_code || "";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Orynza Orders <orders@orynzaglobal.shop>",
      to: NOTIFY_EMAIL,
      subject: `New Orynza order — ${transaction.id}`,
      text:
        `New Paddle order received.\n\n` +
        `Transaction ID: ${transaction.id}\n` +
        `Customer ID: ${transaction.customer_id}\n` +
        `Price ID: ${item.price_id || "unknown"}\n` +
        `Total: ${total} ${currency}\n\n` +
        `Full details in the Paddle dashboard.`
    })
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get("paddle-signature");
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!verifyPaddleSignature(rawBody, signatureHeader, secret)) {
    // Do NOT return 2xx on a failed/unverified signature — a 2xx tells
    // Paddle delivery succeeded and stops retries.
    return new Response("Invalid signature", { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  switch (event.event_type) {
    case "transaction.completed":
      await sendOrderNotification(event.data);
      break;
    default:
      // Safely ignore anything else — this project has no subscriptions,
      // customer accounts, or other state to mirror.
      break;
  }

  return new Response("OK", { status: 200 });
}
