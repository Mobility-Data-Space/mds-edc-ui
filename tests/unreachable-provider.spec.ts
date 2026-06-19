import { expect, test } from "@playwright/test";
import { ContractAgreementsPage } from "./pages/contract-agreements-page";
import { CatalogBrowserPage } from "./pages/catalog-browser-page";
import { DEAD_PROVIDER_ASSET_ID } from "./utils/tests-config";

// edc-3 is brought up during seed, used to negotiate one finalized agreement,
// then stopped at the end of globalSetup. Its agreement therefore points at a
// permanently-unreachable counterparty for the duration of the suite.
const BOGUS_DSP_URL = "http://offline-host.invalid:9999/api/dsp";

test.describe("Pages survive an unreachable provider", () => {
  test("Contract Agreements page renders despite a dead provider", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();

    const card = await agreementsPage.getAgreementCardByAssetId(
      DEAD_PROVIDER_ASSET_ID,
    );
    await expect(card.first()).toBeVisible({ timeout: 90_000 });

    const errorToast = await agreementsPage.getToastMessage("error");
    await expect(errorToast).toHaveCount(0);
  });

  test("Catalog Browser surfaces an inline error and stays interactive", async ({
    page,
  }) => {
    const catalogPage = new CatalogBrowserPage(page);
    await catalogPage.navigate();

    const input = page.locator(catalogPage.catalogUrlInputLocator);
    await input.fill(BOGUS_DSP_URL);

    const errorToasts = await catalogPage.getToastMessage("error");
    await expect(errorToasts.first()).toBeVisible({ timeout: 60_000 });
    await expect(input).toBeEditable();
  });

  test("Contract Agreement dialog opens for the dead-provider agreement", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();
    await agreementsPage.filterByConsumer();

    const card = await agreementsPage.getAgreementCardByAssetId(
      DEAD_PROVIDER_ASSET_ID,
    );
    await card.first().click();

    const dialog = await agreementsPage.getAgreementDialog();
    await expect(dialog).toBeVisible();
  });
});
