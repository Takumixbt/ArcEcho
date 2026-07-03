// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Creator-listed content: price to buy, price/duration to rent, pointer to the gated asset.
contract ContentRegistry {
    struct Content {
        address creator;
        uint256 buyPrice; // USDC, 6 decimals. 0 = not for sale.
        uint256 rentPrice; // USDC, 6 decimals. 0 = not for rent.
        uint256 rentDuration; // seconds
        string contentURI; // pointer to gated content (e.g. ipfs://<cid>)
    }

    uint256 public nextContentId;
    mapping(uint256 => Content) public contents;

    event ContentListed(
        uint256 indexed contentId,
        address indexed creator,
        uint256 buyPrice,
        uint256 rentPrice,
        uint256 rentDuration,
        string contentURI
    );

    function list(
        uint256 buyPrice,
        uint256 rentPrice,
        uint256 rentDuration,
        string calldata contentURI
    ) external returns (uint256 contentId) {
        require(buyPrice > 0 || rentPrice > 0, "must set a buy or rent price");
        if (rentPrice > 0) {
            require(rentDuration > 0, "rent duration required");
        }

        contentId = nextContentId++;
        contents[contentId] = Content({
            creator: msg.sender,
            buyPrice: buyPrice,
            rentPrice: rentPrice,
            rentDuration: rentDuration,
            contentURI: contentURI
        });

        emit ContentListed(contentId, msg.sender, buyPrice, rentPrice, rentDuration, contentURI);
    }
}
