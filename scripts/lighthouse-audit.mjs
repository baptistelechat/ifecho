#!/usr/bin/env node
/**
 * Lance pnpm build + pnpm preview, audite en mode Desktop et Mobile via
 * l'API Node de lighthouse (pas de CLI → pas de problèmes de quoting Windows).
 *
 * Usage : pnpm lighthouse
 */

import { spawn } from "child_process";
import { launch } from "chrome-launcher";
import { mkdirSync, writeFileSync } from "fs";
import lighthouse from "lighthouse";
import { resolve } from "path";

const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}/`;
const OUTPUT_DIR = resolve("docs/lighthouse");

const COL = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────

async function waitForServer(url, timeoutMs = 40_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw new Error(`Serveur non disponible après ${timeoutMs / 1000}s`);
}

function runBuild() {
  return new Promise((res, rej) => {
    const proc = spawn("pnpm", ["build"], { shell: true, stdio: "inherit" });
    proc.on("close", (code) =>
      code === 0 ? res() : rej(new Error(`Build échoué (exit ${code})`)),
    );
    proc.on("error", rej);
  });
}

// ─── Lighthouse via API Node ───────────────────────────────────────────────────

async function runLighthouse(url, preset) {
  const chrome = await launch({
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const flags = {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      formFactor: preset === "desktop" ? "desktop" : "mobile",
      screenEmulation:
        preset === "desktop"
          ? {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false,
            }
          : {
              mobile: true,
              width: 390,
              height: 844,
              deviceScaleFactor: 3,
              disabled: false,
            },
      throttlingMethod: "simulate",
    };

    const result = await lighthouse(url, flags);
    return result.lhr;
  } finally {
    try {
      await chrome.kill();
    } catch (e) {
      // EPERM Windows : Chrome n'a pas encore libéré le répertoire temp - ignoré
      if (!String(e.message).includes("EPERM")) throw e;
    }
  }
}

// ─── Extraction des résultats ──────────────────────────────────────────────────

function getScores(report) {
  return Object.fromEntries(
    Object.entries(report.categories).map(([k, v]) => [
      k,
      Math.round(v.score * 100),
    ]),
  );
}

function extractFailures(report) {
  return Object.values(report.audits)
    .filter(
      (a) =>
        a.score !== null &&
        a.scoreDisplayMode !== "notApplicable" &&
        a.scoreDisplayMode !== "informative" &&
        a.score < 1,
    )
    .sort((a, b) => a.score - b.score)
    .map((a) => ({
      id: a.id,
      title: a.title,
      score: Math.round(a.score * 100),
      items: (a.details?.items ?? []).slice(0, 5).map((item) => ({
        node: item.node?.snippet ?? item.node?.nodeLabel ?? null,
        url: item.url ?? null,
        description: item.description ?? null,
      })),
    }));
}

// ─── Affichage ────────────────────────────────────────────────────────────────

function colorScore(s) {
  if (s >= 90) return `${COL.green}${s}${COL.reset}`;
  if (s >= 50) return `${COL.yellow}${s}${COL.reset}`;
  return `${COL.red}${s}${COL.reset}`;
}

function printScores(desktop, mobile) {
  console.log(`\n${COL.bold}📊 SCORES${COL.reset}`);
  console.log("─".repeat(46));
  console.log("Catégorie                  Desktop   Mobile");
  console.log("─".repeat(46));
  for (const k of Object.keys(desktop)) {
    const label = k.padEnd(27);
    console.log(
      `${label}${String(colorScore(desktop[k])).padStart(7)}   ${String(colorScore(mobile[k])).padStart(7)}`,
    );
  }
  console.log("─".repeat(46));
}

function printFailures(label, failures) {
  if (failures.length === 0) {
    console.log(`\n${COL.green}✅ Aucun échec - ${label}${COL.reset}`);
    return;
  }
  console.log(`\n${COL.bold}❌ ÉCHECS - ${label}${COL.reset}`);
  console.log("─".repeat(60));
  for (const f of failures) {
    console.log(`  [${colorScore(f.score)}%] ${f.id}`);
    console.log(`       ${f.title}`);
    for (const item of f.items) {
      const detail = item.node ?? item.url ?? item.description ?? "";
      if (detail) console.log(`         • ${String(detail).slice(0, 110)}`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`${COL.bold}🔨 Build...${COL.reset}`);
  await runBuild();
  console.log("✅ Build OK\n");

  console.log(
    `${COL.bold}🚀 Démarrage pnpm preview (port ${PORT})...${COL.reset}`,
  );
  const preview = spawn("pnpm", ["preview", "--port", String(PORT)], {
    shell: true,
    stdio: "ignore",
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`✅ Serveur prêt → ${BASE_URL}\n`);

    console.log("🖥️  Audit Desktop...");
    const desktop = await runLighthouse(BASE_URL, "desktop");

    console.log("📱 Audit Mobile...");
    const mobile = await runLighthouse(BASE_URL, "mobile");

    const desktopScores = getScores(desktop);
    const mobileScores = getScores(mobile);
    const desktopFailures = extractFailures(desktop);
    const mobileFailures = extractFailures(mobile);

    printScores(desktopScores, mobileScores);
    printFailures("Desktop", desktopFailures);
    printFailures("Mobile", mobileFailures);

    const outPath = `${OUTPUT_DIR}/audit-${Date.now()}.json`;
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      outPath,
      JSON.stringify(
        {
          fetchTime: new Date().toISOString(),
          desktop: { scores: desktopScores, failures: desktopFailures },
          mobile: { scores: mobileScores, failures: mobileFailures },
        },
        null,
        2,
      ),
    );
    console.log(`\n💾 Rapport JSON → ${outPath}`);
  } finally {
    preview.kill();
    console.log("\n🛑 Serveur arrêté.");
  }
}

main().catch((e) => {
  console.error(`\n${COL.red}Erreur :${COL.reset}`, e.message);
  process.exit(1);
});
