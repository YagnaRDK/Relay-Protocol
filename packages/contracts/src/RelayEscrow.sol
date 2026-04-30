// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @dev Minimal interface for USDC transfers
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract RelayEscrow {
    IERC20 public usdcToken;
    address public keeperHubSigner; // The trusted oracle (KeeperHub) that verifies tasks

    struct Task {
        uint256 amount;
        address requester;
        address worker;
        bool isLocked;
    }

    // Mapping of Task IDs (converted to bytes32 for gas efficiency) to Task details
    mapping(bytes32 => Task) public tasks;

    event FundsLocked(
        bytes32 indexed taskId,
        address indexed requester,
        uint256 amount
    );
    event FundsReleased(
        bytes32 indexed taskId,
        address indexed worker,
        uint256 amount
    );
    event FundsRefunded(
        bytes32 indexed taskId,
        address indexed requester,
        uint256 amount
    );

    constructor(address _usdcToken, address _keeperHubSigner) {
        usdcToken = IERC20(_usdcToken);
        keeperHubSigner = _keeperHubSigner;
    }

    /// @notice Locks the bounty into the contract
    function lockFunds(bytes32 taskId, uint256 amount) external {
        require(!tasks[taskId].isLocked, "Task already locked");
        require(amount > 0, "Bounty must be greater than 0");

        // Transfer USDC from Requester to this contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        tasks[taskId] = Task({
            amount: amount,
            requester: msg.sender,
            worker: address(0),
            isLocked: true
        });

        emit FundsLocked(taskId, msg.sender, amount);
    }

    /// @notice Releases funds to the worker. ONLY KeeperHub can call this after verifying the Zod schema.
    function releaseFunds(bytes32 taskId, address worker) external {
        require(
            msg.sender == keeperHubSigner,
            "Only KeeperHub can authorize release"
        );
        require(tasks[taskId].isLocked, "Task not locked or already settled");

        uint256 amount = tasks[taskId].amount;
        tasks[taskId].isLocked = false;
        tasks[taskId].worker = worker;

        require(usdcToken.transfer(worker, amount), "Transfer failed");

        emit FundsReleased(taskId, worker, amount);
    }

    /// @notice Refunds the requester if the task fails or times out
    function refundRequester(bytes32 taskId) external {
        require(
            msg.sender == keeperHubSigner,
            "Only KeeperHub can authorize refund"
        );
        require(tasks[taskId].isLocked, "Task not locked or already settled");

        uint256 amount = tasks[taskId].amount;
        address requester = tasks[taskId].requester;
        tasks[taskId].isLocked = false;

        require(usdcToken.transfer(requester, amount), "Transfer failed");

        emit FundsRefunded(taskId, requester, amount);
    }
}
