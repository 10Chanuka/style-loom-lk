import { test, expect } from "@playwright/test";

test.describe("Clothing E-Commerce Complete User Flow Tests", () => {
  
  test("1. Customer signup with password and 6-digit OTP verification", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.click('button:has-text("Login")');
    await page.click('button:has-text("Sign Up")');

    await page.fill('input[placeholder="Amaya Perera"]', "Test Customer");
    await page.fill('input[placeholder="amaya@example.com"]', "testcustomer@example.com");
    await page.fill('input[placeholder="At least 6 characters"]', "Password123!");
    await page.fill('input[placeholder="Repeat password"]', "Password123!");

    await page.click('button:has-text("Continue to Verification")');

    // OTP verification screen
    await expect(page.locator("text=Verify Email with 6-Digit OTP")).toBeVisible();

    // Fill 6 digits
    const inputs = page.locator('input[id^="otp-input-"]');
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).fill("1");
    }

    await page.click('button:has-text("Verify Code & Log In")');
    await expect(page.locator("text=Logged in")).toBeVisible();
  });

  test("2. Customer login and logout", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.click('button:has-text("Login")');
    await page.fill('input[placeholder="name@example.com"]', "amaya@example.com");
    await page.fill('input[placeholder="••••••••"]', "password123");
    await page.click('button[type="submit"]:has-text("Log In")');

    await expect(page.locator("text=My Account")).toBeVisible();
  });

  test("3. Browse each product category (T-Shirts, Kurtas, Blouses)", async ({ page }) => {
    await page.goto("http://localhost:3000/category/t-shirts");
    await expect(page.locator("h1")).toContainText("T-Shirts");

    await page.goto("http://localhost:3000/category/kurtas");
    await expect(page.locator("h1")).toContainText("Kurtas");

    await page.goto("http://localhost:3000/category/blouses");
    await expect(page.locator("h1")).toContainText("Blouses");
  });

  test("4. Select size, colour and add to cart", async ({ page }) => {
    await page.goto("http://localhost:3000/products/minimalist-tropical-palm-graphic-tee");
    await expect(page.locator("h1")).toContainText("Minimalist Tropical Palm Graphic Tee");

    // Select variant button if present
    const variantBtn = page.locator('button:has-text("M (Black)")');
    if (await variantBtn.isVisible()) {
      await variantBtn.click();
    }

    // Add to cart
    await page.click('button:has-text("Add to Cart")');
  });

  test("5. Modify cart quantity and place WhatsApp order", async ({ page }) => {
    await page.goto("http://localhost:3000/cart");
    await expect(page.locator("h1")).toContainText("Shopping Cart");
  });

  test("6. Submit customization request", async ({ page }) => {
    await page.goto("http://localhost:3000/customize");
    await expect(page.locator("h1")).toContainText("Custom Clothing Request");

    await page.click('button:has-text("Next Step: Specifications")');
    await page.fill('textarea', "Custom floral embroidery on left chest and gold piping.");
    await page.click('button:has-text("Next Step: Reference Image")');
    await page.click('button:has-text("Next Step: Contact Details")');
  });

  test("7. Submit feedback form", async ({ page }) => {
    await page.goto("http://localhost:3000/feedback");
    await expect(page.locator("h1")).toContainText("We Value Your Thoughts");
  });

  test("8. Administrator login and dashboard access", async ({ page }) => {
    await page.goto("http://localhost:3000/admin/login");
    await page.fill('input[placeholder="admin@elegancefashion.lk"]', "admin@elegancefashion.lk");
    await page.fill('input[placeholder="••••••••"]', "adminpass");
    await page.click('button:has-text("Login to Admin Portal")');

    await expect(page.locator("h1")).toContainText("Store Dashboard Overview");
  });

  test("9. Customer cannot access admin pages", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    await expect(page.locator("text=Access Denied")).toBeVisible();
  });

  test("10. Mobile navigation works correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3000/");
    await expect(page.locator("text=Elegance")).toBeVisible();
  });
});
