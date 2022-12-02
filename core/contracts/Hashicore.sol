// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@hyperlane-xyz/core/interfaces/IMailbox.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Hashicore is Ownable {

    IMailbox mailbox;
    address public lastSender;
    string public lastMessage;
    mapping(uint32 => bool) public domains;
    mapping(address => bool) public inboxes;

    modifier onlyEthereumInbox(uint32 origin) {
        require(domains[origin] && inboxes[msg.sender]);
        _;    
    }

    event SentMessage(uint32 destinationDomain, address recipient, string message);
    event ReceivedMessage(uint32 origin, address sender, bytes message);

    constructor(address _mailbox) {
        mailbox = IMailbox(_mailbox);
    }

    function toggleDomain(uint32 _domain, bool enabled) external onlyOwner {
        domains[_domain] = enabled;
    }

    function toggleInboxes(address _inbox, bool enabled) external onlyOwner {
        inboxes[_inbox] = enabled;
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
    return address(uint160(uint256(_buf)));
}

    function initiateBridge(
        uint32 _destinationDomain,
        address _recipient,
        string calldata _message
    ) external {
        
        mailbox.dispatch(_destinationDomain, addressToBytes32(_recipient), bytes(_message));
        emit SentMessage(_destinationDomain, _recipient, _message);

    }

     function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external onlyEthereumInbox(_origin) {
      lastSender = bytes32ToAddress(_sender);
      lastMessage = string(_message);
      emit ReceivedMessage(_origin, bytes32ToAddress(_sender), _message);
    }

}