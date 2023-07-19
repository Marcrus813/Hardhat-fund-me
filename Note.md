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

### Working with local node

> See code comments for coding notes

Running local node automatically deploys contracts

## Solidity code style

### Order of contents

> 1. Pragma statements
> 2. Import statements
> 3. Interfaces
> 4. Libraries
> 5. Contracts
>     1. Type declarations
>     2. State variables
>     3. Events
>     4. Errors
>     5. Modifiers
>     6. Functions
>         1. Constructor
>         2. receive
>         3. fallback
>         4. external
>         5. public
>         6. internal
>         7. private
>         8. view / pure

NatSpec: Ethereum Natural language Specification Format, in-code docs, pretty useful, already know that

## Testing(More advanced)

### Aspects

#### Staging and unit

Unit tests are done locally, Stage tests are done on test nets(Finally)

- Unit test
    Test minimal portions of the code
    - Done on:
        - local hardhat
        - forked hardhat
- Staging
    Units are done, move on to integration
