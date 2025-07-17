import { test, expect, chromium } from '@playwright/test';

test.describe('SauceDemo workflow', () => {
  test('should complete the purchase flow', async () => {
  // Launch browser and new page.
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Launch website.
  await page.goto('https://www.saucedemo.com');

  // Log in.
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add an item into cart.
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // Go to cart.
  await page.click('.shopping_cart_link');

  // Ensure item is in cart.
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');

  // Proceed to checkout.
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', 'Test');
  await page.fill('[data-test="lastName"]', 'User');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');

  // Complete the checkout.
  await page.click('[data-test="finish"]');

  // Ensure status.
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // Log out.
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(600);
  await page.click('#logout_sidebar_link');

  // Ensure we are back on login page.
  await expect(page).toHaveURL('https://www.saucedemo.com/');

  // Close browser.
  await browser.close();
  });
});