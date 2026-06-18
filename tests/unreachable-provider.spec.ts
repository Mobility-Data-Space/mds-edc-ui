import { execSync } from "child_process";
import { expect, test } from "@playwright/test";
import { ContractAgreementsPage } from "./pages/contract-agreements-page";
import { CatalogBrowserPage } from "./pages/catalog-browser-page";
import { counterPartyParticipantConfig, SERVICES } from "./utils/tests-config";

const COUNTER_PARTY_SERVICE = SERVICES[1];
const COUNTER_PARTY_PROTOCOL_URL = counterPartyParticipantConfig.EDC_PROTOCOL_URL;

// `docker compose up` names the container `<project>-<service>-<index>`.
// Resolve the actual id from the service label so the spec works regardless
// of the compose project name (CI uses the repo dir basename).
const resolveContainerId = (service: string): string => {
  const id = execSync(
    `docker ps --filter "label=com.docker.compose.service=${service}" --format "{{.ID}}"`,
  )
    .toString()
    .trim();
  if (!id) throw new Error(`No running container found for service ${service}`);
  return id;
};

const stopCounterParty = () => {
  execSync(`docker stop ${resolveContainerId(COUNTER_PARTY_SERVICE)}`, {
    stdio: "pipe",
  });
};

const startCounterParty = async () => {
  // Container id is stable across stop/start; resolve via the `exited` filter.
  const id = execSync(
    `docker ps -a --filter "label=com.docker.compose.service=${COUNTER_PARTY_SERVICE}" --format "{{.ID}}"`,
  )
    .toString()
    .trim();
  if (!id) throw new Error(`No container found for service ${COUNTER_PARTY_SERVICE}`);
  execSync(`docker start ${id}`, { stdio: "pipe" });
  // give the EDC management API time to come back
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch("http://localhost:9181/api/check/liveness");
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`${COUNTER_PARTY_SERVICE} did not become healthy after restart`);
};

// Regression for the "Failed to load Contract Agreements" hard-failure when
// any single foreign provider is unreachable. Generalised across every page
// that performs a DSP exchange (catalog / negotiation / transfer): each page
// must render with a graceful fallback rather than tearing the view down.
//
// Runs serially (workers: 1) because edc-2 is stopped in beforeAll and the
// other specs assume both connectors are up.
test.describe.configure({ mode: "serial" });

test.describe("Pages survive an unreachable provider", () => {
  test.beforeAll(() => {
    stopCounterParty();
  });

  test.afterAll(async () => {
    // Restart + readiness wait can exceed Playwright's default hook timeout.
    test.setTimeout(180_000);
    await startCounterParty();
  });

  test("Contract Agreements page renders when a provider is offline", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();

    const list = await agreementsPage.getAgreementsList();
    await expect(list).toBeVisible();

    // Enrichment now runs through Promise.allSettled. Foreign catalog calls to
    // the dead provider still take a server-side timeout to reject, so give
    // the cards a generous deadline before claiming the page is broken.
    const cards = await agreementsPage.getLoadedAgreementCards();
    await expect(cards.first()).toBeVisible({ timeout: 90_000 });
    expect(await cards.count()).toBeGreaterThan(0);

    // The global "Failed to load Contract Agreements" toast is the regression
    // we are guarding against. Anything else (a per-card warning, a missing
    // title) is acceptable.
    const errorToast = await agreementsPage.getToastMessage("error");
    await expect(errorToast).toHaveCount(0);
  });

  test("Catalog Browser surfaces an inline error and stays interactive", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const catalogPage = new CatalogBrowserPage(page);
    await catalogPage.navigate();

    // Don't use fillCatalogUrlInput — it waits for a 2xx /catalog response
    // which will never come. We expect the error toast instead.
    const input = page.locator(catalogPage.catalogUrlInputLocator);
    await input.fill(COUNTER_PARTY_PROTOCOL_URL);

    // Two toasts can fire (React strict-mode double effect); just assert at
    // least one is shown.
    const errorToasts = await catalogPage.getToastMessage("error");
    await expect(errorToasts.first()).toBeVisible({ timeout: 90_000 });

    // Page didn't crash: input still editable.
    await expect(input).toBeEditable();
  });

  test("Contract Agreement dialog opens when its provider is offline", async ({
    page,
  }) => {
    const agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();

    // Consumer agreements were negotiated against edc-2; opening one will
    // trigger the dialog's internal catalog.request to the dead provider.
    await agreementsPage.filterByConsumer();

    const cards = await agreementsPage.getLoadedAgreementCards();
    await cards.first().click();

    const dialog = await agreementsPage.getAgreementDialog();
    await expect(dialog).toBeVisible();
  });
});
