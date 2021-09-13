import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

export default function App() {

  //State variable to store user's public wallet address
  const [currAccount, setCurrentAccount] = React.useState("")
  const contractAddress = "0xf0E80fFe57DeF0ac5b7F246c1bd4dbBc6A5652d7"
  const contractABI = abi.abi

  const checkWalletConnection = () => {
  //make sure we have metamask
  const { ethereum } = window;
    if(!ethereum) {
      console.log("Make sure to use Metamask!")
      return
    } else{
      console.log("We have ethereum object:", ethereum)
    }

    //Check authorization
    ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      //make sure only one account
      if(accounts.length !== 0) {
        //grab first account only
        const account = accounts[0];
        console.log("Found an authorized account: ", account)

        //store address
        setCurrentAccount(account);
        getAllWaves();
      } else{
        console.log("No authorized account found")
      }
    })
  }

  const connectWallet = () => {
    const {ethereum} = window;
    if(!ethereum){
      alert("Make sure to use Metamask!")
    }

    ethereum.request({ method: 'eth_requestAccounts'}).then(accounts => {
      console.log("Connected ", accounts[0])
      setCurrentAccount(accounts[0])
    })
    .catch(err => console.log(err));
  }

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("Retrieved total wave count: ", count.toNumber())
    //value from user
    var userInput = document.getElementById('userInput').value;
    console.log("User input: ", userInput);

    const waveTxn = await waveportalContract.wave(userInput.toString(),{gasLimit: 300000});
    console.log("Mining...", waveTxn.hash)
    await waveTxn.wait()
    console.log("Mined -- ", waveTxn.hash)

    count = await waveportalContract.getTotalWaves()
    console.log("Retrieved total wave count: ", count.toNumber())
  }

  const [allWaves, setAllWaves] = React.useState([])
  async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves()
 
    let wavesCleaned = []
    waves.forEach(wave => {
      console.log("wave", wave)
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
    })
    console.log("cleaned", wavesCleaned)
    setAllWaves(wavesCleaned)

    waveportalContract.on("NewWave", (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message)
      setAllWaves(oldArray => [...oldArray, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      }])
    })
  }
  
  React.useEffect(() =>{
    checkWalletConnection()
  }, []) 


  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        🙂 Hi there!
        </div>

        <div className="bio">
        My name is Carson. I've setup a smart contract to collect responses from people like you to the question of what makes them happy.
        It can be anything from spending time with your significant other to doing jiu-jitsu. Whatever it is, I want to know and I want you to post it to this smart contract. To do that, connect your Ethereum wallet, take a deep breath, then ask yourself...
        </div>

        {currAccount ? null : (
        <button className="walletButton" onClick={connectWallet}>
          Connect Metamask
        </button>
        )}

        
        <input type="text" id="userInput" className="form" placeholder="What makes you happy?"></input>
        
        <button className="waveButton" onClick={wave}>
          Submit!
        </button>
        

        {allWaves.map((wave, index) => {
          return(
            <div style = {{backgroundColor: "Oldlace", marginTop: "16px", padding: "8px"}}>
              <div>"{wave.message}"</div>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
            </div>
          )
        })}
      </div>
    </div>
  );

}
