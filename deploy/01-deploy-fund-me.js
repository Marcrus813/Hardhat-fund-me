// Import

const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

// No main function and its calling, use this as deploy function
/* function deployFunc() {
    console.log("Hello")    
}

// Specifying `deployFunc` as the default function for `yarn hardhat deploy to look for`
module.exports.default = deployFunc; */

// Identical as above
/**
 * Entry point for `hardhat deploy`
 * @param {*} hre - Hardhat runtime env
 */
module.exports = async (hre) => {
	// Same as `hre.getNamedAccounts`
	const { getNamedAccounts, deployments } = hre;

	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts(); // Can read from `hardhat.config.js` to get named accounts, with each account has an identifier or a name for better telling apart
	const chainId = network.config.chainId();

	// Use `chainId` to determine `priceFeed` address, use aave code, link to `helper-hardhat-config.js`
	const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
	/**
	 * With hardhat, there's no price feed => The contract does not exist => We create(a minimal version of it) our own
	 * 		A new deploy script in `deploy`
	 */

	/**
	 * Passing params through constructor
	 * When going for localhost or hardhat, use Mock
	 * Also should work with different chains
	 */

	const fundMe = await deploy("FundMe" /**Name of the contract */, {
		/**
		 * List of overrides
		 */
		from: deployer,
		args: [], // Put price feed
		log: true,
	});
};
