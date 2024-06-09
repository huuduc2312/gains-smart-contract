const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");
const {
  afterDeployTradingContract,
  setTradingStorageParam,
  addTradingContract,
} = require("../utils/trading");

const constructorContracts = [
  "GFarmTradingStorageV5",
  "GNSOracleRewardsV6_4_1",
  "GNSPairInfosV6_1",
  "GNSReferralsV6_2",
  "GNSStakingV6_4_1",
  "GNSBorrowingFeesV6_4",
  "GTokenV6_3_2",
];

const func = createDeployFunction({
  contractName: "GNSTradingCallbacksV6_4_1",
  dependencyNames: [
    ...constructorContracts,
    "GTokenLockedDepositNft",
    "GTokenOpenPnlFeed",
  ],
  getProxyConfig: ({ dependencyContracts }) => ({
    execute: {
      init: {
        methodName: "initialize",
        args: [
          ...constructorContracts.map(
            (dependencyName) => dependencyContracts[dependencyName].address
          ),
          50, // _daiVaultFeeP
          0, // _lpFeeP
          50, // _sssFeeP
          2, // _canExecuteTimeout
        ],
      },
    },
    proxyContract: "OpenZeppelinTransparentProxy",
  }),
  afterDeploy: async ({
    deployments,
    signer,
    deployedContract,
    getNamedAccounts,
  }) => {
    const { deployer } = await getNamedAccounts();
    return addTradingContract(
      deployments,
      deployer,
      "GNSTradingCallbacksV6_4_1",
      { param: "callbacks", method: "setCallbacks" }
    );
  },
});

module.exports = func;
