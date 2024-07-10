const { deployments, getNamedAccounts } = require("hardhat");
const config = require("../config.json");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  // const dai = await hre.ethers.getContractAt(
  //   "ERC20",
  //   "0x04B2A6E51272c82932ecaB31A5Ab5aC32AE168C3",
  //   deployer
  // );
  // const approve = await dai.approve(
  //   tradingStorageAddr,
  //   "1000000000000000000000000"
  // );
  // await hre.ethers.provider.waitForTransaction(approve.hash);

  // const currentPriceResp = await fetch('http://localhost:8080/single-price');
  // const currentPrice = BigInt((await currentPriceResp.json()).result);
  // console.log('currentPrice:', currentPrice);

  console.info("submitting openTrade tx...");

  // limit
  // const tx = await execute(
  //   'GNSTradingV6_4_1',
  //   { from: deployer },
  //   'openTrade',
  //   [
  //     deployer,
  //     0,
  //     0,
  //     0,
  //     '50000000000000000000',
  //     '660000000000000',
  //     true,
  //     36,
  //     '840375000000000',
  //     0,
  //   ],
  //   1,
  //   10000000000,
  //   '0x0000000000000000000000000000000000000000'
  // );

  // market
  const tx = await execute(
    "GNSTradingV6_4_1",
    { from: deployer },
    "openTrade",
    [
      deployer,
      0,
      0,
      // 0,
      "50000000000000000000",
      "660000000000000",
      true,
      29,
      "876686451612903",
      0,
    ],
    0,
    10400000000,
    "0x0000000000000000000000000000000000000000"
  );

  console.info(`tx completed. txhash: ${tx.transactionHash}`);

  // ["0xd7D1dCba2c678ee7e049BD55176354E7C5bBdcCA",0,0,0,"99900000000000000000","654064000000000",true,22,"921635636363636",0]
  // 0
  // 10400000000
  // 0x0000000000000000000000000000000000000000

  // [0,0,1,13156490000000000]
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
