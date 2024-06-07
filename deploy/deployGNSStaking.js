const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");
const config = require("../config.json");

const func = createDeployFunction({
  contractName: "GNSStakingV6_4_1",
  getProxyConfig: ({ network }) => {
    const networkName = network.name;
    const networkConfig = config[networkName];

    if (!networkConfig) {
      throw new Error(`Network configuration not found for: ${networkName}`);
    }

    const { dai, gns } = networkConfig;

    return {
      execute: {
        init: {
          methodName: "initialize",
          args: [
            "0xd7D1dCba2c678ee7e049BD55176354E7C5bBdcCA", // _govFund
            gns, // _token
            dai, // _dai
          ],
        },
      },
      proxyContract: "OpenZeppelinTransparentProxy",
    };
  },
  afterDeploy: async ({
    deployedContract,
    getNamedAccounts,
    deployments,
    network,
  }) => {
    await timeout(1500);
  },
});

module.exports = func;
