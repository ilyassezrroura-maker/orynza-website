// Orynza — Paddle webhook receiver (Vercel serverless function).
//
// Scope: one-time purchases only, no subscriptions. On a verified
// transaction.completed event, sends an order-notification email so
// fulfillment isn't fully manual. Everything else is safely ignored.
//
// Required env vars (set in Vercel, never in this repo):
//   PADDLE_WEBHOOK_SECRET  - signing secret from the notification destination
//   ZOHO_SMTP_PASSWORD     - Zoho Mail app-specific password (Security > App Passwords),
//                            NOT the regular account password
//   NOTIFY_EMAIL           - where the order notification is sent (defaults below)

import crypto from "node:crypto";
import nodemailer from "nodemailer";

export const config = { api: { bodyParser: false } };

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "support@orynzaglobal.shop";

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    var chunks = [];
    req.on("data", function (c) { chunks.push(c); });
    req.on("end", function () { resolve(Buffer.concat(chunks).toString("utf8")); });
    req.on("error", reject);
  });
}

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
  if (!process.env.ZOHO_SMTP_PASSWORD) return; // no email configured yet — skip silently

  const item = (transaction.items && transaction.items[0]) || {};
  const total = transaction.details && transaction.details.totals ? transaction.details.totals.total : "?";
  const currency = transaction.currency_code || "";

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: "support@orynzaglobal.shop",
      pass: process.env.ZOHO_SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: "Orynza Orders <support@orynzaglobal.shop>",
    to: NOTIFY_EMAIL,
    subject: `New Orynza order — ${transaction.id}`,
    text:
      `New Paddle order received.\n\n` +
      `Transaction ID: ${transaction.id}\n` +
      `Customer ID: ${transaction.customer_id}\n` +
      `Price ID: ${item.price_id || "unknown"}\n` +
      `Total: ${total} ${currency}\n\n` +
      `Full details in the Paddle dashboard.`
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const rawBody = await getRawBody(req);
  const signatureHeader = req.headers["paddle-signature"];
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!verifyPaddleSignature(rawBody, signatureHeader, secret)) {
    // Do NOT return 2xx on a failed/unverified signature — a 2xx tells
    // Paddle delivery succeeded and stops retries.
    res.status(401).send("Invalid signature");
    return;
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    res.status(400).send("Invalid JSON");
    return;
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

  res.status(200).send("OK");
}
