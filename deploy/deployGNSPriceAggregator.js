const { network } = require("hardhat");
const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");
const config = require("../config.json");

const constructorContracts = ["GFarmTradingStorageV5", "GNSPairsStorageV6"];

const func = createDeployFunction({
  contractName: "GNSPriceAggregatorV6_4",
  libraryNames: ["PackingUtils"],
  dependencyNames: constructorContracts,
  getDeployArgs: ({ dependencyContracts, network }) => {
    const networkName = network.name;
    const networkConfig = config[networkName];

    if (!networkConfig) {
      throw new Error(`Network configuration not found for: ${networkName}`);
    }

    const { linkToken, chainlinkOperator, priceFeed, priceAggregatorJob } =
      networkConfig;

    return [
      linkToken, // _linkToken
      // uniswapV3Pool
      // 100, // _twapInterval
      dependencyContracts["GFarmTradingStorageV5"].address,
      dependencyContracts["GNSPairsStorageV6"].address,
      priceFeed, // _linkPriceFeed
      1, // _minAnswers
      [chainlinkOperator], // _nodes
      [priceAggregatorJob, priceAggregatorJob], // _jobIds
    ];
  },
  afterDeploy: async ({
    deployedContract,
    signer,
    deployments,
    getNamedAccounts,
    network,
  }) => {
    const { get, execute, read } = deployments;

    const { deployer } = await getNamedAccounts();
    const priceAggregator = await read(
      "GFarmTradingStorageV5",
      "priceAggregator"
    );
    if (priceAggregator == deployedContract.address) {
      console.info("GFarmTradingStorageV5.priceAggregator is already set.");
      return;
    }
    console.info("Executing setPriceAggregator...");

    await execute(
      "GFarmTradingStorageV5",
      { from: deployer },
      "setPriceAggregator",
      deployedContract.address
    );

    console.info("Done setPriceAggregator");
  },
});

module.exports = func;
