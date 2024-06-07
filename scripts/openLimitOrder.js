const { deployments, getNamedAccounts } = require('hardhat');
const fetch = require('node-fetch');

async function main() {
  const { deployer } = await getNamedAccounts();
  const [singer] = await ethers.getSigners();
  const { execute, get } = deployments;
  const tradingStorageAddr = (await get('GFarmTradingStorageV5')).address;
  console.log('trading storage', tradingStorageAddr);

  const dai = await hre.ethers.getContractAt(
    'ERC20',
    '0x04B2A6E51272c82932ecaB31A5Ab5aC32AE168C3',
    singer
  );
  const maxAllowance = 1000000000000000000000000n;
  const allowance = await dai.allowance(deployer, tradingStorageAddr);

  if (allowance == 0) {
    const tx = await dai.approve(tradingStorageAddr, maxAllowance);
    await tx.wait();
  }

  // const currentPriceResp = await fetch('http://localhost:8080/single-price');
  // const currentPrice = BigInt((await currentPriceResp.json()).result);
  // console.log('currentPrice:', currentPrice);

  console.info('Open limit order...');

  // limit
  const tx = await execute(
    'GNSTradingV6_4_1',
    { from: deployer },
    'openTrade',
    {
      trader: deployer,
      pairIndex: 0,
      index: 0,
      initialPosToken: 0,
      positionSizeDai: '10000000000000000000',
      openPrice: '690000000000000',
      buy: true,
      leverage: 150,
      tp: 692300000000000,
      sl: 0,
    },
    1, // orderType
    10000000000, // slippageP
    '0x0000000000000000000000000000000000000000' // referrer
  );

  console.info(`Completed. txhash: ${tx.transactionHash}`);

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
