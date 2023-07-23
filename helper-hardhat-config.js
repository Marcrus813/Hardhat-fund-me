/**
 * Good place to put anything to avoid hardcode
 */

const networkConfig = {
	11155111 /** Sepolia chainId */: {
		name: "Sepolia",
		ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
	},
	137 /** Polygon chainId */: {
		name: "Polygon",
		ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
	},
	// Hardhat? Don't even have a feed address, this is where Mock contracts comes in
	// 31337: {},
};

const devChains = ["hardhat", "localhost"];
const MOCK_ARGS = {
	DECIMALS: 8,
	INITIAL_ANSWER: 200000000000,
};

module.exports = {
	networkConfig,
	devChains,
	MOCK_ARGS,
};
