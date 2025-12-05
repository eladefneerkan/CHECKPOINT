import { test, expect } from "@playwright/test";

test("user can create a list and delete it", async ({ page }) => {

  await page.goto("http://localhost:5173/login");
  //Log in
  await page.fill("#login-username", "tls123");
  await page.fill("#login-password", "Password1?");
  await page.click("button.btn-primary");

  //Should redirect to profile
  await expect(page).toHaveURL(/profile/);

  await page.getByRole("button", { name: /lists/i }).click().catch(() => {});
  await page.getByRole("button", { name: /\+ add a new list/i }).click();
  const title = "Playwright Test List " + Math.floor(Math.random() * 10000);
  await page.fill("input[placeholder*='Enter list name']", title);
  await page.getByRole("button", { name: /^create$/i }).click();

  await expect(page.getByText(/list created successfully/i)).toBeVisible();

  await page.getByRole("heading", { name: title }).click();

  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  //Delete list
  await page.getByRole("button", { name: /delete list/i }).click();
  await page.getByRole("button", { name: /yes, delete/i }).click();

  //should return to profile
  await expect(page).toHaveURL(/profile/);

  //Verify deleted (list should NOT appear)
  await expect(page.getByRole("heading", { name: title })).not.toBeVisible();
});
