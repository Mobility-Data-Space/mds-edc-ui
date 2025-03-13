export const en = {
  translation: {
    _app: {
      logIn: "Log in",
      useCases: "Use cases",
      search: "Search",
      searchPlaceholder: "Enter your search query",
      buttonSearch: "Search",
      useCasesList: {
        quality: "Quality",
        "circular-economy": "Circular economy",
      },
      environments: {
        development: "Development",
        integration: "Integration",
        production: "Production",
      },
    },
    assets: {
      title: "List all assets",
      description:
        "List all of the assets available on owned connectors. Assets are the sharing unit and can point to one or more physical elements.",
      buttonAdd: "Add asset",
      headingName: "Name",
      headingTitle: "Title",
      headingDescription: "Description",
      headingVersion: "Version",
      headingContentType: "Content type",
      headingDataAddressName: "Data address name",
      headingDataAddressType: "Data address type",
      headingDataAddressUrl: "Data address url",
      "[id]": {
        title: "View asset",
        dataAddress: "Data address",
        deleteButton: "Delete",
      },
      new: {
        title: "Create a new asset",
        description:
          "Describe a new asset, hence a virtual presentation of physical data. Assets are the sharing unit of the EDC connector.",
        fieldId: "ID",
        fieldTitle: "Title",
        fieldContentType: "Content type",
        fieldDescription: "Description",
        fieldPrivateNotes: "Private notes",
        fieldIdPlaceholder: "Unique identifier",
        fieldVersionPlaceholder: "Asset version",
        fieldTitlePlaceholder: "Human readable identifier",
        fieldDescriptionPlaceholder:
          "Describe the content and purpose of the asset",
        fieldPrivateNotesPlaceholder:
          "Some notes which won't be shared with external participants",
        fieldDataAddressType: "Data address type",
        fieldDataAddressMethodAndContentType: "Method & content type",
        fieldDataAddressUrl: "URL",
        fieldDataAddressBaseUrlPlaceholder:
          "The base URL for the data address location",
        fieldDataAddressName: "Name",
        fieldDataAddressNamePlaceholder:
          "Data address human readable identifier",
        fieldDataAddressPathPlaceholder: "The default URL path",
        fieldDataAddressAuth: "Authorization",
        fieldDataAddressAuthKeyPlaceholder: "Authorization header",
        fieldDataAddressAuthCodePlaceholder: "Secret code",
        buttonCancel: "Cancel",
        buttonSave: "Add asset",
      },
    },
    "contract-definitions": {
      title: "List all contract definitions",
      description:
        "List all of your contracts offered to the external network. Contract definitions define how other participants would consume owned assets.",
      buttonAdd: "Add contract definition",
      headingId: "ID",
      headingContractPolicy: "Contract policy",
      headingAccessPolicy: "Access policy",
      "[id]": {
        title: "View contract definition",
        deleteButton: "Delete",
      },
      new: {
        title: "Create a contract definition",
        description:
          "Describe a new policy by defining rules which ensure owned data is accessed in a specific way, following strict requirements.",
        buttonCancel: "Cancel",
        buttonSave: "Save changes",
      },
    },
    "policy-definitions": {
      title: "List all policy definition",
      description:
        "List all owned policies containing rules that describe how others can consume the data you offer.",
      buttonAdd: "Add policy definition",
      headingId: "ID",
      headingCreatedAt: "Created at",
      "[id]": {
        title: "View policy definition",
        deleteButton: "Delete",
      },
      new: {
        title: "Create a policy definition",
        description:
          "Describe a new policy by defining rules which ensure owned data is accessed in a specific way, following strict requirements.",
        buttonCancel: "Cancel",
        buttonSave: "Save changes",
      },
    },
    catalog: {
      title: "List all catalogs",
      description:
        "List all participants which you can check their catalogs.",
      headingName: "Name",
      headingStatus: "Status",
      "[participant]": {
        title: "List contract offers for ",
        description: "List participants for the selected participant.",
        headingId: "ID",
        headingAssets: "Assets",
        headingContracts: "Contracts",
      },
    },
    "contract-agreements": {
      title: "List all contract agreements",
      description:
        "List of contract agreements that owned connectors can consume. Listed agreements are the successful outcome of contract negotiations between two EDC connectors.",
      headingId: "ID",
      headingConsumer: "Consumer",
      headingProvider: "Provider",
      headingAsset: "Asset",
      headingContractSigningDate: "Contract signing date",
      "[id]": {
        title: "View contract agreement",
        description: "A single contract agreement",
      },
    },
    "contract-negotiations": {
      title: "List all contract negotiations",
      description:
        "List of contract agreements that owned connectors can consume. Listed agreements are the successful outcome of contract negotiations between two EDC connectors.",
      headingId: "ID",
      headingState: "State",
      headingContractAgreement: "Contract agreement",
      headingCounterPartyAddress: "Counter party address",
      headingCreatedAt: "Created at",
      "[id]": {
        title: "View contract negotiation",
        description: "A single contract negotiation",
        fieldId: "ID",
        fieldContractAgreementId: "Contract agreement",
        fieldCounterPartyAddress: "Counter party address",
        fieldErrorDetail: "Error detail",
      },
    },
    "transfer-processes": {
      title: "List all transfer processes",
      description: "List all outgoing and incoming transfer processes.",
      headingId: "ID",
      headingState: "State",
      headingContractAgreement: "Contract agreement",
      headingAsset: "Asset",
      headingCorrelationId: "Correlation ID",
      "[id]": {
        title: "View transfer process",
        description: "A single transfer process",
        fieldId: "ID",
        fieldState: "State",
        fieldContractAgreement: "Contract agreement",
        fieldAsset: "Asset",
        fieldCorrelationId: "Correlation ID",
        fieldErrorDetail: "Error detail",
      },
    },
  },
};
