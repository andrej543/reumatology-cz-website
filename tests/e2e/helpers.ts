import type { Page } from "@playwright/test";

/** Complete the rheumatology booking wizard with minimal valid data (CS locale). */
export async function completeRheumBooking(page: Page) {
  await page.goto("/revmatologie/objednavka.html");

  await page.locator("#visit_type").selectOption("first");
  await page.locator("#urgency").selectOption("standard");
  await page.locator('input[name="consent_accuracy"]').check();
  await page.locator('input[name="consent_gdpr"]').check();
  await page.locator("#btn-next").click();

  await page.locator("#first_name").fill("Test");
  await page.locator("#last_name").fill("Patient");
  await page.locator("#birthdate").fill("1990-05-15");
  await page.locator("#insurer").selectOption({ index: 1 });
  await page.locator("#gp_name").fill("MUDr. Example, Praha 3");
  await page.locator("#phone").fill("+420601234567");
  await page.locator("#btn-next").click();

  await page.locator("#chief_complaint").fill("Joint pain for testing.");
  await page.locator("#symptom_duration").selectOption("m1");
  await page.locator("#btn-next").click();

  await page.locator("#medications").fill("None for demo.");
  await page.locator("#btn-next").click();

  await page.locator('input[name="sx_none"]').check();
  await page.locator("#btn-next").click();

  await page.locator("#btn-next").click();

  await page.locator("#btn-next").click();

  await page.locator("#booking-success").waitFor({ state: "visible" });
}
