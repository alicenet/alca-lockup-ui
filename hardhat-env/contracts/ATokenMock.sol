// SPDX-License-Identifier: MIT-open-group
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// NOTE: CRITICAL: This is a modification of the AToken contract for isolated deployment and testing with the alca-swap-ui that exposes all methods
// DO NOT USE in alicenet deployments

// CHANGES IN THIS TESTING CONTRACT:
// - Does not use IAToken.sol interface
// - Does not use ImmutableFactory, ImmutableATokenMinter, or ImmutableATokenBUrner interfaces exposing function accesibility
// - _migrationAllowed is hardcoded to true

/// @custom:salt AToken
/// @custom:deploy-type deployStatic
contract ATokenMock is ERC20Upgradeable {

    address internal immutable _legacyToken;
    bool internal _migrationAllowed = false;

    constructor(address legacyToken_) {
        _legacyToken = legacyToken_;
    }

    function initialize() public initializer {
        __ERC20_init("AToken", "ALC");
    }

    function migrate(uint256 amount) public {
        require(_migrationAllowed, "MadTokens migration not allowed");
        IERC20(_legacyToken).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function allowMigration() public {
        // NOTE: Normally accesible as onlyFactory
        _migrationAllowed = true;
    }

    function externalMint(address to, uint256 amount) public {
        // NOTE: Normally accesible as onlyATokenMinter
        _mint(to, amount);
    }

    function externalBurn(address from, uint256 amount) public {
        // NOTE: Normally accesible as onlyATokenBurner
        _burn(from, amount);
    }

    function getLegacyTokenAddress() public view returns (address) {
        return _legacyToken;
    }
}
