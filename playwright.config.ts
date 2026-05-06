import { defineConfig, devices } from "@playwright/test";

/**
 * Serves the static site locally; tests hit pages under baseURL.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    cwd: process.cwd(),
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
