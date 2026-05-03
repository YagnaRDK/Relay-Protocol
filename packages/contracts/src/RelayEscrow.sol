// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RelayEscrow {
    address public keeperHubSigner;

    struct Task {
        uint256 amount;
        address requester;
        address worker;
        bool isLocked;
    }

    mapping(bytes32 => Task) public tasks;

    event FundsLocked(bytes32 indexed taskId, address indexed requester, uint256 amount);
    event FundsReleased(bytes32 indexed taskId, address indexed worker, uint256 amount);
    event FundsRefunded(bytes32 indexed taskId, address indexed requester, uint256 amount);

    constructor(address _keeperHubSigner) {
        keeperHubSigner = _keeperHubSigner;
    }

    /// @notice Locks native ETH into the contract
    function lockFunds(bytes32 taskId) external payable {
        require(!tasks[taskId].isLocked, "Task already locked");
        require(msg.value > 0, "Bounty must be greater than 0");

        tasks[taskId] = Task({
            amount: msg.value,
            requester: msg.sender,
            worker: address(0),
            isLocked: true
        });

        emit FundsLocked(taskId, msg.sender, msg.value);
    }

    /// @notice Releases funds to the worker
    function releaseFunds(bytes32 taskId, address payable worker) external {
        require(msg.sender == keeperHubSigner, "Only KeeperHub can authorize release");
        require(tasks[taskId].isLocked, "Task not locked or already settled");

        uint256 amount = tasks[taskId].amount;
        tasks[taskId].isLocked = false;
        tasks[taskId].worker = worker;

        (bool success, ) = worker.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(taskId, worker, amount);
    }

    /// @notice Refunds the requester
    function refundRequester(bytes32 taskId) external {
        require(msg.sender == keeperHubSigner, "Only KeeperHub can authorize refund");
        require(tasks[taskId].isLocked, "Task not locked or already settled");

        uint256 amount = tasks[taskId].amount;
        address payable requester = payable(tasks[taskId].requester);
        tasks[taskId].isLocked = false;

        (bool success, ) = requester.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsRefunded(taskId, requester, amount);
    }
}