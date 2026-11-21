import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  toToolName,
  type CustomToolConfig,
} from "@/modules/builder/lib/custom-tool";

function fillTemplate(template: string, params: Record<string, unknown>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(params[key] ?? ""),
  );
}

// Basic gaurdrail to reject local/private url
function isPrivateAddress(address: string) {
  if (isIP(address) === 4) {
    const [first, second] = address.split(".").map(Number);

    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && (second === 0 || second === 168)) ||
      (first === 198 && (second === 18 || second === 19)) ||
      (first === 203 && second === 0)
    );
  }

  if (isIP(address) === 6) {
    const normalized = address.toLowerCase();
    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("::ffff:") ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      /^fe[89ab]/.test(normalized)
    );
  }

  return true;
}

async function validateRequestUrl(value: string) {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Custom tools can only call HTTP or HTTPS URLs");
  }

  if (
    isIP(hostname) ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost")
  ) {
    throw new Error("Custom tools cannot call local or IP addresses");
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Custom tools cannot call local or private network addresses");
  }

  return url;
}

export function buildCustomTool(config: CustomToolConfig) {
  const paramSchema: Record<string, z.ZodType> = {};

  for (const param of config.parameters) {
    let field: z.ZodType =
      param.type === "number"
        ? z.number()
        : param.type === "boolean"
          ? z.boolean()
          : z.string();

    if (!param.required) {
      field = field.optional();
    }

    paramSchema[param.name] = field.describe(param.description);
  }

  return tool(
    async (params) => {
      const values = params as Record<string, unknown>;
      const url = await validateRequestUrl(fillTemplate(config.url, values));
      const headers: Record<string, string> = {};

      for (const h of config.headers) {
        if (h.key) headers[h.key] = fillTemplate(h.value, values);
      }

      const options: RequestInit = {
        method: config.method,
        headers,
        signal: AbortSignal.timeout(config.timeoutMs),
        redirect: "error",
      };

      if (config.method !== "GET" && config.body) {
        options.body = fillTemplate(config.body, values);
      }

      const res = await fetch(url, options);
      const text = await res.text();

      if (!res.ok) {
        return `Request failed with status ${res.status}: ${text.slice(0, 2000)}`;
      }

      return text.slice(0, 8000);
    },
    {
      name: toToolName(config.name),
      description: config.description,
      schema: z.object(paramSchema),
    },
  );
}
