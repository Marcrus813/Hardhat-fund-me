// Import

const { network } = require("hardhat");

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
};
