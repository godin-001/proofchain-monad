const hre = require("hardhat");

async function main() {
  console.log("Deploying ProofChain contracts...\n");

  // 1. Deploy ProofToken
  const ProofToken = await hre.ethers.getContractFactory("ProofToken");
  const proofToken = await ProofToken.deploy();
  await proofToken.waitForDeployment();
  const tokenAddress = await proofToken.getAddress();
  console.log("ProofToken deployed to:", tokenAddress);

  // 2. Deploy ProofNFT
  const ProofNFT = await hre.ethers.getContractFactory("ProofNFT");
  const proofNFT = await ProofNFT.deploy();
  await proofNFT.waitForDeployment();
  const nftAddress = await proofNFT.getAddress();
  console.log("ProofNFT deployed to:", nftAddress);

  // 3. Deploy ProofRegistry with token and NFT addresses
  const ProofRegistry = await hre.ethers.getContractFactory("ProofRegistry");
  const proofRegistry = await ProofRegistry.deploy(tokenAddress, nftAddress);
  await proofRegistry.waitForDeployment();
  const registryAddress = await proofRegistry.getAddress();
  console.log("ProofRegistry deployed to:", registryAddress);

  // 4. Set registry as minter on ProofToken
  const setMinterTx = await proofToken.setMinter(registryAddress);
  await setMinterTx.wait();
  console.log("\nProofToken minter set to ProofRegistry");

  // 5. Set registry on ProofNFT
  const setRegistryTx = await proofNFT.setRegistry(registryAddress);
  await setRegistryTx.wait();
  console.log("ProofNFT registry set to ProofRegistry");

  console.log("\n--- Deployment Summary ---");
  console.log("ProofToken:    ", tokenAddress);
  console.log("ProofNFT:      ", nftAddress);
  console.log("ProofRegistry: ", registryAddress);
  console.log("--------------------------\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
