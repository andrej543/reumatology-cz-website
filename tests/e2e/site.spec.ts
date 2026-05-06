import { test, expect } from "@playwright/test";
import { completeRheumBooking } from "./helpers";

test.describe("Landing (fork)", () => {
  test("fork cards link to both practices", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator('a.fork-card[href="revmatologie/index.html"]')).toBeVisible();
    await expect(page.locator('a.fork-card[href="prakticky-lekar/index.html"]')).toBeVisible();
    await page.locator('a.fork-card[href="revmatologie/index.html"]').click();
    await expect(page).toHaveURL(/\/revmatologie\/index\.html$/);
    await expect(page.locator(".hero h1")).toContainText(
      /pohybový aparát|musculoskeletal/i
    );
  });
});

test.describe("Language switch", () => {
  test("toggles document language and EN title on home", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("html")).toHaveAttribute("data-lang", "cs");
    await page.locator('[data-lang-switch="en"]').click();
    await expect(page.locator("html")).toHaveAttribute("data-lang", "en");
    await expect(page).toHaveTitle(/Jungmannova Practice/);
    await page.locator('[data-lang-switch="cs"]').click();
    await expect(page.locator("html")).toHaveAttribute("data-lang", "cs");
    await expect(page).toHaveTitle(/Ordinace Jungmannova/);
  });

  test("persists language in localStorage", async ({ page }) => {
    await page.goto("/index.html");
    await page.locator('[data-lang-switch="en"]').click();
    const lang = await page.evaluate(() => localStorage.getItem("oj-lang"));
    expect(lang).toBe("en");
  });
});

test.describe("Rheumatology section", () => {
  test("main nav links load expected pages", async ({ page }) => {
    await page.goto("/revmatologie/index.html");
    const pairs: [string, RegExp][] = [
      ["sluzby.html", /služby|Services/i],
      ["provozni-doba.html", /hodin|Office hours|hours/i],
      ["kontakt.html", /kontakt|Contact/i],
      ["objednavka.html", /objedn|Book/i],
    ];
    for (const [path, titleRx] of pairs) {
      await page.goto(`/revmatologie/${path}`);
      await expect(
        page.locator("main h1, main .booking__intro h1").first()
      ).toBeVisible();
      await expect(page).toHaveTitle(titleRx);
    }
  });

  test("hero CTAs are clickable", async ({ page }) => {
    await page.goto("/revmatologie/index.html");
    await page.locator('.hero__actions a[href="objednavka.html"]').click();
    await expect(page).toHaveURL(/objednavka\.html$/);
    await expect(page.locator("#booking-wizard")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("menu toggle opens nav and link navigates", async ({ page }) => {
    await page.goto("/revmatologie/index.html");
    const toggle = page.locator("[data-nav-toggle]");
    await expect(toggle).toBeVisible();
    await toggle.click();
    const nav = page.locator("#site-nav");
    await expect(nav).toHaveClass(/is-open/);
    await expect(nav.locator('a[href="kontakt.html"]')).toBeVisible();
    await nav.locator('a[href="kontakt.html"]').click();
    await expect(page).toHaveURL(/kontakt\.html$/);
  });
});

test.describe("Booking wizard (revmatologie)", () => {
  test("completes multi-step flow and shows success", async ({ page }) => {
    await completeRheumBooking(page);
    await expect(page.locator("#booking-success")).toBeVisible();
    await expect(page.locator("#booking-wizard")).toBeHidden();
    await expect(page.locator("#booking-success h2 .tx-cs")).toContainText(
      /Děkujeme/
    );
  });
});

test.describe("GP section", () => {
  test("booking page uses GP-specific fields", async ({ page }) => {
    await page.goto("/prakticky-lekar/objednavka.html");
    await expect(page.locator('#booking-root[data-clinic="gp"]')).toBeVisible();
    await page.locator("#visit_type").selectOption("first");
    await page.locator("#urgency").selectOption("standard");
    await page.locator('input[name="consent_accuracy"]').check();
    await page.locator('input[name="consent_gdpr"]').check();
    await page.locator("#btn-next").click();
    await expect(page.locator("#registered_here")).toBeVisible();
    await expect(page.locator("#gp_name")).toHaveCount(0);
  });
});
