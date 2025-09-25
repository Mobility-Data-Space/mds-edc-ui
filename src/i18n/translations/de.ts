export const de = {
  translation: {
    _app: {
      logIn: "Einloggen",
      useCases: "Anwendungsfälle",
      search: "Suche",
      searchPlaceholder: "Geben Sie Ihre Suchanfrage ein",
      buttonSearch: "Suche",
      useCasesList: {
        quality: "Qualität",
        "circular-economy": "Kreislaufwirtschaft",
      },
      environments: {
        development: "Entwicklung",
        integration: "Integration",
        production: "Produktion",
      },
    },
    dashboard: {
      title: "Dashboard",
      edcDescription:
        "Teilen Sie den folgenden Connector-Endpunkt, damit andere auf den Katalog Ihres EDC-Connectors zugreifen können. Dies ist insbesondere bei connector-beschränkten Datenangeboten nützlich, die in Brokern nicht angezeigt werden.",
      edcConnector: "EDC-Connector",
      edcId: "Connector-ID",
      curatorOrganizationName: "Name der kuratierenden Organisation",
      curatorUrl: "Kurator-URL",
      dapsTokenUrl: "DAPS-Token-URL",
      dapsJwksUrl: "DAPS-JWKS-URL",
      versionInformation: "VERSIONSINFORMATIONEN",
      connector: "MDS CONNECTOR",
      uiVersion: "MDS EDC UI VERSION",
      maintainerUrl: "Maintainer-URL",
      maintainerName: "Name der betreibenden Organisation",
      connectorEndpoint: "Connector-Endpunkt",
      managementApiUrl: "Management-API-URL",
      connectorProperties: "Connector-Eigenschaften",
      additionalProperties: "Zusätzliche Eigenschaften",
      edcAbout1:
        "Das Eclipse Dataspace Components Framework ermöglicht souveränen, interorganisationalen Datenaustausch.",
      edcAbout2:
        "Es implementiert den International Data Spaces (IDS) Standard sowie relevante, mit GAIA-X verbundene Protokolle.",
      edcAbout3:
        "Das Framework ist so erweiterbar wie möglich gestaltet, um Integrationen in verschiedene Datenökosysteme zu fördern.",
      aboutEdc: "Über EDC",
      edcComponents: "Eclipse Dataspace Components",
      aboutEdcUi: "Über EDC UI",
      getManagedEdc: "Managed EDC beziehen",
      caas: "Connector-as-a-Service",
      caasDescription1:
        "Um Datenräumen wie dem <strong>Mobility Data Space</strong> innerhalb von Minuten beizutreten, ziehen Sie die Managed-Lösung der Think-it GmbH in Betracht.",
      caasDescription2:
        "\\- Der <strong>Connector-as-a-Service (CaaS)</strong> basiert auf Open-Source-Software und wird um <strong>wichtige Enterprise-Funktionen</strong> ergänzt.",
      dataDashboard: "Eclipse Dataspace Components",
      aboutUi:
        "Beispielanwendungsfälle, die Sie mit dieser Anwendung ausprobieren können, sind:",
      aboutUiAssetsViewAndCreate: "Assets anzeigen und erstellen mit der ",
      aboutUiCatalogNegotiate:
        "Einen Vertrag für Datenaustausch in Ihrem Dataspace verhandeln mit der ",
      aboutUiCatalogViewOffers:
        "Den Ihnen in Ihrem Dataspace verfügbaren Asset-Katalog anzeigen mit der ",
      aboutUiContractDefinitionsViewAndCreate:
        "Ein Asset in Ihrem Dataspace veröffentlichen mit der ",
      aboutUiContractsTransfer:
        "Ein Asset in Ihrem Dataspace übertragen mit der ",
      aboutUiContractsViewExisting: "Ihre bestehenden Verträge anzeigen in der ",
      aboutUiPoliciesViewAndCreate:
        "Richtlinien anzeigen und erstellen und auf Assets anwenden in Ihrem Dataspace mit der ",
      aboutUiTransferHistoryView:
        "Ansehen, welche Assets in Ihrem Dataspace übertragen wurden, in der ",
      yourDataOffers: "Ihre Datenangebote",
      yourAssets: "Ihre Assets",
      yourPolicies: "Ihre Richtlinien",
      preconfiguredCatalogs: "Vorkonfigurierte Kataloge",
      contractAgreements: "Vertragsvereinbarungen",
      incomingData: "Eingehende Daten",
      outgoingData: "Ausgehende Daten",
      transferProcesses: "Übertragungsvorgänge",
      numberTransferProcesses: "Anzahl der Übertragungsvorgänge",
    },
    assets: {
      title: "Listen Sie alle Vermögenswerte auf",
      description:
        "Listen Sie alle Assets auf, die auf eigenen Connectors verfügbar sind. Assets sind die gemeinsame Einheit und können auf ein oder mehrere physische Elemente verweisen.",
      buttonAdd: "Neues Asset erstellen",
      headingName: "Name",
      headingTitle: "Titel",
      headingDescription: "Beschreibung",
      headingContentType: "Inhaltstyp",
      headingDataAddressName: "Name der Datenadresse",
      headingDataAddressType: "Datenadresstyp",
      headingDataAddressUrl: "URL der Datenadresse",
      searchPlaceholder: "Assets suchen",
      "[id]": {
        title: "Asset anzeigen",
        dataAddress: "Datenadresse",
        deleteButton: "Löschen",
      },
      new: {
        title: "Erstellen Sie ein neues Asset",
        description:
          "Beschreiben Sie ein neues Asset, also eine virtuelle Präsentation physischer Daten. Assets sind die gemeinsame Einheit des EDC-Connectors.",
        fieldId: "ID",
        fieldName: "Name",
        fieldContentType: "Inhaltstyp",
        fieldDescription: "Beschreibung",
        fieldPrivateNotes: "Private Notizen",
        fieldIdPlaceholder: "Eindeutige Kennung",
        fieldNamePlaceholder: "Von Menschen lesbarer Bezeichner",
        fieldDescriptionPlaceholder:
          "Beschreiben Sie den Inhalt und Zweck des Vermögenswerts",
        fieldPrivateNotesPlaceholder:
          "Einige Notizen, die nicht mit externen Teilnehmern geteilt werden",
        buttonCancel: "Stornieren",
        buttonSave: "Einreichen",
      },
      createSuccess: "Asset erfolgreich erstellt!",
      deleteSuccess: "Asset erfolgreich gelöscht!",
    },
    dataOffer: {
      new: {
        dataOfferCreateError: "Datenangebot konnte nicht erstellt werden. Bitte versuchen Sie es später erneut."
      }
    },
    contractDefinitions: {
      deleteSuccess: "Datenangebot erfolgreich gelöscht!",
    },
    "contract-definitions": {
      title: "Listen Sie alle Vertragsdefinitionen auf",
      description:
        "Listen Sie alle Ihre Verträge auf, die Sie dem externen Netzwerk angeboten haben. Vertragsdefinitionen legen fest, wie andere Teilnehmer eigene Vermögenswerte verbrauchen würden.",
      buttonAdd: "Vertragsdefinition hinzufügen",
      headingId: "ID",
      headingContractPolicy: "Vertragspolitik",
      headingAccessPolicy: "Zugangsrichtlinien",
      searchPlaceholder: "Vertragsdefinitionen suchen",
      "[id]": {
        title: "Vertragsdefinition anzeigen",
        deleteButton: "Löschen",
      },
      new: {
        title: "Erstellen Sie eine Vertragsdefinition",
        description:
          "Beschreiben Sie eine neue Richtlinie, indem Sie Regeln definieren, die sicherstellen, dass auf eigene Daten auf eine bestimmte Weise und unter Einhaltung strenger Anforderungen zugegriffen wird.",
        buttonCancel: "Stornieren",
        buttonSave: "Einreichen",
      },
    },
    "policy-definitions": {
      title: "Listen Sie alle Richtliniendefinitionen auf",
      description:
        "Listen Sie alle eigenen Richtlinien auf, die Regeln enthalten, die beschreiben, wie andere die von Ihnen angebotenen Daten nutzen können.",
      buttonAdd: "Richtliniendefinition erstellen",
      headingId: "ID",
      headingCreatedAt: "Hergestellt in",
      searchPlaceholder: "Richtlinien suchen",
      "[id]": {
        title: "Richtliniendefinition anzeigen",
        deleteButton: "Löschen",
      },
      new: {
        title: "Erstellen Sie eine Richtliniendefinition",
        description:
          "Beschreiben Sie eine neue Richtlinie, indem Sie Regeln definieren, die sicherstellen, dass auf eigene Daten auf eine bestimmte Weise und unter Einhaltung strenger Anforderungen zugegriffen wird.",
        buttonCancel: "Stornieren",
        buttonSave: "Einreichen",
      },
    },
    catalog: {
      title: "Alle Kataloge auflisten",
      description:
        "Listen Sie alle Teilnehmer auf, deren Kataloge Sie einsehen können.",
      headingName: "Name",
      searchPlaceholder: "Katalog nach Asset-Titel durchsuchen",
      headingStatus: "Status",
      "[participant]": {
        title: "Vertragsangebote für auflisten",
        description:
          "Listen Sie die Teilnehmer für den ausgewählten Teilnehmer auf.",
        headingId: "ID",
        headingAssets: "Vermögenswerte",
        headingContracts: "Verträge",
      },
    },
    "contract-agreements": {
      title: "Listen Sie alle Vertragsvereinbarungen auf",
      description:
        "Liste der Vertragsvereinbarungen, die eigene Connectors nutzen können. Die aufgeführten Vereinbarungen sind das erfolgreiche Ergebnis von Vertragsverhandlungen zwischen zwei EDC-Anschlüssen.",
      headingId: "ID",
      headingConsumer: "Verbraucher",
      headingProvider: "Anbieter",
      headingAsset: "Vermögenswert",
      headingContractSigningDate: "Datum der Vertragsunterzeichnung",
      searchPlaceholder: "Vertragsvereinbarungen suchen",
      terminationSuccess: "Vertrag erfolgreich beendet",
      noContractsFound: "Keine Vertragsvereinbarungen gefunden",
      "[id]": {
        title: "Vertragsvereinbarung ansehen",
        description: "Eine einzige Vertragsvereinbarung",
      },
    },
    "contract-negotiations": {
      title: "Listen Sie alle Vertragsverhandlungen auf",
      manualApprovalTitle: "Negotiations with manual approval",
      description:
        "Liste der Vertragsvereinbarungen, die eigene Connectors nutzen können. Die aufgeführten Vereinbarungen sind das erfolgreiche Ergebnis von Vertragsverhandlungen zwischen zwei EDC-Anschlüssen.",
      headingId: "ID",
      headingState: "State",
      headingContractAgreement: "Vertragsvereinbarung",
      headingCounterPartyAddress: "Adresse der Gegenpartei",
      headingCreatedAt: "Hergestellt in",
      searchPlaceholder: "Vertragsverhandlungen suchen",
      "[id]": {
        title: "Vertragsverhandlung ansehen",
        description: "Eine einzige Vertragsverhandlung",
        fieldId: "ID",
        fieldContractAgreementId: "Vertragsvereinbarung",
        fieldCounterPartyAddress: "Adresse der Gegenpartei",
        fieldErrorDetail: "Fehlerdetails",
      },
    },
    "transfer-processes": {
      title: "Listen Sie alle Übertragungsvorgänge auf",
      description:
        "Listen Sie alle ausgehenden und eingehenden Übertragungsvorgänge auf.",
      headingId: "ID",
      headingState: "State",
      headingContractAgreement: "Vertragsvereinbarung",
      headingAsset: "Vermögenswert",
      headingCorrelationId: "Korrelations-ID",
      searchPlaceholder: "Übertragungsvorgänge suchen",
      "[id]": {
        title: "Übertragungsvorgang ansehen",
        description: "Ein einziger Übertragungsvorgang",
        fieldId: "ID",
        fieldState: "State",
        fieldContractAgreement: "Vertragsvereinbarung",
        fieldAsset: "Vermögenswert",
        fieldCorrelationId: "Korrelations-ID",
        fieldErrorDetail: "Fehlerdetails",
      },
    },
    dashboard: {
      noConsumingTransferProcesses: "Keine verbrauchenden Übertragungsvorgänge",
      noProvidingTransferProcesses: "Keine bereitstellenden Übertragungsvorgänge"
    },
    common: {
      listLoadError: "Fehler beim Laden der Liste. Bitte versuchen Sie es erneut.",
      catalogLoadError: "Fehler beim Laden des Katalogs. Bitte versuchen Sie es erneut.",
      assetsLoadError: "Fehler beim Laden der Assets. Bitte versuchen Sie es erneut.",
      dataOffersLoadError: "Fehler beim Laden der Datenangebote. Bitte versuchen Sie es erneut.",
      contractAgreementsLoadError: "Fehler beim Laden der Vertragsvereinbarungen. Bitte versuchen Sie es erneut.",
      contractNegotiationsLoadError: "Fehler beim Laden der Vertragsverhandlungen. Bitte versuchen Sie es erneut.",
      transferProcessesLoadError: "Fehler beim Laden der Übertragungsvorgänge. Bitte versuchen Sie es erneut.",
      policyDefinitionsLoadError: "Fehler beim Laden der Richtliniendefinitionen. Bitte versuchen Sie es erneut.",
    },
  },
};
