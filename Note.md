# Lesson 7
## Up-front
Hardhat updated, so there's no `Create Advanced Project` option, in addition to init packages, will use `SolHint: yarn add --dev solhint`
## Importing from NPM
First: `yarn add --dev [Pkg]`
## Deploying
Using raw `deploy.js` can be annoying, Use `hardhat-deploy`, in `./deploy` folder, are new deploy scripts, also requires `hardhat-deploy-ethers`
Cmd: shell`yarn hardhat deploy`, this will run all the scripts in `deploy` folder in an order, so to better manage this, name the scripts with numbers like "01-deploy-fund-me.js"