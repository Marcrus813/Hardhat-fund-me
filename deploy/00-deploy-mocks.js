const { network } = require("hardhat");

module.exports = async (hre) => {
	const { getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId();

    // The mock contract should be different from actual project contracts, create a new folder in `contracts`
};
