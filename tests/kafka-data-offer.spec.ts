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
    await  page.getByRole("combobox", { name: /type/i }).click();
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

    await expect(
      page.getByRole("radio", { name: "Available (with data source)" })
    ).toBeVisible();
    await page
      .getByRole("radio", { name: "Available (with data source)" })
      .check();
    await  page.getByRole("combobox", { name: /type/i }).click();
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
