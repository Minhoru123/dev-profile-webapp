import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const CONTENT_ROOT = path.join(ROOT, "content");
const OUTPUT_ROOT = path.join(ROOT, "data");

const CONTENT_TYPES = [
  {
    name: "blog",
    required: ["title", "date", "excerpt", "tags", "slug", "status"],
    output: "blog.json",
  },
  {
    name: "research",
    required: ["title", "focus", "date", "summary", "slug", "status"],
    output: "research.json",
  },
  {
    name: "projects",
    required: ["title", "description", "stack", "liveHref", "githubHref", "status"],
    output: "projects.json",
  },
];

function parseValue(raw) {
  const value = raw.trim();

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

function parseFrontmatter(filePath) {
  const raw = readFileSync(filePath, "utf8");

  if (!raw.startsWith("---\n")) {
    throw new Error(`Missing frontmatter start in ${filePath}`);
  }

  const endIndex = raw.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    throw new Error(`Missing frontmatter end in ${filePath}`);
  }

  const frontmatterBlock = raw.slice(4, endIndex);
  const body = raw.slice(endIndex + 5).trim();
  const lines = frontmatterBlock.split(/\r?\n/);
  const frontmatter = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error(`Invalid frontmatter line "${line}" in ${filePath}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1);
    frontmatter[key] = parseValue(rawValue);
  }

  return { frontmatter, body };
}

function validateEntry(typeName, required, entry, filePath) {
  for (const field of required) {
    const value = entry[field];
    const missing =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (missing) {
      throw new Error(`Missing required field "${field}" in ${typeName} file ${filePath}`);
    }
  }

  if (entry.status !== "published" && entry.status !== "draft") {
    throw new Error(`Field "status" must be "published" or "draft" in ${filePath}`);
  }

  if (Object.prototype.hasOwnProperty.call(entry, "date")) {
    const parsed = Date.parse(entry.date);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid date "${entry.date}" in ${filePath}`);
    }
  }
}

function buildContentType(typeConfig) {
  const folder = path.join(CONTENT_ROOT, typeConfig.name);
  const files = readdirSync(folder).filter((file) => file.endsWith(".md"));

  const entries = files.map((fileName) => {
    const filePath = path.join(folder, fileName);
    const { frontmatter, body } = parseFrontmatter(filePath);
    const entry = { ...frontmatter, body };

    validateEntry(typeConfig.name, typeConfig.required, entry, filePath);
    return entry;
  });

  const published = entries.filter((entry) => entry.status === "published");

  const sorted = [...published].sort((a, b) => {
    if (a.date && b.date) {
      return Date.parse(b.date) - Date.parse(a.date);
    }
    return String(a.title).localeCompare(String(b.title));
  });

  return sorted;
}

function main() {
  mkdirSync(OUTPUT_ROOT, { recursive: true });

  for (const typeConfig of CONTENT_TYPES) {
    const output = buildContentType(typeConfig);
    const outputPath = path.join(OUTPUT_ROOT, typeConfig.output);
    writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
    console.log(`Generated ${path.relative(ROOT, outputPath)} with ${output.length} items`);
  }
}

main();
