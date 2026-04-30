// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RelayEscrow.sol";

contract Deploy is Script {
    function run() external {
        // 1. Load the private key from your .env file
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 2. Define testnet addresses for Unichain Sepolia
        // (For this hackathon, we'll use placeholder testnet addresses.
        address mockUSDC = 0x1111111111111111111111111111111111111111;
        address keeperHubSigner = 0x2222222222222222222222222222222222222222;

        // 3. Start signing transactions with your wallet
        vm.startBroadcast(deployerPrivateKey);

        // 4. Deploy the actual vault to the blockchain
        RelayEscrow escrow = new RelayEscrow(mockUSDC, keeperHubSigner);

        // 5. Stop signing
        vm.stopBroadcast();

        // 6. Print the address so we can use it in our TypeScript SDK!
        console.log("RelayEscrow deployed successfully!");
        console.log("Vault Address:", address(escrow));
    }
}
