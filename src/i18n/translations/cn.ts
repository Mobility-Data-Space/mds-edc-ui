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
    },
    "contract-definitions": {
      title: "列出所有合约定义",
      description:
        "列出您提供给外部网络的所有合约。 合约定义定义了其他参与者如何消费拥有的资产。",
      buttonAdd: "添加合约定义",
      headingId: "ID",
      headingContractPolicy: "合约政策",
      headingAccessPolicy: "准入政策",
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
      "[id]": {
        title: "查看合同协议",
        description: "单一合同协议",
      },
    },
    "contract-negotiations": {
      title: "列出所有合同谈判",
      description:
        "拥有的连接器可以使用的合同协议列表。 列出的协议是两个 EDC 连接器之间合同谈判的成功结果。",
      headingId: "ID",
      headingState: "状态",
      headingContractAgreement: "合同协议",
      headingCounterPartyAddress: "交易对手地址",
      headingCreatedAt: "创建于",
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
  },
};
