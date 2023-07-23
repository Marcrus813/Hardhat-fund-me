const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { devChains } = require("../../helper-hardhat-config");

devChains.includes(network.name)
	? describe.skip
	: describe("FundMe", () => {
			let fundMe;
			let deployer;
			const sendValue_sufficient = ethers.parseEther("1");

			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;

				// Allow to run deploy with as many tags as we want

				const fundMe_address = (await deployments.get("FundMe"))
					.address;
				// Get most recently deployed FundMe contract, get with contract address
				fundMe = await ethers.getContractAt("FundMe", fundMe_address);
			});

			it("Allowing funding and withdrawing", async () => {
				await fundMe.fund({ value: sendValue_sufficient });
				await fundMe.withdraw();

				const endingFundMeBalance = await ethers.provider.getBalance(
					await fundMe.getAddress()
				);

				assert.equal(endingFundMeBalance.toString(), "0");
			});
	  });
