// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
};

module.exports = config;
