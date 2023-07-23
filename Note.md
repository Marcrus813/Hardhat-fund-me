# Lesson 7

## Up-front

Hardhat updated, so there's no `Create Advanced Project` option, in addition to init packages, will use `SolHint: yarn add --dev solhint`

---

## Importing from NPM

First: `yarn add --dev [Pkg]`

---

## Deploying

Using raw `deploy.js` can be annoying, Use `hardhat-deploy`, in `./deploy` folder, are new deploy scripts, also requires `hardhat-deploy-ethers`
Cmd: shell`yarn hardhat deploy`, this will run all the scripts in `deploy` folder in an order, so to better manage this, name the scripts with numbers like "01-deploy-fund-me.js"

---

## Mocking

Problem: How to interact and test code locally? Default hardhat gets destroyed every time and localhost hardhat does not last long

### Definition

> Mocking is primarily used in unit testing. An object under test may have dependencies on other (complex) objects. To isolate the behavior of the object you want to test you replace the other objects by mocks that simulate the behavior of the real objects. This is useful if the real objects are impractical to incorporate into the unit test. In short, mocking is creating objects that simulate the behavior of real objects.

_View `01-deploy-fund-me.js` and `FundMe.sol` and `PriceConverter.sol` comments for more info_

### Working with local node

> See code comments for coding notes

Running local node automatically deploys contracts

**_Issue encountered: When using localhost or default hardhat, while there's no other txn going on, if we wait for block confirmation, it will be hung, so limit block confirmation to 0_**

---

## Solidity code style

### Order of contents

> 1. Pragma statements
> 2. Import statements
> 3. Interfaces
> 4. Libraries
> 5. Contracts
>    1. Type declarations
>    2. State variables
>    3. Events
>    4. Errors
>    5. Modifiers
>    6. Functions
>       1. Constructor
>       2. receive
>       3. fallback
>       4. external
>       5. public
>       6. internal
>       7. private
>       8. view / pure

NatSpec: Ethereum Natural language Specification Format, in-code docs, pretty useful, already know that

---

## Testing(More advanced)

### Aspects

#### Staging and unit(Definitions)

Unit tests are done locally, Stage tests are done on test nets(Finally)

- Unit test
  Test minimal portions of the code
  - Done on:
    - local hardhat
    - forked hardhat
- Staging
  - Units are done, move on to integration(Final step)

### Unit test

Use more `describe` to group tests, see code comments for more.

Use `console.log()` in solidity by `import "hardhat/console.sol"` in `.sol`

- Code hacks

  - Instead of `"1000000000000000000"` which is 1 ETH, we can use: `const sendValue_sufficient = ethers.parseEther("1");`, also we can use `ethers.parseUnits("1.0", "ether")`(See ethers.js documentation)

