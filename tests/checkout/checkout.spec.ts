import { test, expect } from '../../src/fixtures';
import { CUSTOMER } from '../../src/data/checkout';
import { CHECKOUT_ERRORS, ORDER_COMPLETE_HEADER } from '../../src/data/messages';
import { PRODUCTS } from '../../src/data/products';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('complete purchase happy path', { tag: ['@smoke', '@regression'] }, async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation(CUSTOMER);
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText(ORDER_COMPLETE_HEADER);
    await expect(checkoutPage.cartBadge).toBeHidden();
  });

  test('order summary totals add up', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(CUSTOMER);
    await checkoutPage.continue();

    const { itemPrices, subtotal, tax, total } = await checkoutPage.summary();

    expect(itemPrices).toHaveLength(2);
    expect(subtotal).toBeCloseTo(itemPrices.reduce((sum, p) => sum + p, 0), 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  const validationCases = [
    { missing: 'first name', info: { ...CUSTOMER, firstName: '' }, error: CHECKOUT_ERRORS.firstNameRequired },
    { missing: 'last name', info: { ...CUSTOMER, lastName: '' }, error: CHECKOUT_ERRORS.lastNameRequired },
    { missing: 'postal code', info: { ...CUSTOMER, postalCode: '' }, error: CHECKOUT_ERRORS.postalCodeRequired },
  ];

  for (const { missing, info, error } of validationCases) {
    test(`validation: ${missing} is required`, { tag: '@regression' }, async ({ checkoutPage, page }) => {
      await checkoutPage.fillInformation(info);
      await checkoutPage.continue();

      await expect(checkoutPage.error).toHaveText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
