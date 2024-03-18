const addPair = require('./addPair.js');
const initOracleRewards = require('./initOracleRewards.js');
const setPairParams = require('./setPairParams.js');
const setTradingStorageParams = require('./setTradingStorageParams.js');
const setupRoles = require('./setupRoles.js');

async function main() {
  await addPair();
  await setPairParams();
  // await setupRoles();

  // await initOracleRewards();
  // await setTradingStorageParams();

  // ["0xd7d1dcba2c678ee7e049bd55176354e7c5bbdcca",0,0,986399782992047741749,98640000000000000000,670443870320000,true,17,1024265411764705,0]
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
