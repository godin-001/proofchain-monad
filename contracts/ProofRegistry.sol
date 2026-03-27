// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ProofToken.sol";
import "./ProofNFT.sol";

contract ProofRegistry {
    enum Status {
        Pending,
        InProgress,
        Completed,
        Rejected
    }

    struct Experience {
        uint256 id;
        address student;
        address company;
        address university;
        string title;
        string description;
        uint256 totalHours;
        Status status;
        bool studentSigned;
        bool companySigned;
        bool universitySigned;
    }

    ProofToken public proofToken;
    ProofNFT public proofNFT;

    uint256 private _nextExperienceId;
    mapping(uint256 => Experience) private _experiences;

    uint256 public constant REWARD_AMOUNT = 500 * 10 ** 18;

    event ExperienceCreated(
        uint256 indexed id,
        address indexed student,
        address company,
        address university,
        string title
    );
    event ExperienceSigned(uint256 indexed id, address indexed signer, string role);
    event ExperienceCompleted(uint256 indexed id, address indexed student, uint256 tokenId);

    error ExperienceNotFound();
    error NotAuthorized();
    error AlreadySigned();
    error ExperienceNotPending();

    constructor(address _proofToken, address _proofNFT) {
        proofToken = ProofToken(_proofToken);
        proofNFT = ProofNFT(_proofNFT);
    }

    function registerExperience(
        address company,
        address university,
        string calldata title,
        string calldata description,
        uint256 totalHours
    ) external returns (uint256) {
        uint256 id = _nextExperienceId++;

        _experiences[id] = Experience({
            id: id,
            student: msg.sender,
            company: company,
            university: university,
            title: title,
            description: description,
            totalHours: totalHours,
            status: Status.Pending,
            studentSigned: false,
            companySigned: false,
            universitySigned: false
        });

        emit ExperienceCreated(id, msg.sender, company, university, title);
        return id;
    }

    function signAsCompany(uint256 experienceId) external {
        Experience storage exp = _getExperience(experienceId);
        if (msg.sender != exp.company) revert NotAuthorized();
        if (exp.companySigned) revert AlreadySigned();
        if (exp.status == Status.Completed || exp.status == Status.Rejected) revert ExperienceNotPending();

        exp.companySigned = true;
        exp.status = Status.InProgress;

        emit ExperienceSigned(experienceId, msg.sender, "company");

        _checkAndComplete(experienceId);
    }

    function signAsUniversity(uint256 experienceId) external {
        Experience storage exp = _getExperience(experienceId);
        if (msg.sender != exp.university) revert NotAuthorized();
        if (exp.universitySigned) revert AlreadySigned();
        if (exp.status == Status.Completed || exp.status == Status.Rejected) revert ExperienceNotPending();

        exp.universitySigned = true;
        exp.status = Status.InProgress;

        emit ExperienceSigned(experienceId, msg.sender, "university");

        _checkAndComplete(experienceId);
    }

    function signAsStudent(uint256 experienceId) external {
        Experience storage exp = _getExperience(experienceId);
        if (msg.sender != exp.student) revert NotAuthorized();
        if (exp.studentSigned) revert AlreadySigned();
        if (exp.status == Status.Completed || exp.status == Status.Rejected) revert ExperienceNotPending();

        exp.studentSigned = true;
        exp.status = Status.InProgress;

        emit ExperienceSigned(experienceId, msg.sender, "student");

        _checkAndComplete(experienceId);
    }

    function getExperience(uint256 experienceId) external view returns (Experience memory) {
        return _getExperience(experienceId);
    }

    function _getExperience(uint256 experienceId) internal view returns (Experience storage) {
        Experience storage exp = _experiences[experienceId];
        // Check if experience exists by verifying student is non-zero
        if (exp.student == address(0)) revert ExperienceNotFound();
        return exp;
    }

    function _checkAndComplete(uint256 experienceId) internal {
        Experience storage exp = _experiences[experienceId];

        if (exp.studentSigned && exp.companySigned && exp.universitySigned) {
            exp.status = Status.Completed;

            // Mint soulbound NFT
            ProofNFT.ExperienceData memory nftData = ProofNFT.ExperienceData({
                student: exp.student,
                company: exp.company,
                university: exp.university,
                title: exp.title,
                totalHours: exp.totalHours,
                timestamp: block.timestamp,
                ipfsHash: ""
            });

            uint256 tokenId = proofNFT.mint(exp.student, nftData);

            // Mint $PROOF tokens to student
            proofToken.mint(exp.student, REWARD_AMOUNT);

            emit ExperienceCompleted(experienceId, exp.student, tokenId);
        }
    }
}
