const { deployments, getNamedAccounts } = require("hardhat");

async function setPairParams() {
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  // console.info("Executing GNSPairInfosV6_1.setManager...");
  // await execute("GNSPairInfosV6_1", { from: deployer }, "setManager", deployer);
  // console.info("Done GNSPairInfosV6_1.setManager");

  // console.info("Executing GNSPairInfosV6_1.setPairParams...");
  // await execute(
  //   "GNSPairInfosV6_1",
  //   { from: deployer },
  //   "setPairParams",
  //   0,
  //   [0, 0, 0, 0]
  // );
  // console.info("Done GNSPairInfosV6_1.setPairParams");

  // let tx = await execute(
  //   "GNSBorrowingFeesV6_4",
  //   { from: deployer },
  //   "setGroupParams",
  //   1,
  //   [91987, 24660540000000000n, 1]
  // );
  // console.info(
  //   "Executing GNSBorrowingFeesV6_4.setGroupParams. Tx:",
  //   tx.transactionHash
  // );
  // await ethers.provider.waitForTransaction(tx.transactionHash);

  // console.info("Done GNSBorrowingFeesV6_4.setGroupParams");

  tx = await execute(
    "GNSBorrowingFeesV6_4",
    { from: deployer },
    "setPairParams",
    0,
    [1, 0, 1, "13156490000000000"]
  );
  console.info(
    "Executing GNSBorrowingFeesV6_4.setPairParams. Tx:",
    tx.transactionHash
  );
  await ethers.provider.waitForTransaction(tx.transactionHash);
  console.info("Done GNSBorrowingFeesV6_4.setPairParams");
}

module.exports = { setPairParams };
