import { expect, test } from '@playwright/test';
import { CreateDataOfferPage } from './pages/create-data-offer-page';

const unrestrictedSuccessMsg = 'Data offer was published successfully!';

test.describe('Create and Update Kafka Data Offer Tests', () => {
  let createDataOfferPage: CreateDataOfferPage;

  test.beforeEach(async ({ page }) => {
    createDataOfferPage = new CreateDataOfferPage(page);
    await createDataOfferPage.navigate();
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
        saslOauthbearerExtensions: "logicalCluster=abc123,identityPoolId=pool-xyz",
      },
    } as const;

    await createDataOfferPage.navigate();
    await  page.getByRole("combobox", { name: /type/i }).click();
    await createDataOfferPage.fillKafkaDataInput(input);

    await createDataOfferPage
      .getDataOfferPublishMode("PUBLISH_UNRESTRICTED")
      .check();

    // Set up listener for the assets API endpoint before clicking submit
    const responsePromise = page.waitForResponse((response) => {
      const url = response.url();
      const urlMatches = url.includes("/connector/management/v3/assets") &&
        !url.includes("/connector/management/v3/assets/");
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
    expect(dataAddress).toEqual({
      type: "Kafka",
      topic: "test topic",
      oidcDiscoveryUrl: "http://example.com",
      "kafka.bootstrap.servers": "port.com:500",
      "kafka.sasl.mechanism": "OAUTHBEARER",
      "kafka.security.protocol": "SASL_SSL",
      oidcRegisterClientTokenKey: "test client token",
      kafkaAdminPropertiesKey: "test admin key",
      "kafka.sasl.oauthbearer.extensions": "logicalCluster=abc123,identityPoolId=pool-xyz",
    })

    const toast = createDataOfferPage.getSuccessMessage();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg);

    await page.waitForURL("/data-offers", { timeout: 10000 });
  });

  test("should create kafka data source without optional extensions field", async ({ page }) => {
    const input = {
      asset: {
        title: `Kafka No Extensions ${Date.now()}`,
        id: `kafka-no-ext-${Date.now()}`,
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
    await page.getByRole("combobox", { name: /type/i }).click();
    await createDataOfferPage.fillKafkaDataInput(input);

    await createDataOfferPage
      .getDataOfferPublishMode("PUBLISH_UNRESTRICTED")
      .check();

    const responsePromise = page.waitForResponse((response) => {
      const url = response.url();
      const urlMatches = url.includes("/connector/management/v3/assets") &&
        !url.includes("/connector/management/v3/assets/");
      const isPost = response.request().method() === "POST";
      return urlMatches && isPost;
    });

    await createDataOfferPage.submitButton().click();

    const response = await responsePromise;
    const requestBody = JSON.parse(response.request().postData() || "{}");

    expect(requestBody).toHaveProperty("dataAddress");

    const dataAddress = requestBody.dataAddress;
    expect(dataAddress).toEqual({
      type: "Kafka",
      topic: "test topic",
      oidcDiscoveryUrl: "http://example.com",
      "kafka.bootstrap.servers": "port.com:500",
      "kafka.sasl.mechanism": "OAUTHBEARER",
      "kafka.security.protocol": "SASL_SSL",
      oidcRegisterClientTokenKey: "test client token",
      kafkaAdminPropertiesKey: "test admin key",
    });

    expect(dataAddress).not.toHaveProperty("kafka.sasl.oauthbearer.extensions");

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
        saslOauthbearerExtensions: "logicalCluster=abc123,identityPoolId=pool-xyz",
      },
    } as const;

    await createDataOfferPage.navigate();
    await  page.getByRole("combobox", { name: /type/i }).click();
    await createDataOfferPage.fillKafkaDataInput(initialInput);

    await createDataOfferPage
      .getDataOfferPublishMode("PUBLISH_UNRESTRICTED")
      .check();
    await createDataOfferPage.submitButton().click();

    await page.waitForURL("/data-offers", { timeout: 10000 });

    // Now we edit what we did

    await page.goto(`/assets/${initialInput.asset.id}/edit`);
    await page.waitForResponse((response) => response.url().includes('/connector/management/v3/assets'));

    const editedKafkaAsset = {
      kafka: {
        topic: "new topic",
        oidcDiscoveryUrl: "http://edited-example.com",
        bootstrapServers: "edited-port.com:500",
        saslMechanism: "OAUTHBEARER",
        securityProtocol: "SASL_SSL",
        oidcRegisterClientTokenKey: "edited client token",
        kafkaAdminPropertiesKey: "edited admin key",
        saslOauthbearerExtensions: "logicalCluster=edited123,identityPoolId=pool-edited",
      },
    } as const;

    await expect(
      page.getByRole("radio", { name: "Available (with data source)" })
    ).toBeVisible();
    await page
      .getByRole("radio", { name: "Available (with data source)" })
      .check();
    const typeCombobox = page.getByRole("combobox", { name: /type/i });
    await expect(typeCombobox).toBeVisible({ timeout: 15000 });
    await typeCombobox.click();
    await createDataOfferPage.fillKafkaDataInput(editedKafkaAsset);

    // Set up listener for the assets API endpoint before clicking submit
    const response = page.waitForResponse((response) => {
      const url = response.url();
      const urlMatches = url.includes("/connector/management/v3/assets") &&
        !url.includes("/connector/management/v3/assets/");
      const isPut = response.request().method() === "PUT";
      return urlMatches && isPut;
    });

    await createDataOfferPage.submitButton().click();

    const editREponse = await response;

    const editBody = JSON.parse(editREponse.request().postData() || "{}");
    expect(editBody).toHaveProperty("dataAddress");

    const editBodyAddress = editBody.dataAddress;
    expect(editBodyAddress).toEqual({
      type: "Kafka",
      topic: "new topic",
      oidcDiscoveryUrl: "http://edited-example.com",
      "kafka.bootstrap.servers": "edited-port.com:500",
      "kafka.sasl.mechanism": "OAUTHBEARER",
      "kafka.security.protocol": "SASL_SSL",
      oidcRegisterClientTokenKey: "edited client token",
      kafkaAdminPropertiesKey: "edited admin key",
      "kafka.sasl.oauthbearer.extensions": "logicalCluster=edited123,identityPoolId=pool-edited",
    })
  });

});
