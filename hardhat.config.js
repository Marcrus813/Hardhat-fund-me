require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");
// CN Specific
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://172.24.144.1:10809");
setGlobalDispatcher(proxyAgent);

const RPC_URL_SEPOLIA = process.env.RPC_URL_SEPOLIA || ""; // If `process.env.RPC_URL_SEPOLIA` not exist, then right side, to prevent `undefined`
const PRIV_KEY_SEPOLIA = process.env.PRIV_KEY_SEPOLIA;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: "hardhat",
	solidity: "0.8.19",
	networks: {
		sepolia: {
			url: RPC_URL_SEPOLIA,
			accounts: [PRIV_KEY_SEPOLIA],
			chainId: 11155111,
		},
		localhost: {
			url: "http://127.0.0.1:8545/",
			chainId: 31337,
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	namedAccounts: { // Name accounts in `accounts` array
        deployer:{
            default: 0, // Account at 0 is deployer
            4: 0 // chainId: account index
        }
    },
	gasReporter: {
		enabled: false, // Turn on or off
		outputFile: "./Test_Reports/Gas_Report.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: COINMARKETCAP_API_KEY,
		token: "ETH", // Default state, change if to change network
	},
};