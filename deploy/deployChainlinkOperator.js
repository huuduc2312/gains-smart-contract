const { createDeployFunction } = require("../utils/deploy");
const config = require("../config.json");

const func = createDeployFunction({
  contractName: "Operator",
  getDeployArgs: async ({ network, getNamedAccounts }) => {
    const networkName = network.name;
    const networkConfig = config[networkName];

    if (!networkConfig) {
      throw new Error(`Network configuration not found for: ${networkName}`);
    }

    const { linkToken } = networkConfig;
    const { deployer } = await getNamedAccounts();

    return [linkToken, deployer];
  },
  afterDeploy: async ({ deployments, network, getNamedAccounts }) => {
    const { execute, read } = deployments;
    const networkName = network.name;
    const networkConfig = config[networkName];

    if (!networkConfig) {
      throw new Error(`Network configuration not found for: ${networkName}`);
    }

    const { chainlinkNode } = networkConfig;

    if ((await read("Operator", "isAuthorizedSender", chainlinkNode)) == true) {
      return;
    }

    const { deployer } = await getNamedAccounts();

    await execute("Operator", { from: deployer }, "setAuthorizedSenders", [
      chainlinkNode,
    ]);
  },
});

module.exports = func;
