import { expect, test } from '@playwright/test';
import { CreateDataOfferPage } from './pages/create-data-offer-page';

const unrestrictedSuccessMsg = 'Data offer was published successfully!';
const assetOnlySuccessMsg = 'Asset was created successfully!';

test.describe('Create Data Offer Tests', () => {
  let createDataOfferPage: CreateDataOfferPage;

  test.beforeEach(async ({ page }) => {
    createDataOfferPage = new CreateDataOfferPage(page);
    await createDataOfferPage.navigate();
  });

  test('should successfully create a data offer with unrestricted policy', async ({ page }) => {
    const title = `Test Data Offer ${Date.now()}`;
    const assetId = `this-is-a-test-data-offer-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")

    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_UNRESTRICTED").check()
    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg);

    await page.waitForURL('/data-offers', { timeout: 10000 });
  });

  test('should successfully create a data offer with restricted policy', async ({ page }) => {
    const title = `Test Restricted Data Offer ${Date.now()}`;
    const assetId = `this-is-a-restricted-test-data-offer-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")
    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_RESTRICTED").check()

    await page.click('text=Publish restricted');

    await page.click('[data-testid="add-expression-button"]');
    await page.click('[data-testid="participant-id-expression"]');
    await createDataOfferPage.fillParticipantId('test-participant')

    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage()
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg); // The same message as unrestricted

    await page.waitForURL('/data-offers', { timeout: 10000 });
  });

  test('should successfully create an asset only', async ({ page }) => {
    const title = `Test Asset Only ${Date.now()}`;
    const assetId = `this-is-a-test-asset-only-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")
    await createDataOfferPage.getDataOfferPublishMode("DO_NOT_PUBLISH").check()

    await page.click('text=Create asset only (without data offer)');

    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage()
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(assetOnlySuccessMsg);

    await page.waitForURL('/assets', { timeout: 10000 });
  });

  test('should keep submit button disabled until all required fields are filled', async ({ page }) => {
    const createDataOfferPage = new CreateDataOfferPage(page);
    await createDataOfferPage.navigate();

    const title = `Test Disabled Submit ${Date.now()}`;
    const assetId = `disabled-submit-test-${Date.now()}`;
    const dataAddressUrl = "https://google.com";
    const submitButton = createDataOfferPage.submitButton();

    await expect(submitButton).toBeDisabled();

    await createDataOfferPage.dataAddressUrlInput().fill(dataAddressUrl);
    await expect(submitButton).toBeDisabled();

    await createDataOfferPage.titleInput().fill(title);
    await expect(submitButton).toBeDisabled();

    await createDataOfferPage.assetIdInput().fill(assetId);
    await expect(submitButton).toBeDisabled();

    await page.getByRole('combobox').filter({ hasText: 'Select data category' }).click();
    await page.locator('ul[role="listbox"] li[role="option"]').first().click();
    await expect(submitButton).toBeEnabled();

    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_RESTRICTED").check();

    page.click('[data-testid="add-expression-button"]');
    await page.click('[data-testid="participant-id-expression"]');

    await expect(submitButton).toBeDisabled();
    await createDataOfferPage.fillParticipantId('test-participant')

    await expect(submitButton).toBeEnabled();
  });

  test('should generate data offer ID with mds-data-offer- prefix', async ({ page }) => {
    const title = `Test Naming Convention ${Date.now()}`;
    const assetId = `naming-convention-test-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")

    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_UNRESTRICTED").check()
    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg);

    await page.waitForURL('/data-offers', { timeout: 10000 });

    // Navigate to data offers page and check the newly created data offer has the correct naming convention
    const dataOfferCards = page.locator('.data-offer-card');
    await expect(dataOfferCards.first()).toBeVisible();
    
    // Find the newly created data offer by looking for the contract definition ID
    const contractIdElements = page.locator('[data-testid="contract-definition-id"]');
    const contractIds = await contractIdElements.allTextContents();
    
    // Check that at least one data offer has the mds-data-offer- prefix
    const hasCorrectPrefix = contractIds.some(id => id.startsWith('mds-data-offer-'));
    expect(hasCorrectPrefix).toBeTruthy();
    
    // Verify the format: mds-data-offer-DDMMYYYY_UID
    const correctFormatIds = contractIds.filter(id => /^mds-data-offer-\d{8}_\d+$/.test(id));
    expect(correctFormatIds.length).toBeGreaterThan(0);
  });

  test("should create kafka data source", async ({ page }) => {
    const input = {
      asset: {
        title: `Kafka Data Offer ${Date.now()}`,
        id: `kafka-test-data-offer-${Date.now()}`,
      },
      kafka: {
        topic: "test topic",
        oidcDiscoveryUrl: "http://example.com",
        bootstrapServers: "port.com:500",
        saslMechanism: "OAUTHBEARER",
        securityProtocol: "SASL_SSL",
        oidcRegisterClientTokenKey: "test client token",
        kafkaAdminPropertiesKey: "test admin key",
      },
    } as const;

    await createDataOfferPage.navigate();
    await createDataOfferPage.fillKafkaDataInput(input);

    await createDataOfferPage
      .getDataOfferPublishMode("PUBLISH_UNRESTRICTED")
      .check();

    // Set up listener for the assets API endpoint before clicking submit
    const responsePromise = page.waitForResponse((response) => {
      const urlMatches = response
        .url()
        .includes("/connector/management/v3/assets");
      const isPost = response.request().method() === "POST";
      return urlMatches && isPost;
    });

    await createDataOfferPage.submitButton().click();

    // Wait for the response and verify the payload
    const response = await responsePromise;
    const requestBody = JSON.parse(response.request().postData() || "{}");

    // Verify payload contains expected keys
    expect(requestBody).toHaveProperty("dataAddress");

    const dataAddress = requestBody.dataAddress;
    expect(dataAddress.type).toBe("Kafka");
    expect(dataAddress.topic).toBe("test topic");
    expect(dataAddress.oidcDiscoveryUrl).toBe("http://example.com");
    expect(dataAddress["kafka.bootstrap.servers"]).toBe("port.com:500");
    expect(dataAddress["kafka.sasl.mechanism"]).toBe("OAUTHBEARER");
    expect(dataAddress["kafka.security.protocol"]).toBe("SASL_SSL");
    expect(dataAddress.oidcRegisterClientTokenKey).toBe("test client token");
    expect(dataAddress.kafkaAdminPropertiesKey).toBe("test admin key");

    const toast = createDataOfferPage.getSuccessMessage();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg);

    await page.waitForURL("/data-offers", { timeout: 10000 });
  });

  test("should update kafka data source correctly", async ({ page }) => {
    const initialInput = {
      asset: {
        title: `Update Data Offer ${Date.now()}`,
        id: `update-kafka-test-data-offer-${Date.now()}`,
      },
      kafka: {
        topic: "test topic",
        oidcDiscoveryUrl: "http://example.com",
        bootstrapServers: "port.com:500",
        saslMechanism: "OAUTHBEARER",
        securityProtocol: "SASL_SSL",
        oidcRegisterClientTokenKey: "test client token",
        kafkaAdminPropertiesKey: "test admin key",
      },
    } as const;

    await createDataOfferPage.navigate();
    await createDataOfferPage.fillKafkaDataInput(initialInput);

    await createDataOfferPage
      .getDataOfferPublishMode("PUBLISH_UNRESTRICTED")
      .check();
    await createDataOfferPage.submitButton().click();

    await page.waitForURL("/data-offers", { timeout: 10000 });

    // Now we edit what we did

    await page.goto(`/assets/${initialInput.asset.id}/edit`);

    const editedKafkaAsset = {
      kafka: {
        topic: "new topic",
        oidcDiscoveryUrl: "http://edited-example.com",
        bootstrapServers: "edited-port.com:500",
        saslMechanism: "OAUTHBEARER",
        securityProtocol: "SASL_SSL",
        oidcRegisterClientTokenKey: "edited client token",
        kafkaAdminPropertiesKey: "edited admin key",
      },
    } as const;

    await page
      .getByRole("radio", { name: "Available (with data source)" })
      .check();
    await createDataOfferPage.fillKafkaDataInput(editedKafkaAsset);

    // Set up listener for the assets API endpoint before clicking submit
    const response = page.waitForResponse((response) => {
      const urlMatches = response
        .url()
        .includes("/connector/management/v3/assets");
      const isPost = response.request().method() === "PUT";
      return urlMatches && isPost;
    });

    await createDataOfferPage.submitButton().click();

    const editREponse = await response;

    const editBody = JSON.parse(editREponse.request().postData() || "{}");
    expect(editBody).toHaveProperty("dataAddress");

    const editBodyAddress = editBody.dataAddress;
    expect(editBodyAddress.type).toBe("Kafka");
    expect(editBodyAddress.topic).toBe("new topic");
    expect(editBodyAddress.oidcDiscoveryUrl).toBe("http://edited-example.com");
    expect(editBodyAddress["kafka.bootstrap.servers"]).toBe(
      "edited-port.com:500",
    );
    expect(editBodyAddress["kafka.sasl.mechanism"]).toBe("OAUTHBEARER");
    expect(editBodyAddress["kafka.security.protocol"]).toBe("SASL_SSL");
    expect(editBodyAddress.oidcRegisterClientTokenKey).toBe(
      "edited client token",
    );
    expect(editBodyAddress.kafkaAdminPropertiesKey).toBe("edited admin key");
  });

});
