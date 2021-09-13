
async function main() {
    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({value: ethers.utils.parseEther("0.001")});
    await waveContract.deployed();
    console.log("WavePortal address = ", waveContract.address);
}
// 0xf0E80fFe57DeF0ac5b7F246c1bd4dbBc6A5652d7
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run scripts/deploy.js --network rinkeby
// change waveportal address in app.js 
// change that waveportal.json abi file