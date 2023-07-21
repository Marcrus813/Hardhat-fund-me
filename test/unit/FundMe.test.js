const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", function () {
	let fundMe;
	let deployer;
	let MockV3Aggregator;

	// Old code using `getContract`
	/* beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer;
		// Another way
		//const accounts = await ethers.getSigners(); // Return `network.config.accounts`

		await deployments.fixture["all"]; 
		fundMe = await ethers.getContractAt("FundMe", deployer); // Get most recently deployed FundMe contract, connect `deployer` with FundMe
		MockV3Aggregator = await ethers.getContractAt(
			"MockV3Aggregator",
			deployer
		);
	}); */

	beforeEach(async () => {
		const deploymentResults = await deployments.fixture(["all"]); // Allow to run deploy with as many tags as we want

		const fundMe_address = deploymentResults["FundMe"]?.address;
		fundMe = await ethers.getContractAt("FundMe", fundMe_address); // Get most recently deployed FundMe contract, get with contract address
		const mockV3Aggregator_address =
			deploymentResults["MockV3Aggregator"]?.address;
		MockV3Aggregator = await ethers.getContractAt(
			"MockV3Aggregator",
			mockV3Aggregator_address
		);
	});

	// Group constructor
	describe("Constructor", () => {
		it("Sets the aggregator addresses correctly", async () => {
			const response = await fundMe.priceFeed();
			assert.equal(response, await MockV3Aggregator.getAddress());
		});
	});
});
