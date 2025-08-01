interface ContractAgreementInfo {
  [key: string]: {
    isTerminated: boolean,
    isTerminatedAt: number,
    retirementReason: string,
    isRunning: boolean,
    transfersCount: number,
  }
}

