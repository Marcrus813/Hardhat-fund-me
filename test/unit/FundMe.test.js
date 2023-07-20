const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", function () {
	console.log("Started test...");
	let fundMe;
	let deployer;
	let MockV3Aggregator;

	beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer;
		// Another way
		//const accounts = await ethers.getSigners(); // Return `network.config.accounts`

		await deployments.fixture["all"]; // Allow to run deploy with as many tags as we want
		fundMe = await ethers.getContract("FundMe", deployer); // Get most recently deployed FundMe contract, connect `deployer` with FundMe
		MockV3Aggregator = await ethers.getContract(
			"MockV3Aggregator",
			deployer
		);
	});

	// Group constructor
	describe("Constructor", () => {
		it("Sets the aggregator addresses correctly", async () => {
			const response = await fundMe.priceFeed();
			assert.equal(response, MockV3Aggregator.address);
		});
	});
});
