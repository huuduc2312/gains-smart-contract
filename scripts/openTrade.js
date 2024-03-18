const hre = require('hardhat');
const deployment = require('../deployments/mumbai/GNSTradingV6_4_1.json');
const tradingStorageAddr =
  require('../deployments/mumbai/GFarmTradingStorageV5.json').address;
const rewardsAddr =
  require('../deployments/mumbai/GNSOracleRewardsV6_4_1.json').address;

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt(
    'GNSTradingV6_4_1',
    deployment.address,
    // '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    owner
  );

  const dai = await hre.ethers.getContractAt(
    'ERC20',
    '0x04B2A6E51272c82932ecaB31A5Ab5aC32AE168C3',
    owner
  );
  const approve = await dai.approve(
    tradingStorageAddr,
    '1000000000000000000000000'
  );
  await hre.ethers.provider.waitForTransaction(approve.hash);

  // market
  console.info('submitting openTrade tx...');
  const tx = await contract.openTrade(
    [
      owner.address,
      0,
      0,
      0,
      '50000000000000000000',
      '679432000000000',
      true,
      31,
      '876686451612903',
      0,
    ],
    0,
    10400000000,
    '0x0000000000000000000000000000000000000000'
  );

  // limit
  // console.info('submitting openTrade tx...');
  // const tx = await contract.openTrade(
  //   [
  //     owner.address,
  //     0,
  //     0,
  //     0,
  //     '100000000000000000000',
  //     650000000000000,
  //     true,
  //     29,
  //     851724137931034,
  //     0,
  //   ],
  //   1,
  //   10000000000,
  //   '0x0000000000000000000000000000000000000000'
  // );

  await hre.ethers.provider.waitForTransaction(tx.hash);
  console.info(`tx completed. txhash: ${tx.hash}`);

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
