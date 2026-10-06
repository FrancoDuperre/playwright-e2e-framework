import { test, expect, noSession } from '../../src/fixtures';
import { LOGIN_ERRORS } from '../../src/data/messages';

test.describe('Session', () => {
  test('logout returns to login and blocks protected pages', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage, loginPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();

    await inventoryPage.goto();
    await expect(loginPage.error).toHaveText(LOGIN_ERRORS.protectedPage('/inventory.html'));
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test.describe('without a session', () => {
    test.use(noSession);

    for (const path of ['/inventory.html', '/cart.html', '/checkout-step-one.html']) {
      test(`direct access to ${path} is blocked`, { tag: '@regression' }, async ({ page, loginPage }) => {
        await page.goto(path);

        await expect(loginPage.error).toHaveText(LOGIN_ERRORS.protectedPage(path));
        await expect(loginPage.loginButton).toBeVisible();
      });
    }
  });
});
