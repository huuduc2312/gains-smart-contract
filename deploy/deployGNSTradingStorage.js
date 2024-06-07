// const { addTradingContract } = require("../utils/trading");
const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");

const func = createDeployFunction({
  contractName: "GFarmTradingStorageV5",
});

module.exports = func;
