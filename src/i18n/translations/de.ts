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
    assets: {
      title: "Listen Sie alle Vermögenswerte auf",
      description:
        "Listen Sie alle Assets auf, die auf eigenen Connectors verfügbar sind. Assets sind die gemeinsame Einheit und können auf ein oder mehrere physische Elemente verweisen.",
      buttonAdd: "Asset erstellen",
      headingName: "Name",
      headingTitle: "Titel",
      headingDescription: "Beschreibung",
      headingContentType: "Inhaltstyp",
      headingDataAddressName: "Name der Datenadresse",
      headingDataAddressType: "Datenadresstyp",
      headingDataAddressUrl: "URL der Datenadresse",
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
    },
    "contract-definitions": {
      title: "Listen Sie alle Vertragsdefinitionen auf",
      description:
        "Listen Sie alle Ihre Verträge auf, die Sie dem externen Netzwerk angeboten haben. Vertragsdefinitionen legen fest, wie andere Teilnehmer eigene Vermögenswerte verbrauchen würden.",
      buttonAdd: "Vertragsdefinition hinzufügen",
      headingId: "ID",
      headingContractPolicy: "Vertragspolitik",
      headingAccessPolicy: "Zugangsrichtlinien",
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
      "[id]": {
        title: "Vertragsvereinbarung ansehen",
        description: "Eine einzige Vertragsvereinbarung",
      },
    },
    "contract-negotiations": {
      title: "Listen Sie alle Vertragsverhandlungen auf",
      description:
        "Liste der Vertragsvereinbarungen, die eigene Connectors nutzen können. Die aufgeführten Vereinbarungen sind das erfolgreiche Ergebnis von Vertragsverhandlungen zwischen zwei EDC-Anschlüssen.",
      headingId: "ID",
      headingState: "State",
      headingContractAgreement: "Vertragsvereinbarung",
      headingCounterPartyAddress: "Adresse der Gegenpartei",
      headingCreatedAt: "Hergestellt in",
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
  },
};
