import crypto from "crypto";
import axios from "axios";
import { env } from "@/env";

const SECRET = env.BITNOB_SECRET_KEY;
const CLIENT_ID = env.BITNOB_CLIENT_ID;

function bodyToString(data: unknown) {
  if (!data) return "";
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}

type SignatureData = {
  method: string;
  url: string;
  ts: string;
  nonce: string;
  bodyString: string;
};

function buildSignature({ method, url, ts, nonce, bodyString }: SignatureData) {
  const parts = [CLIENT_ID, method, url, ts, nonce, bodyString];
  console.log("🚀 ~ buildSignature ~ parts:", parts);
  const message = parts.join("").toLowerCase();
  return crypto.createHmac("sha256", SECRET).update(message).digest("base64");
}

// Create a dedicated client so you don't sign everything
export const bitnob = axios.create({
  baseURL: "https://api.bitnob.co/api/v1",
  headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` },
});

// Request interceptor
// bitnob.interceptors.request.use((config) => {
//   const method = (config.method ?? "get").toUpperCase();
//   const fullUrl = `${config.baseURL}${config.url}`;

//   const nonce = crypto.randomUUID();
//   const ts = new Date().toISOString();

//   const bodyString =
//     method === "GET" || method === "HEAD" ? "" : bodyToString(config.data);

//   const signature = buildSignature({
//     method,
//     url: fullUrl ?? "",
//     ts,
//     nonce,
//     bodyString,
//   });

//   config.headers["x-auth-client"] = CLIENT_ID;
//   config.headers["x-auth-timestamp"] = ts;
//   config.headers["x-auth-nonce"] = nonce;
//   config.headers["x-auth-signature"] = signature;

//   // Let axios handle serialization. Don't shove bodyString back in.
//   config.data = bodyString;

//   return config;
// });
