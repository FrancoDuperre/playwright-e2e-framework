import { test as setup, expect } from '@playwright/test';
import { AUTH_STATE_PATH, USERS, password } from '../src/data/users';
import { LoginPage } from '../src/pages/LoginPage';

setup('log in once and save the session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard, password());
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