- Problem notes

  - There appears to be some issue with `yarn hardhat test`, installed `mocha` and use `yarn mocha test/**/*.js` works fine.
    - _Issue with gas-reporter, but I thought I fixed that already?_
    - **Conclusion**
      - Fk the wall
  - `Error: could not decode result data (value="0x", info={ "method": "getPriceFeed", "signature": "getPriceFeed()" }, code=BAD_DATA, version=6.6.4)`

    - Not problem with `priceFeed()`(Auto generated getter for public field variable), but with the object itself
    - It's a problem with versions
    - Used new code to solve this

      - Updated from `getContract` to `getContractAt(nameOrAbi: string | any[], address: string | ethers.Addressable, signer?: ethers.Signer)`, where contract address is required and signer is optional, so we should pass contract address, see code for detailed how
      - But with `getContractAt`, might need to connect to contract manually later on
      - Further update: to get contract address, can use:

        ```javascript
        let fundMe;

        const {
          deployments,
          ethers,
          getNamedAccounts,
          network,
        } = require("hardhat");

        // Deploying the contract
        const deploymentResults = await deployments.fixture(["all"]);
        // Or the contract is already deployed with `yarn hardhat deploy`

        // Get already deployed contract address
        const fundMe_address = (await deployments.get("FundMe")).address;
        fundMe = await ethers.getContractAt("FundMe", fundMe_address);
        await fundMe.connect(deployer);

        // Deploy and test
        const deploymentResults = await deployments.fixture(["all"]);
        const fundMe_address = deploymentResults["FundMe"]?.address;
        fundMe = await ethers.getContractAt("FundMe", fundMe_address);
        await fundMe.connect(deployer);
        ```

        Where `deployments.get("FundMe")` returns a `Deployment`

    - **Conclusion**
      - It really helps to read docs and see src for myself

  - `fundMe.provider.getBalance()` not working
    - Use `ethers.provider.getBalance(address)`, what's probably causing this our `fundMe` is setup differently with `getContractAt()`
  - `add()` function in V5 is upgraded to `+`, you can use `+` to add but only when both are `bigint`, the type `BigNumber` is also replaced with `bigint`, see **[documentation](https://docs.ethers.org/v6/migrating/#migrate-bigint)** for more info
    - Side note: `TransactionReceipt` has also changed, also go see **[documentation](https://docs.ethers.org/v6/search/?search=TransactionResponse)**.
  - `Expected transaction to be reverted with reason 'FundMe__NotOwner', but it reverted with a custom error`
    - Version problem again? `revertedWith` works only with built-in, if we were to capture our custom error we need to use:
      ```javascript
      await expect(
        attackerConnectContract.withdraw()
      ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
      ```

#### [Storage in Solidity](https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=42274s)

**[Documentation](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)**
If there's global variables(is there forever), they are put in **Storage** slots

> Note:
>
> - Each slot is 32 bytes long, representing the byte version of the object
>   - `uint256 number = 25` -> [0]: 0x00...19
>   - `bool flag = true` -> [1]: 0x00...01
> - Dynamic length?
>   - Dynamic variables like mapping and dynamic arrays, stored using hash, variable takes up storage slot but not the entire array
>   - Example
>     - Array
>       - `uint256[] array` -> [2]: 0x00...01 The length of the array
>       - `array.push(222)` -> value `0x00...de` stored at `[keccak256(2)]` where `keccak256` is the hash function and `2` is the index of `array` in `Storage`(Sequential storage spot)
>     - Map
>       - Sequential storage spot is left blank
>       - CANNOT be in `memory`
> - Constant and immutable variables do not take up storage, they are directly in byte code of the contract: `uint256 constant FIXED = 123` -> `FIXED` is a pointer to `123`

Function variables within a scope gets killed after execution is complete

- `memory` keyword
  - Why strings need the keyword?
    - `string` is dynamic sized array, solidity need to know where to operate(it takes up a lot space), `memory` or `storage`

Every time writing into storage space, it takes a lot of gas(See `opcode` in `./artifacts/build-info/a16fb02fb158470102ec0589005c5dd3.json`)

> Gas is actually calculated by `opcodes`: [Reference](https://github.com/crytic/evm-opcodes)
> Monsters:
>
> - `SLOAD`: Load word from storage -> 800
> - `SSTORE`: Save word to storage -> 20000\*\*

Best practices:

- Storage variables
  - To remind ourselves of we are using storage variable, name storage variables as `s_variable`
  - Try and read and write as less frequent as possible(See FundMe.sol `cheaperWithdraw`)
- Immutable variables
  - `i_variable`
- Constant
  - `VARIABLE`

#### Code styling

Limiting `public` keyword(Also saves gas)
Use getter and setters(Do I need setters?)

Use custom error instead of using `require(callSuccess, "Call failed");` also saves gas:

```solidity
    if (!callSuccess) {
        revert FundMe__WithdrawFailed();
    }
```

### Staging test

Tests used on actual test net, similar to unit test but assume on test net(last step)

`yarn hardhat test --network sepolia`

- Problem notes
  - In staging test code, we won't do `fixture` cuz we assume contract already deployed, how do we get contract address for `getContractAt`?
    - We will use fixture or we need to pass in contract address

### Conclusion(Personal thought)

- Unit test focus on code behaviors while stage tests focus on interaction behaviors

---

## Running script on local node

Interacting with local network and contracts quickly

***

## Github

[CN Specific guide](https://blog.csdn.net/weixin_43914200/article/details/121316043)
