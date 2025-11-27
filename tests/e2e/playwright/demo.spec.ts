import { test, expect } from '@playwright/test';

test('CivicGPT Demo Scenario', async ({ page }) => {
    // 1. Load Home Page
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/CivicGPT/);
    await page.click('text=Get Started');

    // 2. Ask Question (Hindi)
    await page.click('text=हिंदी'); // Switch to Hindi
    await page.fill('input[placeholder*="सवाल"]', 'राशन कार्ड कैसे बनेगा?');
    await page.click('button:has-text("पूछें")');
    await expect(page.locator('text=MOCK RESPONSE')).toBeVisible({ timeout: 10000 });

    // 3. Autofill Form
    await page.click('text=ऑटोफिल'); // Navigate to Autofill
    await page.selectOption('select', { index: 1 }); // Select first scheme
    await page.fill('textarea', 'My name is Rahul, age 30, living in Delhi.');
    await page.click('button:has-text("फॉर्म भरें")');
    await expect(page.locator('text=Form Preview')).toBeVisible({ timeout: 10000 });

    // 4. Submit Application
    await page.click('button:has-text("Submit Application")');
    await page.click('button:has-text("I Agree")'); // Consent

    // 5. Check Case Status
    await page.on('dialog', dialog => dialog.accept()); // Handle alert
    await page.click('text=मेरे मामले'); // My Cases
    await expect(page.locator('text=Selected Scheme')).toBeVisible();
});
