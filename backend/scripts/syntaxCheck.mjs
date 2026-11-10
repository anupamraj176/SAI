import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { builtinModules } from "node:module";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");

const pkg = JSON.parse(
  fs.readFileSync(path.join(backendRoot, "package.json"), "utf8")
);
const declaredDeps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
]);
const builtins = new Set(builtinModules);

const checkedFiles = [];
const importedPackages = new Set();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".mjs")) continue;

    execFileSync(process.execPath, ["--check", fullPath], { stdio: "inherit" });
    checkedFiles.push(path.relative(backendRoot, fullPath));

    const source = fs.readFileSync(fullPath, "utf8");
    for (const match of source.matchAll(
      /^\s*import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'".][^'"]*)['"]/gm
    )) {
      const spec = match[1];
      if (spec.startsWith("node:")) continue;

      const pkgName = spec.startsWith("@")
        ? spec.split("/").slice(0, 2).join("/")
        : spec.split("/")[0];

      if (!builtins.has(pkgName)) {
        importedPackages.add(pkgName);
      }
    }
  }
}

walk(backendRoot);

const missingDeps = [...importedPackages].filter((dep) => !declaredDeps.has(dep));
if (missingDeps.length > 0) {
  console.error(
    `Missing dependencies in backend/package.json: ${missingDeps.join(", ")}`
  );
  process.exit(1);
}

console.log(
  `Syntax and dependency check passed (${checkedFiles.length} files checked).`
);
