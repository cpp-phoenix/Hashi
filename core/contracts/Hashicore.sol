// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@hyperlane-xyz/core/interfaces/IMailbox.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./Hashiswap.sol";
import "./Seriality.sol";

/**
 * @title Seriality
 * @dev The Seriality contract is the main interface for serializing data using the TypeToBytes, BytesToType and SizeOf
 * @author pouladzade@gmail.com
 */

interface IHashipool {
    function useLiquidity(uint amount, IERC20 token, address transferTo) external payable;
}

contract Hashicore is Ownable, Seriality{

    IMailbox mailbox;
    Hashiswap hashiswap;
    IHashipool hashipool;
    address public lastSender;
    string public lastMessage;
    uint public sourceChainId = 80001;
    mapping(uint32 => bool) public domains;
    mapping(address => bool) public inboxes;
    struct ChainObject {
        uint32 domain;
        address outbox;
    }
    mapping(uint => ChainObject) public chainMapping;

    modifier onlyEthereumInbox(uint32 origin) {
        require(domains[origin] && inboxes[msg.sender]);
        _;    
    }

    event SentMessage(uint32 destinationDomain, address recipient, bytes message);
    event ReceivedMessage(uint32 origin, address sender, bytes message);

    constructor(address _mailbox, address _hashiswap, address _hashipool) {
        mailbox = IMailbox(_mailbox);
        hashiswap = Hashiswap(_hashiswap);
        hashipool = IHashipool(_hashipool);
    }

    function toggleDomain(uint32 _domain, bool enabled) external onlyOwner {
        domains[_domain] = enabled;
    }

    function toggleInboxes(address _inbox, bool enabled) external onlyOwner {
        inboxes[_inbox] = enabled;
    }

    function addDomain(uint chaindId, uint32 domain, address outbox) external onlyOwner {
        chainMapping[chaindId] = ChainObject(domain, outbox);
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    // To send message to Hyperlane
    function sendMessage(
        uint32 _destinationDomain,
        address _recipient,
        bytes memory _message
    ) private {
        mailbox.dispatch(_destinationDomain, addressToBytes32(_recipient), _message);
        emit SentMessage(_destinationDomain, _recipient, _message);
    }

    // To receive the message from Hyperlane
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) public {
        uint offset = 56;
        uint amount = bytesToUint8(offset, _message);
        offset -= sizeOfAddress();
        address multiChainToken = bytesToAddress(offset, _message);
        offset -= sizeOfAddress();
        address msgSender = bytesToAddress(offset, _message);
        hashipool.useLiquidity(amount, IERC20(multiChainToken), msgSender);

        emit ReceivedMessage(_origin, bytes32ToAddress(_sender), _message);
    }

    function initiateBridge(uint32 domain, IERC20 multiChainToken  ,IERC20 sellToken, IERC20 buyToken, address spender, uint amount, address payable swapTarget, bytes calldata swapCallData) public payable {

        uint256 boughtAmount = hashiswap.executeSingleChainSwap(sellToken, buyToken, spender, amount, swapTarget, swapCallData, msg.sender);
        
        bytes memory message = new bytes(56);
        uint offset = 56;
        uintToBytes(offset, boughtAmount, message);
        offset -= sizeOfAddress();
        addressToBytes(offset, address(multiChainToken), message);
        offset -= sizeOfAddress();
        addressToBytes(offset, msg.sender, message);

        sendMessage(domain, msg.sender, message);
    }
}