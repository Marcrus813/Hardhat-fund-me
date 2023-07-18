# Lesson 7

## Up-front

Hardhat updated, so there's no `Create Advanced Project` option, in addition to init packages, will use `SolHint: yarn add --dev solhint`

## Importing from NPM

First: `yarn add --dev [Pkg]`

## Deploying

Using raw `deploy.js` can be annoying, Use `hardhat-deploy`, in `./deploy` folder, are new deploy scripts, also requires `hardhat-deploy-ethers`
Cmd: shell`yarn hardhat deploy`, this will run all the scripts in `deploy` folder in an order, so to better manage this, name the scripts with numbers like "01-deploy-fund-me.js"

## Mocking

Problem: How to interact and test code locally? Default hardhat gets destroyed every time and localhost hardhat does not last long

### Definition

> Mocking is primarily used in unit testing. An object under test may have dependencies on other (complex) objects. To isolate the behavior of the object you want to test you replace the other objects by mocks that simulate the behavior of the real objects. This is useful if the real objects are impractical to incorporate into the unit test. In short, mocking is creating objects that simulate the behavior of real objects.

_View `01-deploy-fund-me.js` and `FundMe.sol` and `PriceConverter.sol` comments for more info_
