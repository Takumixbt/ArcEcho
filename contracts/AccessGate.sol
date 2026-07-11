// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ContentRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Buy or rent access to content listed in ContentRegistry. Payment settles in USDC,
/// split between the creator and the protocol treasury at a fixed 5% fee.
contract AccessGate is ContentRegistry {
    using SafeERC20 for IERC20;

    uint256 public constant FEE_BPS = 500; // 5%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable usdc;
    address public immutable treasury;

    mapping(uint256 => mapping(address => bool)) public boughtAccess;
    mapping(uint256 => mapping(address => uint256)) public rentExpiry;

    event Bought(uint256 indexed contentId, address indexed buyer, uint256 amountPaid);
    event Rented(uint256 indexed contentId, address indexed renter, uint256 amountPaid, uint256 expiresAt);

    constructor(address usdcAddress, address treasuryAddress) {
        require(usdcAddress != address(0) && treasuryAddress != address(0), "zero address");
        usdc = IERC20(usdcAddress);
        treasury = treasuryAddress;
    }

    function buy(uint256 contentId) external {
        Content memory c = contents[contentId];
        require(c.creator != address(0), "content does not exist");
        require(c.buyPrice > 0, "not for sale");
        require(!boughtAccess[contentId][msg.sender], "already owned");

        _settle(c.creator, c.buyPrice);
        boughtAccess[contentId][msg.sender] = true;

        emit Bought(contentId, msg.sender, c.buyPrice);
    }

    function rent(uint256 contentId) external {
        Content memory c = contents[contentId];
        require(c.creator != address(0), "content does not exist");
        require(c.rentPrice > 0, "not for rent");

        _settle(c.creator, c.rentPrice);

        uint256 base = rentExpiry[contentId][msg.sender] > block.timestamp
            ? rentExpiry[contentId][msg.sender]
            : block.timestamp;
        uint256 expiresAt = base + c.rentDuration;
        rentExpiry[contentId][msg.sender] = expiresAt;

        emit Rented(contentId, msg.sender, c.rentPrice, expiresAt);
    }

    /// @notice True if `user` currently has access to `contentId`, via purchase or unexpired rental.
    function hasAccess(uint256 contentId, address user) external view returns (bool) {
        return boughtAccess[contentId][user] || rentExpiry[contentId][user] > block.timestamp;
    }

    function _settle(address creator, uint256 amount) internal {
        uint256 fee = (amount * FEE_BPS) / BPS_DENOMINATOR;
        uint256 creatorAmount = amount - fee;

        usdc.safeTransferFrom(msg.sender, creator, creatorAmount);
        if (fee > 0) {
            usdc.safeTransferFrom(msg.sender, treasury, fee);
        }
    }
}
