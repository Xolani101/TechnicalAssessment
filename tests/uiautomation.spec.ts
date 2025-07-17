import { test, expect } from '@playwright/test';

const tasks = [
  {
    itemSelector: '[data-test="add-to-cart-sauce-labs-backpack"]',
    itemName: 'Sauce Labs Backpack'
  },
  {
    itemSelector: '[data-test="add-to-cart-sauce-labs-bike-light"]',
    itemName: 'Sauce Labs Bike Light'
  },
  {
    itemSelector: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
    itemName: 'Sauce Labs Bolt T-Shirt'
  }
];

test.describe('SauceDemo workflow', () => {
  for (const browserType of ['chromium', 'firefox', 'webkit'] as const) {
    for (const task of tasks) {
      test(`should complete purchase flow for "${task.itemName}" in ${browserType}`, async ({ playwright }) => {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        // Launch website.
        await page.goto('https://www.saucedemo.com');

        // Log in.
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        // Add an item into cart.
        await page.click(task.itemSelector);

        // Go to cart.
        await page.click('.shopping_cart_link');

        // Ensure item is in cart.
        await expect(page.locator('.cart_item')).toHaveCount(1);
        await expect(page.locator('.inventory_item_name')).toContainText(task.itemName);

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
    }
  }
});