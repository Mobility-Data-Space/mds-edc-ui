export const cn = {
  translation: {
    _app: {
      logIn: "登录",
      useCases: "用例",
      search: "搜索",
      searchPlaceholder: "输入您的搜索查询",
      buttonSearch: "搜索",
      useCasesList: {
        quality: "质量",
        "circular-economy": "循环经济",
      },
      environments: {
        development: "发展",
        integration: "整合",
        production: "生产",
      },
    },
    dashboard: {
      title: "仪表盘",
      edcDescription:
        "共享以下连接器端点，以便他人访问您的 EDC 连接器目录。对于在代理中不会显示的受连接器限制的数据产品，这尤其有用。",
      edcConnector: "EDC 连接器",
      edcId: "连接器 ID",
      curatorOrganizationName: "策展机构名称",
      curatorUrl: "策展机构 URL",
      dapsTokenUrl: "DAPS 令牌 URL",
      dapsJwksUrl: "DAPS JWKS URL",
      versionInformation: "版本信息",
      connector: "MDS CONNECTOR",
      uiVersion: "MDS EDC UI 版本",
      maintainerUrl: "维护方 URL",
      maintainerName: "维护组织名称",
      connectorEndpoint: "连接器端点",
      managementApiUrl: "管理 API URL",
      connectorProperties: "连接器属性",
      additionalProperties: "附加属性",
      edcAbout1:
        "Eclipse Dataspace Components 框架促进主权的、跨组织的数据交换。",
      edcAbout2:
        "它实现了 International Data Spaces (IDS) 标准以及与 GAIA-X 相关的协议。",
      edcAbout3:
        "该框架尽可能设计为可扩展，以鼓励与各种数据生态系统集成。",
      aboutEdc: "关于 EDC",
      edcComponents: "Eclipse Dataspace Components",
      aboutEdcUi: "关于 EDC UI",
      getManagedEdc: "获取托管版 EDC",
      caas: "Connector-as-a-Service",
      caasDescription1:
        "要在几分钟内加入如 <strong>Mobility Data Space</strong> 等数据空间，可考虑由 Think-it GmbH 提供的托管解决方案。",
      caasDescription2:
        "\\- 基于开源软件的 <strong>Connector-as-a-Service (CaaS)</strong>，并补充了<strong>关键企业功能</strong>。",
      dataDashboard: "Eclipse Dataspace Components",
      aboutUi:
        "您可以使用此应用尝试的示例用例如下：",
      aboutUiAssetsViewAndCreate: "查看并创建资产，使用 ",
      aboutUiCatalogNegotiate:
        "在您的数据空间中就数据共享协商合同，使用 ",
      aboutUiCatalogViewOffers:
        "在您的数据空间中查看可用的资产目录，使用 ",
      aboutUiContractDefinitionsViewAndCreate:
        "在您的数据空间中发布资产，使用 ",
      aboutUiContractsTransfer:
        "在您的数据空间中传输资产，使用 ",
      aboutUiContractsViewExisting: "在 中查看您现有的合同",
      aboutUiPoliciesViewAndCreate:
        "在您的数据空间中查看并创建策略，并将其应用于资产，使用 ",
      aboutUiTransferHistoryView:
        "在您的数据空间中查看已传输的资产，使用 ",
      yourDataOffers: "您的数据产品",
      yourAssets: "您的资产",
      yourPolicies: "您的策略",
      preconfiguredCatalogs: "预配置目录",
      contractAgreements: "合同协议",
      incomingData: "传入数据",
      outgoingData: "传出数据",
      transferProcesses: "传输进程",
      numberTransferProcesses: "传输进程数量",
    },
    assets: {
      title: "列出所有资产",
      description:
        "列出自有连接器上可用的所有资产。 资产是共享单元，可以指向一个或多个物理元素。",
      buttonAdd: "创建新资产",
      headingName: "姓名",
      headingTitle: "标题",
      headingDescription: "描述",
      headingContentType: "内容类型",
      headingDataAddressName: "数据地址名称",
      headingDataAddressType: "数据地址类型",
      headingDataAddressUrl: "数据地址 URL",
      searchPlaceholder: "搜索资产",
      "[id]": {
        title: "查看资产",
        dataAddress: "数据地址",
        deleteButton: "删除",
      },
      new: {
        title: "创建新资产",
        description:
          "描述一种新资产，从而描述物理数据的虚拟呈现。 资产是EDC连接器的共享单元。",
        fieldId: "ID",
        fieldName: "姓名",
        fieldContentType: "内容类型",
        fieldDescription: "描述",
        fieldPrivateNotes: "私人笔记",
        fieldIdPlaceholder: "唯一标识符",
        fieldNamePlaceholder: "人类可读标识符",
        fieldDescriptionPlaceholder: "描述资产的内容和用途",
        fieldPrivateNotesPlaceholder: "一些不会与外部参与者共享的笔记",
        buttonCancel: "取消",
        buttonSave: "保存更改",
      },
      createSuccess: "资产创建成功！",
      deleteSuccess: "资产删除成功！",
    },
    dataOffer: {
      new: {
        dataOfferCreateError: "创建数据产品失败，请稍后再试。"
      }
    },
    contractDefinitions: {
      deleteSuccess: "数据产品删除成功！",
    },
    "contract-definitions": {
      title: "列出所有合约定义",
      description:
        "列出您提供给外部网络的所有合约。 合约定义定义了其他参与者如何消费拥有的资产。",
      buttonAdd: "添加合约定义",
      headingId: "ID",
      headingContractPolicy: "合约政策",
      headingAccessPolicy: "准入政策",
      searchPlaceholder: "搜索合约定义",
      "[id]": {
        title: "查看合约定义",
        deleteButton: "删除",
      },
      new: {
        title: "创建合同定义",
        description:
          "通过定义规则来描述新策略，确保按照严格的要求以特定方式访问拥有的数据。",
        buttonCancel: "取消",
        buttonSave: "保存更改",
      },
    },
    "policy-definitions": {
      title: "列出所有策略定义",
      description:
        "列出所有拥有的策略，其中包含描述其他人如何使用您提供的数据的规则。",
      buttonAdd: "添加策略定义",
      headingId: "ID",
      headingCreatedAt: "创建于",
      searchPlaceholder: "搜索策略",
      "[id]": {
        title: "查看策略定义",
        deleteButton: "删除",
      },
      new: {
        title: "创建策略定义",
        description:
          "通过定义规则来描述新策略，确保按照严格的要求以特定方式访问拥有的数据。",
        buttonCancel: "取消",
        buttonSave: "保存更改",
      },
    },
    catalog: {
      title: "列出所有目录",
      description: "列出所有参与者，您可以检查他们的目录。",
      headingName: "姓名",
      searchPlaceholder: "按资产标题搜索目录",
      headingStatus: "地位",
      "[participant]": {
        title: "列出合同报价",
        description: "列出所选参与者的参与者。",
        headingId: "ID",
        headingAssets: "资产",
        headingContracts: "合约",
      },
    },
    "contract-agreements": {
      title: "列出所有合同协议",
      description:
        "拥有的连接器可以使用的合同协议列表。 列出的协议是两个 EDC 连接器之间合同谈判的成功结果。",
      headingId: "ID",
      headingConsumer: "消费者",
      headingProvider: "提供者",
      headingAsset: "资产",
      headingContractSigningDate: "合同签订日期",
      searchPlaceholder: "搜索合同协议",
      terminationSuccess: "合同终止成功",
      noContractsFound: "未找到合同协议",
      "[id]": {
        title: "查看合同协议",
        description: "单一合同协议",
      },
    },
    "contract-negotiations": {
      title: "列出所有合同谈判",
      manualApprovalTitle: "Negotiations with manual approval",
      description:
        "拥有的连接器可以使用的合同协议列表。 列出的协议是两个 EDC 连接器之间合同谈判的成功结果。",
      headingId: "ID",
      headingState: "状态",
      headingContractAgreement: "合同协议",
      headingCounterPartyAddress: "交易对手地址",
      headingCreatedAt: "创建于",
      searchPlaceholder: "搜索合同谈判",
      "[id]": {
        title: "查看合同谈判",
        description: "单一合同谈判",
        fieldId: "ID",
        fieldContractAgreementId: "合同协议",
        fieldCounterPartyAddress: "交易对手地址",
        fieldErrorDetail: "错误详情",
      },
    },
    "transfer-processes": {
      title: "列出所有传输进程",
      description: "列出所有传出和传入传输进程。",
      headingId: "ID",
      headingState: "状态",
      headingContractAgreement: "合同协议",
      headingAsset: "资产",
      headingCorrelationId: "相关 ID",
      searchPlaceholder: "搜索传输进程",
      "[id]": {
        title: "查看转账流程",
        description: "单一传输过程",
        fieldId: "ID",
        fieldState: "State",
        fieldContractAgreement: "合同协议",
        fieldAsset: "资产",
        fieldCorrelationId: "相关 ID",
        fieldErrorDetail: "错误详情",
      },
    },
    dashboard: {
      noConsumingTransferProcesses: "没有消费传输进程",
      noProvidingTransferProcesses: "没有提供传输进程"
    },
    common: {
      listLoadError: "加载列表失败。请再试一次。",
      catalogLoadError: "加载目录失败。请再试一次。",
      assetsLoadError: "加载资产失败。请再试一次。",
      dataOffersLoadError: "加载数据产品失败。请再试一次。",
      contractAgreementsLoadError: "加载合同协议失败。请再试一次。",
      contractNegotiationsLoadError: "加载合同谈判失败。请再试一次。",
      transferProcessesLoadError: "加载传输进程失败。请再试一次。",
      policyDefinitionsLoadError: "加载策略定义失败。请再试一次。",
    },
  },
};
