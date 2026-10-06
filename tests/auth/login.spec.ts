import { test, expect, noSession } from '../../src/fixtures';
import { LOGIN_ERRORS } from '../../src/data/messages';
import { USERS, password } from '../../src/data/users';

test.use(noSession);

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user lands on the inventory', { tag: ['@smoke', '@regression'] }, async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard, password());

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('wrong password shows an error', { tag: '@regression' }, async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard, 'not-the-password');

    await expect(loginPage.error).toHaveText(LOGIN_ERRORS.invalidCredentials);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked-out user cannot log in', { tag: '@regression' }, async ({ loginPage, page }) => {
    await loginPage.login(USERS.lockedOut, password());

    await expect(loginPage.error).toHaveText(LOGIN_ERRORS.lockedOut);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  const emptyFieldCases = [
    { name: 'both fields empty', withUsername: false, withPassword: false, error: LOGIN_ERRORS.usernameRequired },
    { name: 'username empty', withUsername: false, withPassword: true, error: LOGIN_ERRORS.usernameRequired },
    { name: 'password empty', withUsername: true, withPassword: false, error: LOGIN_ERRORS.passwordRequired },
  ];

  for (const { name, withUsername, withPassword, error } of emptyFieldCases) {
    test(`validation: ${name}`, { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.login(withUsername ? USERS.standard : '', withPassword ? password() : '');

      await expect(loginPage.error).toHaveText(error);
    });
  }
});
