import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectFlag = process.argv.indexOf("--project");
if (projectFlag >= 0 && !process.argv[projectFlag + 1]) {
  throw new Error("--project requires a directory");
}

const projectRoot =
  projectFlag >= 0
    ? resolve(process.argv[projectFlag + 1])
    : fileURLToPath(new URL("..", import.meta.url));
const wranglerConfig = join(projectRoot, "dist/server/wrangler.json");
const wranglerBin = join(projectRoot, "node_modules/wrangler/bin/wrangler.js");

for (const requiredPath of [wranglerConfig, wranglerBin]) {
  if (!existsSync(requiredPath)) {
    throw new Error(`Missing required Worker smoke input: ${requiredPath}`);
  }
}

const markers = [
  "<title>Forecasting, from fragmented data to confident decisions</title>",
  "In the BASF Agricultural Solutions setting",
  "Interactive forecasting platform",
];

function reservePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to reserve a local port"));
        return;
      }
      server.close((error) => {
        if (error) reject(error);
        else resolvePort(address.port);
      });
    });
  });
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function stopWorker(worker) {
  if (worker.exitCode !== null) return;
  worker.kill("SIGINT");
  await Promise.race([once(worker, "exit"), delay(5_000)]);
  if (worker.exitCode === null) {
    worker.kill("SIGTERM");
    await Promise.race([once(worker, "exit"), delay(5_000)]);
  }
}

const port = await reservePort();
const runtimeDir = mkdtempSync(join(tmpdir(), "forecast-worker-smoke-"));
let wranglerOutput = "";
let spawnError;
const worker = spawn(
  process.execPath,
  [
    wranglerBin,
    "dev",
    "--config",
    wranglerConfig,
    "--local",
    "--ip",
    "127.0.0.1",
    "--port",
    String(port),
    "--persist-to",
    runtimeDir,
    "--show-interactive-dev-session=false",
    "--log-level=error",
  ],
  {
    cwd: projectRoot,
    env: {
      ...process.env,
      CI: "1",
      WRANGLER_LOG_PATH: join(runtimeDir, "wrangler.log"),
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

const captureOutput = (chunk) => {
  wranglerOutput = `${wranglerOutput}${chunk}`.slice(-12_000);
};
worker.stdout.on("data", captureOutput);
worker.stderr.on("data", captureOutput);
worker.on("error", (error) => {
  spawnError = error;
});

try {
  const url = `http://127.0.0.1:${port}/`;
  const deadline = Date.now() + 30_000;
  let response;
  let body = "";
  let requestError;

  while (Date.now() < deadline) {
    if (spawnError) throw spawnError;
    if (worker.exitCode !== null) {
      throw new Error(
        `Wrangler exited before serving the built Worker.\n${wranglerOutput}`,
      );
    }

    try {
      response = await fetch(url);
      body = await response.text();
      break;
    } catch (error) {
      requestError = error;
      await delay(100);
    }
  }

  if (!response) {
    throw new Error(
      `Timed out waiting for the built Worker: ${requestError}\n${wranglerOutput}`,
    );
  }
  if (response.status !== 200) {
    throw new Error(
      `Built Worker returned HTTP ${response.status}.\n${body}\n${wranglerOutput}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("text/html")) {
    throw new Error(`Built Worker returned unexpected content type: ${contentType}`);
  }
  for (const marker of markers) {
    if (!body.includes(marker)) {
      throw new Error(`Built Worker response is missing marker: ${marker}`);
    }
  }

  console.log(
    `Production Worker smoke passed: HTTP 200 ${contentType}; ${body.length} bytes`,
  );
} finally {
  await stopWorker(worker);
  rmSync(runtimeDir, { recursive: true, force: true });
}
