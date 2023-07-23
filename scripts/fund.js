const { getNamedAccounts, ethers, deployments } = require("hardhat");

async function main() {
	const deployer = await getNamedAccounts();
	const fundMe_address = (await deployments.get("FundMe")).address;
	const fundMe = await ethers.getContractAt("FundMe", fundMe_address);
	await fundMe.connect(deployer);
	console.log("Funding Contract");
	const txnResponse = await fundMe.fund({ value: ethers.parseEther("1") });
	await txnResponse.wait(1);
	console.log("Funded!");
}

main().then(() =>
	process.exit(0).catch((error) => {
		console.error(error);
		process.exit(1);
	})
);
