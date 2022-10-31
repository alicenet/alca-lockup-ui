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

    // Multiplier vars
    uint256 internal constant _CONVERSION_MULTIPLIER = 155555555555555555555556;
    uint256 internal constant _CONVERSION_SCALE = 100000000000000000000000;
    bool internal constant _MULTIPLIER_ON = false;
    bool internal constant _MULTIPLIER_OFF = true;

    bool internal _multiply;

    constructor(address legacyToken_) {
        _legacyToken = legacyToken_;
    }

    function initialize() public initializer {
        __ERC20_init("AToken", "ALC");
    }

    function migrate(uint256 amount) public {
        require(_migrationAllowed, "MadTokens migration not allowed");
        IERC20(_legacyToken).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, _convert(amount));
    }

    // Mock Exchange Rate Functions
    function convert(uint256 amount) public view returns (uint256) {
        return _convert(amount);
    }

    function _toggleMultiplierOff() internal {
        _multiply = _MULTIPLIER_OFF;
    }

    function _toggleMultiplierOn() internal {
        _multiply = _MULTIPLIER_ON;
    }

    function _convert(uint256 amount) internal view returns (uint256) {
        if (_multiply == _MULTIPLIER_ON) {
            return _multiplyTokens(amount);
        } else {
            return amount;
        }
    }

    function _multiplyTokens(uint256 amount) internal pure returns (uint256) {
        return (amount * _CONVERSION_MULTIPLIER) / _CONVERSION_SCALE;
    }

    function toggleMultiplierOff() public {
        // NOTE: Normally accesible as onlyFactory
        _toggleMultiplierOff();
    }

    function toggleMultiplierOn() public {
        // NOTE: Normally accesible as onlyFactory
        _toggleMultiplierOn();
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
