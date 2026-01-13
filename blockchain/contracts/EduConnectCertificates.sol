// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EduConnectCertificates {
    struct Certificate {
        bytes32 contentHash;
        address issuer;
        uint256 timestamp;
        bool isValid;
    }

    // Mapping from Unique Certificate ID (Chain Agnostic ID) to Certificate Data
    mapping(string => Certificate) public certificates;

    event CertificateIssued(string indexed certId, bytes32 indexed contentHash, address indexed issuer);
    event CertificateRevoked(string indexed certId);

    function storeCertificateHash(string memory certId, string memory hashStr) public {
        require(certificates[certId].timestamp == 0, "Certificate already exists");
        
        bytes32 contentHash = keccak256(abi.encodePacked(hashStr));
        
        certificates[certId] = Certificate({
            contentHash: contentHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(certId, contentHash, msg.sender);
    }

    function verify(string memory certId, string memory hashStr) public view returns (bool) {
        Certificate memory cert = certificates[certId];
        if (!cert.isValid) return false;
        
        // Recompute hash to verify integrity matches what was claimed
        bytes32 inputHash = keccak256(abi.encodePacked(hashStr));
        return cert.contentHash == inputHash;
    }

    function revoke(string memory certId) public {
        require(certificates[certId].issuer == msg.sender, "Only issuer can revoke");
        certificates[certId].isValid = false;
        emit CertificateRevoked(certId);
    }
}
