// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RelayEscrow.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address keeperHubSigner = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy without the mock USDC address
        RelayEscrow escrow = new RelayEscrow(keeperHubSigner);

        vm.stopBroadcast();
        console.log("RelayEscrow (Native ETH) deployed successfully!");
        console.log("New Vault Address:", address(escrow));
    }
}
