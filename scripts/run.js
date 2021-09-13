async function main() {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.005")});
    await waveContract.deployed();
    console.log("Contract adddress ", waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    let waveTxn = await waveContract.wave("Wave #1");
    await waveTxn.wait(); //for mining

    waveTxn = await waveContract.wave("Wave #2");
    await waveTxn.wait(); //for mining

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    let allWaves = await waveContract.getAllWaves();
    //console.log(allWaves);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run scripts/run.js