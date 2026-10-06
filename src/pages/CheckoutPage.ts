import { Locator, Page } from '@playwright/test';
import { CustomerInfo } from '../data/checkout';
import { BasePage, parsePrice } from './BasePage';

export interface OrderSummary {
  itemPrices: number[];
  subtotal: number;
  tax: number;
  total: number;
}

/** Covers the three checkout steps: information, overview and confirmation. */
export class CheckoutPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName) await this.firstName.fill(info.firstName);
    if (info.lastName) await this.lastName.fill(info.lastName);
    if (info.postalCode) await this.postalCode.fill(info.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async summary(): Promise<OrderSummary> {
    // allInnerTexts() does not auto-wait, so make sure the overview has rendered first.
    await this.totalLabel.waitFor();
    return {
      itemPrices: await this.readPrices(this.itemPrices),
      subtotal: parsePrice(await this.subtotalLabel.innerText()),
      tax: parsePrice(await this.taxLabel.innerText()),
      total: parsePrice(await this.totalLabel.innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
