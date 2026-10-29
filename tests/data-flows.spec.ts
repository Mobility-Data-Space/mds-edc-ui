import { expect, test } from '@playwright/test';
import { DataFlowsPage } from './pages/data-flows-page';
import { initiate_consumer_transfer } from './utils/seed';
import {
  counterPartyParticipantConfig,
  participantConfig,
} from './utils/tests-config';
import type { Participant } from '../src/utilities/participant';

const EDC_CONTEXT = { '@vocab': 'https://w3id.org/edc/v0.0.1/ns/' };
const DATA_FLOWS_REQUEST = '/connector/management/v4/dataflows/request';
const managementHeaders = {
  'content-type': 'application/json',
  'x-api-key': participantConfig.EDC_MANAGEMENT_API_KEY,
};

const asParticipant = (
  c: typeof participantConfig | typeof counterPartyParticipantConfig,
): Participant =>
  ({
    id: c.EDC_ID,
    name: c.EDC_NAME,
    description: c.EDC_DESCRIPTION,
    publicUrl: c.EDC_PUBLIC_URL,
    managementUrl: c.EDC_MANAGEMENT_URL,
    defaultUrl: c.EDC_DEFAULT_URL,
    protocolUrl: c.EDC_PROTOCOL_URL,
    curatorName: c.EDC_CURATOR_ORGANIZATION,
    curatorUrl: c.EDC_CURATOR_URL,
    maintainerName: c.EDC_MAINTAINER_ORGANIZATION,
    maintainerUrl: c.EDC_MAINTAINER_URL,
    dapsUrl: c.MDS_DAPS_URL,
    dapsJwksUrl: c.MDS_DAPS_JWKS_URL,
  }) as Participant;

test.describe('Data Flows Page Tests', () => {
  let dataFlowsPage: DataFlowsPage;
  // The UI connector only has a data flow once it consumes from a reachable
  // provider, so seed one against the counter-party and wait for it to surface.
  let dataFlowId: string;

  test.beforeAll(async ({ request }) => {
    test.setTimeout(120000);
    dataFlowId = await initiate_consumer_transfer(
      asParticipant(participantConfig),
      asParticipant(counterPartyParticipantConfig),
    );

    await expect
      .poll(
        async () => {
          const res = await request.post(
            `${participantConfig.EDC_MANAGEMENT_URL}/v4/dataflows/request`,
            {
              headers: managementHeaders,
              data: { '@context': EDC_CONTEXT, '@type': 'QuerySpec' },
            },
          );
          const flows = (await res.json()) as unknown[];
          return Array.isArray(flows) ? flows.length : 0;
        },
        { timeout: 30000, intervals: [1000] },
      )
      .toBeGreaterThan(0);
  });

  test.beforeEach(async ({ page }) => {
    dataFlowsPage = new DataFlowsPage(page);
    await dataFlowsPage.navigate();
  });

  test('displays the data flows list with the seeded flow', async () => {
    await expect(await dataFlowsPage.getDataFlowsList()).toBeVisible();

    const rows = await dataFlowsPage.getDataFlowRows();
    await expect(rows).not.toHaveCount(0);
  });

  test('opens the data flow details dialog', async () => {
    const rows = await dataFlowsPage.getDataFlowRows();
    await rows.first().getByTestId('show-data-flow-details').click();

    const dialog = await dataFlowsPage.getDetailsDialog();
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('DataFlow');
  });

  test('surfaces the data address outcome without crashing', async ({
    page,
  }) => {
    const rows = await dataFlowsPage.getDataFlowRows();
    await rows.first().getByTestId('show-data-address').click();

    // Whether the seeded flow has a resolvable address depends on the data-plane
    // signing config, which differs across the DCP and DAPS stacks: a resolved
    // address (200) opens the dialog, while one not yet available (404) surfaces
    // an info toast. Either is a correct, non-crashing outcome.
    const infoToast = page.locator('[data-testid="toast-info-message"]');
    const addressDialog = page.locator('[data-testid="jsonld-dialog"]');
    await expect(infoToast.or(addressDialog).first()).toBeVisible();
  });

  test('search input and trigger are present', async () => {
    await expect(await dataFlowsPage.getSearchInput()).toBeVisible();
    await expect(await dataFlowsPage.getSearchTrigger()).toBeVisible();
  });

  test('empty search clears the list and clearing restores it', async () => {
    await dataFlowsPage.searchDataFlows('nonexistent-asset-xyz-12345');
    await expect(await dataFlowsPage.getDataFlowRows()).toHaveCount(0);

    await dataFlowsPage.clearDataFlowSearch();
    await expect(await dataFlowsPage.getDataFlowRows()).not.toHaveCount(0);
  });

  test('displays pagination controls', async () => {
    await expect(await dataFlowsPage.getPaginationInfo()).toBeVisible();
  });

  test('proxies the data flows query and the data address lookup', async ({
    request,
  }) => {
    const query = await request.post(DATA_FLOWS_REQUEST, {
      data: { '@context': EDC_CONTEXT, '@type': 'QuerySpec' },
    });
    expect(query.ok()).toBeTruthy();

    const flows = (await query.json()) as { '@id': string }[];
    expect(Array.isArray(flows)).toBeTruthy();
    expect(flows.some((flow) => flow['@id'] === dataFlowId)).toBeTruthy();

    const address = await request.get(
      `/connector/management/v4/dataflows/${dataFlowId}/dataaddress`,
    );
    // Proxied cleanly: the address is returned, or 404 until the flow produces one.
    expect([200, 404]).toContain(address.status());
  });
});
