import { test, expect } from '../../src/fixtures';
import { SORT_OPTIONS } from '../../src/data/products';

test.describe('Inventory sorting', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('sort by name A to Z', { tag: '@regression' }, async ({ inventoryPage }) => {
    // A to Z is the default order, so sort the other way first to prove the change is applied.
    await inventoryPage.sortBy(SORT_OPTIONS.nameDesc);
    await inventoryPage.sortBy(SORT_OPTIONS.nameAsc);

    const names = await inventoryPage.names();
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sort by name Z to A', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.nameDesc);

    const names = await inventoryPage.names();
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort by price low to high', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.priceAsc);

    const prices = await inventoryPage.prices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.priceDesc);

    const prices = await inventoryPage.prices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
