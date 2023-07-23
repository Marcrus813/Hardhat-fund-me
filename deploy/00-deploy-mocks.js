const { network } = require("hardhat");
const { devChains, MOCK_ARGS } = require("../helper-hardhat-config");

module.exports = async (hre) => {
	const { getNamedAccounts, deployments } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	// The mock contract should be different from actual project contracts, create a new folder in `contracts`
	// Don't deploy to actual test net, can do it the way before: check chainId, can also specify in helper-config
	console.log(`Detected network: ${network.name}`);
	if (devChains.includes(network.name)) {
		// Deploy mocks
		console.log("Local network detected, deploying mocks...");
		await deploy("MockV3Aggregator", {
			contract: "MockV3Aggregator",
			from: deployer,
			log: true,
			args: [MOCK_ARGS["DECIMALS"], MOCK_ARGS["INITIAL_ANSWER"]],
		});
		console.log("Mocks deployed!");
		console.log("******************************************************");
	}
};

// To control whether deploy all or only the mocks, used as `yarn hardhat deploy --tags mocks`
module.exports.tags = ["all", "mocks"];
