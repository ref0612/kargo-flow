#!/usr/bin/env node

/**
 * Vercel Pre-Build Script
 * Executes checks and optimizations before deployment
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const log = (message: string, type: "info" | "success" | "error" | "warn" = "info") => {
  const icons = {
    info: "ℹ️ ",
    success: "✅",
    error: "❌",
    warn: "⚠️ ",
  };
  console.log(`${icons[type]} ${message}`);
};

const runCommand = (command: string): string => {
  try {
    return execSync(command, { encoding: "utf-8", stdio: "pipe" }).trim();
  } catch (error) {
    throw new Error(`Failed to run: ${command}`);
  }
};

async function main() {
  try {
    log("🚀 Starting Vercel pre-build checks...", "info");

    // Check Node version
    const nodeVersion = runCommand("node --version");
    log(`Node version: ${nodeVersion}`, "success");

    // Check npm version
    const npmVersion = runCommand("npm --version");
    log(`npm version: ${npmVersion}`, "success");

    // Check environment
    log(`Environment: ${process.env.VERCEL_ENV || "development"}`, "info");

    // Verify package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("package.json not found");
    }
    log("✓ package.json found", "success");

    // Verify vite.config.ts
    const viteConfigPath = path.join(process.cwd(), "vite.config.ts");
    if (!fs.existsSync(viteConfigPath)) {
      throw new Error("vite.config.ts not found");
    }
    log("✓ vite.config.ts found", "success");

    // Verify src/server.ts
    const serverPath = path.join(process.cwd(), "src", "server.ts");
    if (!fs.existsSync(serverPath)) {
      throw new Error("src/server.ts not found");
    }
    log("✓ src/server.ts found", "success");

    // Check for large dependencies
    log("📦 Analyzing dependencies...", "info");
    const dependencies = runCommand('npm ls --depth=0 --format=json | jq -r ".dependencies | keys[]"');
    const depCount = dependencies.split("\n").filter((d) => d).length;
    log(`Total dependencies: ${depCount}`, "success");

    // Set production environment
    process.env.NODE_ENV = "production";

    log("✨ Pre-build checks completed successfully!", "success");
  } catch (error) {
    log(`${error instanceof Error ? error.message : String(error)}`, "error");
    process.exit(1);
  }
}

main();
