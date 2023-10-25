/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY="1SH9vqgAC5tDm-m0a9-5nV5S3piNSoC8";
const SEPOLIA_PRIVATE_KEY ="e9255ca14b8b4d1fb05e1b6ed6ad6f8f1d9b25f3f65c179946e1c743369c7330";
const SEPOLIA_PRIVATE_KEY_2 ="b580d6cdf3812fbb0c1cd48bf6f7e96a9508c79db7e9f9ec58243a1279360957";

module.exports = {
  solidity: "0.8.19",

  networks:{
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      // accounts:[`${SEPOLIA_PRIVATE_KEY},${SEPOLIA_PRIVATE_KEY_2}`],
      accounts:[SEPOLIA_PRIVATE_KEY,SEPOLIA_PRIVATE_KEY_2]
    
    },
  },

    etherscan: {
      apiKey: "P5WJR3U8E2XPQHTSSZ8RFFF6DYJN5B4BS5",
    },
};