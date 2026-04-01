import type {
  MicroFishChatRequest,
  MicroFishChatResponse,
} from "@/api/types/microFish";
import { coerceToYyyyMmDd } from "@/lib/coerceToYyyyMmDd";

/** See `src/docs/apiResponse/microFish.md` — POST `{base}/api/v1/miroshark/chat`. */
function getMicroFishBaseUrl(): string {
  const raw = import.meta.env.VITE_MICRO_FISH_API_URL;
  if (typeof raw === "string" && raw.trim()) {
    return raw.replace(/\/$/, "");
  }
  return "https://be.webapp01.hblab.dev";
}

export async function fetchMicroFishChat(
  body: MicroFishChatRequest,
): Promise<MicroFishChatResponse> {
  const root = getMicroFishBaseUrl();
  const url = `${root}/api/v1/miroshark/chat`;
  const selectedDateStr =
    coerceToYyyyMmDd(body.selected_date) ?? String(body.selected_date).trim();
  const payload = {
    category: String(body.category),
    company: String(body.company),
    selected_date: selectedDateStr,
    location: String(body.location),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text.slice(0, 200) || `Invalid JSON (${res.status})`);
  }

  if (!res.ok) {
    const msg =
      json &&
      typeof json === "object" &&
      "message" in json &&
      typeof (json as { message: unknown }).message === "string"
        ? (json as { message: string }).message
        : res.statusText || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (!json || typeof json !== "object" || !("response" in json)) {
    throw new Error("Invalid microFish response");
  }

  return json as MicroFishChatResponse;
}
