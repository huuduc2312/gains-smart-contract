const { deployments, getNamedAccounts, network } = require("hardhat");
const config = require("../config.json");

async function addPair() {
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  console.info("Executing addGroup...");
  await execute("GNSPairsStorageV6", { from: deployer }, "addGroup", [
    "crypto",
    "0x3235656562353536636165343464366561303166623233363466616363613131",
    2,
    150,
    15,
  ]);
  console.info("Done addGroup");

  console.info("Executing addFee...");
  await execute("GNSPairsStorageV6", { from: deployer }, "addFee", [
    "crypto",
    300000000, // openFeeP
    600000000, // closeFeeP
    60000000, // oracleFeeP
    200000000, // nftLimitOrderFeeP
    1, // referralFeeP
    "1500000000000000000000", // minLevPosDai
  ]);
  console.info("Done addFee");

  const networkName = network.name;
  const networkConfig = config[networkName];

  if (!networkConfig) {
    throw new Error(`Network configuration not found for: ${networkName}`);
  }

  const { priceFeed } = networkConfig;

  console.info("Executing addPair...");
  await execute("GNSPairsStorageV6", { from: deployer }, "addPair", [
    "BTC",
    "USD",
    [priceFeed, "0x0000000000000000000000000000000000000000", 0, 200000000000],
    400000000,
    0,
    0,
  ]);
  console.info("Done addPair");
}

module.exports = addPair;
