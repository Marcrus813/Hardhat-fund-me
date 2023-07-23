const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { devChains } = require("../../helper-hardhat-config");

!devChains.includes(network.name)
	? describe.skip
	: describe("FundMe", function () {
			let fundMe;
			let deployer;
			let MockV3Aggregator;

			// const sendValue_sufficient = "1000000000000000000"; // 1 eth
			const sendValue_sufficient = ethers.parseEther("1");

			// Old code using `getContract`
			/* beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer;
		// Another way
		//const accounts = await ethers.getSigners(); // Return `network.config.accounts`

		await deployments.fixture["all"]; 
		fundMe = await ethers.getContract("FundMe", deployer); // Get most recently deployed FundMe contract, connect `deployer` with FundMe
		MockV3Aggregator = await ethers.getContract(
			"MockV3Aggregator",
			deployer
		);
	}); */

			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;

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
					const response = await fundMe.getPriceFeed();
					assert.equal(response, await MockV3Aggregator.getAddress());
				});
			});

			// For functions, should do line by line
			describe("Fund", () => {
				/**
				 * `require`:
				 * 		Should fail if not enough eth sent
				 */
				it("Fails if not enough eth sent", async () => {
					/**
					 *  `fail` is different from `not equal`
					 * 		`fail` => uncaught exceptions
					 * 	This is where `expect` comes in: we can expect txn to fail(expect revert)
					 */
					await expect(fundMe.fund()).to.be.reverted;
					// More specific with error msg:
					// await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
				});

				it("Updated the amount funded data", async () => {
					await fundMe.fund({ value: sendValue_sufficient });
					const response = await fundMe.getAddressToAmountFunded(
						deployer
					);
					assert.equal(response.toString(), sendValue_sufficient);
				});

				it("Adds funder to array of funders", async () => {
					await fundMe.fund({ value: sendValue_sufficient });
					const response = await fundMe.getFunders(0);
					assert.equal(response.toString(), deployer);
				});

				// More behaviors should be tested
				// TODO: More behaviors
			});

			describe("Withdraw", () => {
				// To withdraw, should have money on the contract, or maybe test it?
				// This is beforeEach for all test within "Withdraw" scope
				beforeEach(async () => {
					await fundMe.fund({ value: sendValue_sufficient });
				});

				/**
				 * This can be a rather longer test:
				 * 		Arrange -> Act -> Assert
				 */
				it("Withdraw ETH from a single funder", async () => {
					// Arrange: What we need for the test
					const startingFundMeBalance =
						await ethers.provider.getBalance(
							await fundMe.getAddress()
						);
					const startingDeployerBalance =
						await ethers.provider.getBalance(deployer);

					// Act: What to do with what we have
					const txnResponse = await fundMe.withdraw();
					const txnReceipt = await txnResponse.wait(1);

					const { fee } = txnReceipt;

					const endingFundMeBalance =
						await ethers.provider.getBalance(
							await fundMe.getAddress()
						);
					const endingDeployerBalance =
						await ethers.provider.getBalance(deployer);

					// Assert: Check the result
					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						(
							startingFundMeBalance + startingDeployerBalance
						).toString(),
						(endingDeployerBalance + fee).toString()
					);
				});

				/* it("Cheaper withdraw from single", async () => {
			// Arrange: What we need for the test
			const startingFundMeBalance = await ethers.provider.getBalance(
				await fundMe.getAddress()
			);
			const startingDeployerBalance = await ethers.provider.getBalance(
				deployer
			);

			// Act: What to do with what we have
			const txnResponse = await fundMe.cheaperWithdraw();
			const txnReceipt = await txnResponse.wait(1);

			const { fee } = txnReceipt;

			const endingFundMeBalance = await ethers.provider.getBalance(
				await fundMe.getAddress()
			);
			const endingDeployerBalance = await ethers.provider.getBalance(
				deployer
			);

			// Assert: Check the result
			assert.equal(endingFundMeBalance, 0);
			assert.equal(
				(startingFundMeBalance + startingDeployerBalance).toString(),
				(endingDeployerBalance + fee).toString()
			);
		}); */

				it("Allowing to withdraw from multiple funders", async () => {
					const accounts = await ethers.getSigners();

					for (
						let index = 1 /**0 is deployer */;
						index < accounts.length;
						index++
					) {
						const funder = accounts[index];
						const connectedContract = await fundMe.connect(funder);
						await connectedContract.fund({
							value: sendValue_sufficient,
						});
					}

					// Arrange: What we need for the test
					const startingFundMeBalance =
						await ethers.provider.getBalance(
							await fundMe.getAddress()
						);
					const startingDeployerBalance =
						await ethers.provider.getBalance(deployer);

					// Act: What to do with what we have
					const txnResponse = await fundMe.withdraw();
					const txnReceipt = await txnResponse.wait(1);

					const { fee } = txnReceipt;

					const endingFundMeBalance =
						await ethers.provider.getBalance(
							await fundMe.getAddress()
						);
					const endingDeployerBalance =
						await ethers.provider.getBalance(deployer);

					// Assert: Check the result
					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						(
							startingFundMeBalance + startingDeployerBalance
						).toString(),
						(endingDeployerBalance + fee).toString()
					);

					for (i = 1; i < accounts.length; i++) {
						assert.equal(
							await fundMe.getAddressToAmountFunded(
								accounts[i].address
							),
							0
						);
					}
				});

				/* it("Cheaper withdraw from multiple", async () => {
			const accounts = await ethers.getSigners();

			for (
				let index = 1; //0 is deployer
				index < accounts.length;
				index++
			) {
				const funder = accounts[index];
				const connectedContract = await fundMe.connect(funder);
				await connectedContract.fund({ value: sendValue_sufficient });
			}

			// Arrange: What we need for the test
			const startingFundMeBalance = await ethers.provider.getBalance(
				await fundMe.getAddress()
			);
			const startingDeployerBalance = await ethers.provider.getBalance(
				deployer
			);

			// Act: What to do with what we have
			const txnResponse = await fundMe.cheaperWithdraw();
			const txnReceipt = await txnResponse.wait(1);

			const { fee } = txnReceipt;

			const endingFundMeBalance = await ethers.provider.getBalance(
				await fundMe.getAddress()
			);
			const endingDeployerBalance = await ethers.provider.getBalance(
				deployer
			);

			// Assert: Check the result
			assert.equal(endingFundMeBalance, 0);
			assert.equal(
				(startingFundMeBalance + startingDeployerBalance).toString(),
				(endingDeployerBalance + fee).toString()
			);

			for (i = 1; i < accounts.length; i++) {
				assert.equal(
					await fundMe.s_addressToAmountFunded(accounts[i].address),
					0
				);
			}
		}); */

				it("Only allows the owner to withdraw", async function () {
					const accounts = await ethers.getSigners();
					const fundMeConnectedContract = await fundMe.connect(
						accounts[1]
					);
					await expect(
						fundMeConnectedContract.withdraw()
					).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
				});
			});
	  });
