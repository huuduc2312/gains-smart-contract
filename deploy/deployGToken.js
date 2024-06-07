const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");
const { getContractAddress } = require("@ethersproject/address");
const config = require("../config.json");

const func = createDeployFunction({
  contractName: "GTokenV6_3_2",
  dependencyNames: ["GNSPriceAggregatorV6_4"],
  getProxyConfig: async ({ dependencyContracts, network }) => {
    const [owner] = await ethers.getSigners();
    let transactionCount = await owner.getTransactionCount();

    transactionCount += 3; // skip implementation + proxy deployment + setVault tx
    transactionCount++; // skip nft design
    const nft = getContractAddress({
      from: owner.address,
      nonce: transactionCount,
    });
    console.log("GToken.lockedDepositNft address prediction:", nft);

    transactionCount++;
    const pnlFeed = getContractAddress({
      from: owner.address,
      nonce: transactionCount,
    });
    console.log("GToken.openTradesPnlFeed address prediction:", pnlFeed);

    transactionCount += 2; // skip implementation deployment
    const callbacks = getContractAddress({
      from: owner.address,
      nonce: transactionCount,
    });
    console.log("GToken.pnlHandler address prediction:", callbacks);

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
            "zPerp DAI",
            "ZDAI",
            [
              dai, // dai
              "0xd7D1dCba2c678ee7e049BD55176354E7C5bBdcCA", // owner
              "0x126961F4BB5ebea2aD5EE202d09489c4518eA1F0", // manager
              "0xf8f4E87d7a8E3aeddaf88dc952b54F484CCe6740", // admin
              gns, // gns
              nft,
              callbacks,
              pnlFeed,
              [
                dependencyContracts["GNSPriceAggregatorV6_4"].address,
                "0x3c88e882",
              ],
            ],
            1209600, // _MIN_LOCK_DURATION
            "1134419645953891016", // _maxAccOpenPnlDelta
            "500000000000000000", // _maxDailyAccPnlDelta
            ["10000000000000000000", "20000000000000000000"], // _withdrawLockThresholdsP
            "2000000000000000000", // _maxSupplyIncreaseDailyP
            0, // _lossesBurnP
            "50000000000000000", // _maxGnsSupplyMintDailyP
            "5000000000000000000", // _maxDiscountP
            "150000000000000000000", // _maxDiscountThresholdP
          ],
        },
      },
      proxyContract: "OpenZeppelinTransparentProxy",
    };
  },
  afterDeploy: async ({
    deployedContract,
    signer,
    deployments,
    getNamedAccounts,
  }) => {
    const { read, execute } = deployments;

    const vault = await read("GFarmTradingStorageV5", "vault");
    if (vault == deployedContract.address) {
      return;
    }
    const { deployer } = await getNamedAccounts();
    console.info("Executing setVault...");
    await execute(
      "GFarmTradingStorageV5",
      { from: deployer },
      "setVault",
      deployedContract.address
    );
    // await hre.ethers.provider.waitForTransaction(tx.hash);
    console.info("Done setVault");
  },
});

module.exports = func;
