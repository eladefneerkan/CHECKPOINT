import { test, expect } from "@playwright/test";

test("existing user can login and see dashboard", async ({ page }) => {
  await page.goto("/login");

  //Fill login form
  await page.fill("#login-username", "tls123").catch(async () => {
    await page.fill("input[name='username']", "tls123");
  });

  await page.fill("#login-password", "Password1?").catch(async () => {
    await page.fill("input[name='password']", "Password1?");
  });

  //Submit login form
  await page.click("button.btn-primary");


  //Expect dashboard to be visible
  await expect(page.getByText(/my game lists/i)).toBeVisible();
});
