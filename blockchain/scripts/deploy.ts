import { ethers } from "hardhat";

async function main() {
    const EduConnect = await ethers.getContractFactory("EduConnectCertificates");
    const contract = await EduConnect.deploy();

    await contract.waitForDeployment();

    console.log("EduConnectCertificates deployed to:", await contract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
