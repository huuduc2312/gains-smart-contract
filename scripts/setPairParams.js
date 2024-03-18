const addr = require('../deployments/mumbai/GNSPairInfosV6_1.json').address;
const borrowingFeesAddr =
  require('../deployments/mumbai/GNSBorrowingFeesV6_4_Proxy.json').address;

async function setPairParams() {
  const [owner] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt(
    'GNSPairInfosV6_1',
    addr,
    owner
  );

  console.info('Setting GNSPairInfosV6_1 params...');
  console.info('Submitting setManager transaction...');
  const setManagerTx = await contract.setManager(owner.address);
  console.info('Waiting setManager to complete...');
  await hre.ethers.provider.waitForTransaction(setManagerTx.hash);
  console.info('setManager completed.');

  console.info('Submitting setPairParams transaction...');
  const tx = await contract.setPairParams(0, [0, 0, 0, 0]);
  console.info('Waiting setPairParams to complete...');
  await hre.ethers.provider.waitForTransaction(tx.hash);
  console.info('setPairParams completed.');

  const borrowingFeesContract = await hre.ethers.getContractAt(
    'GNSBorrowingFeesV6_4',
    borrowingFeesAddr,
    owner
  );
  console.info('Executing setPairParams...');
  const setPairParamsTx = await borrowingFeesContract.setPairParams(0, [
    0,
    0,
    1,
    '13156490000000000',
  ]);
  await ethers.provider.waitForTransaction(setPairParamsTx.hash);
  console.info('Done setPairParams');
}

module.exports = setPairParams;
