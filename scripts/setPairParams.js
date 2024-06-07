const { deployments, getNamedAccounts } = require("hardhat");
const { setPairParams } = require("../utils/setPairParams");

async function main() {
  await setPairParams();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
