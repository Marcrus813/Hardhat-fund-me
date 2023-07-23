const { getNamedAccounts, ethers, deployments } = require("hardhat");

async function main() {
	const deployer = await getNamedAccounts();
	const fundMe_address = (await deployments.get("FundMe")).address;
	const fundMe = await ethers.getContractAt("FundMe", fundMe_address);
	await fundMe.connect(deployer);

	console.log("Funding Contract");
	const txnResponse_fund = await fundMe.fund({
		value: ethers.parseEther("1"),
	});
	const txnReceipt_fund = await txnResponse_fund.wait(1);
	console.log("Funded");

	console.log("Withdrawing");
	const txnResponse_withdraw = await fundMe.withdraw();
	const txnReceipt_withdraw = await txnResponse_withdraw.wait(1);
	console.log("Got it back");
}

main().then(() =>
	process.exit(0).catch((error) => {
		console.error(error);
		process.exit(1);
	})
);
