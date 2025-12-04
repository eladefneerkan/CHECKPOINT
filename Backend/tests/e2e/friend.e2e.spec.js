// @ts-check
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("E2E — login → search users → send friend request", () => {

  test("User logs in, searches a user, and sends a friend request", async ({ page }) => {

    console.log("Logging in...");

    await page.goto("http://localhost:5173/login");

    await page.fill("#login-username", "tls123");
    await page.fill("#login-password", "Password1?");
    await page.click("button.btn-primary");

    await expect(page).toHaveURL(/profile/);
    console.log("Logged in successfully");

    console.log("Navigating to /search-users ...");

    await page.goto("http://localhost:5173/search-users");

    console.log("PAGE HTML:");
    console.log(await page.content());
    await expect(page).toHaveURL(/search-users/);

    console.log("Search Users page loaded");

    const targetUser = "gojoe_is_alive";

    console.log(`Searching for '${targetUser}'...`);

    const searchBox = page.getByPlaceholder(/search/i);
    await expect(searchBox).toBeVisible();
    
    await searchBox.fill(targetUser);

    await page.getByRole("button", { name: /^search$/i }).click();

    //render
    await page.waitForTimeout(1500);

    const resultCard = page.locator(`text=${targetUser}`).first();
    await expect(resultCard).toBeVisible();

    console.log("User found in search results");

    console.log("Sending friend request...");

    const alertPromise = page.waitForEvent("dialog");
    const addButton = resultCard.getByRole("button", { name: /add friend/i });
    await addButton.click({ force: true });

  });

});
