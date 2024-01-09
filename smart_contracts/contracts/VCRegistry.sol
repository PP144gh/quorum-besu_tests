// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VCRegistry {
    address public owner;

    enum VCStatus { Inactive, Active, Revoked }

    // Struct to represent a Verified Credential (VC) entry
    struct VCEntry {
        bool isValid;     // Status of the VC (Active or Revoked)
        uint256 timestamp;   // Timestamp when the VC was registered or revoked
        string vcData;       // Additional data associated with the VC
    }

    // Mapping to store VC entries by a unique identifier (e.g., VC hash)
    mapping(bytes32 => VCEntry) public registeredVCs;

    // Event emitted when a VC is successfully registered or revoked
    event VCRegistered(bytes32 indexed vcHash, uint8 status, uint256 timestamp);
    event VCRevoked(bytes32 indexed vcHash, uint256 timestamp);

    // Modifier to ensure only the owner can perform certain operations
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Function to register a new VC
    function registerVC(bytes32 _vcHash, string memory _vcData) external {
        //require(registeredVCs[_vcHash].isValid == true, "VC already exists");

        VCEntry memory newEntry = VCEntry({
            isValid: true,
            timestamp: block.timestamp,
            vcData: _vcData
        });

        registeredVCs[_vcHash] = newEntry;

        emit VCRegistered(_vcHash, uint8(VCStatus.Active), block.timestamp);
    }

    // Function to check the status of a VC
    function getVCStatus(bytes32 _vcHash) external view returns (bool status, uint256 timestamp) {
        VCEntry memory entry = registeredVCs[_vcHash];
        return (entry.isValid, entry.timestamp);
    }

    // Function to revoke a VC
    function revokeVC(bytes32 _vcHash) external {
        require(registeredVCs[_vcHash].isValid == true, "VC is not active");

        registeredVCs[_vcHash].isValid = false;
        registeredVCs[_vcHash].timestamp = block.timestamp;

        emit VCRevoked(_vcHash, block.timestamp);
    }

    // Function to get VC data
    function getVCData(bytes32 _vcHash) external view returns (string memory vcData) {
        VCEntry memory entry = registeredVCs[_vcHash];
        //require(entry.isValid != false, "VC not found or inactive");
        return entry.vcData;
    }

    // Function to transfer ownership of the contract
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
