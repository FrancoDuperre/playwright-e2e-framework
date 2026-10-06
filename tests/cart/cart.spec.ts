import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('added items appear in the cart with matching badge', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.openCart();

    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack, PRODUCTS.bikeLight]);
  });

  test('cart prices match the inventory prices', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    const products = [PRODUCTS.backpack, PRODUCTS.onesie, PRODUCTS.fleeceJacket];
    const inventoryPrices: number[] = [];
    for (const name of products) {
      inventoryPrices.push(await inventoryPage.priceOf(name));
    }

    await inventoryPage.addToCart(...products);
    await inventoryPage.openCart();

    await expect(cartPage.itemNames).toHaveText(products);
    expect(await cartPage.prices()).toEqual(inventoryPrices);
  });

  test('removing an item from the cart updates list and badge', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await inventoryPage.openCart();

    await cartPage.removeItem(PRODUCTS.backpack);

    await expect(cartPage.itemNames).toHaveText([PRODUCTS.bikeLight]);
    await expect(cartPage.cartBadge).toHaveText('1');
  });

  test('removing the last item hides the badge', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.onesie);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(PRODUCTS.onesie);

    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
