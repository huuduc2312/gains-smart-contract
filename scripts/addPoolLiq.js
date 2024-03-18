import { Pool, Position } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';

const pool = new Pool();
const tickLower = -100;
const tickUpper = 200;
const liquidity = JSBI.BigInt('1000000000000000000');

const position = new Position({
  pool,
  liquidity,
  tickLower,
  tickUpper,
});
