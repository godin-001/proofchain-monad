// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ProofNFT is ERC721, Ownable {
    using Strings for uint256;
    using Strings for address;

    struct ExperienceData {
        address student;
        address company;
        address university;
        string title;
        uint256 totalHours;
        uint256 timestamp;
        string ipfsHash;
    }

    address public registry;
    uint256 private _nextTokenId;
    mapping(uint256 => ExperienceData) public experiences;

    error OnlyRegistry();
    error SoulboundTransfer();

    modifier onlyRegistry() {
        if (msg.sender != registry) revert OnlyRegistry();
        _;
    }

    constructor() ERC721("ProofChain Experience", "PROOF-XP") Ownable(msg.sender) {}

    function setRegistry(address _registry) external onlyOwner {
        registry = _registry;
    }

    function mint(address to, ExperienceData calldata data) external onlyRegistry returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        experiences[tokenId] = data;
        _mint(to, tokenId);
        return tokenId;
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)), block transfers
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransfer();
        }
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        ExperienceData storage data = experiences[tokenId];

        string memory json = string(
            abi.encodePacked(
                '{"name":"ProofChain Experience #',
                tokenId.toString(),
                '","description":"Soulbound proof of validated experience","attributes":[',
                '{"trait_type":"Title","value":"',
                data.title,
                '"},{"trait_type":"Hours","value":',
                data.totalHours.toString(),
                '},{"trait_type":"Student","value":"',
                Strings.toHexString(data.student),
                '"},{"trait_type":"Company","value":"',
                Strings.toHexString(data.company),
                '"},{"trait_type":"University","value":"',
                Strings.toHexString(data.university),
                '"},{"trait_type":"Timestamp","value":',
                data.timestamp.toString(),
                '},{"trait_type":"IPFS Hash","value":"',
                data.ipfsHash,
                '"}]}'
            )
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }

    function getExperienceData(uint256 tokenId) external view returns (ExperienceData memory) {
        _requireOwned(tokenId);
        return experiences[tokenId];
    }
}
