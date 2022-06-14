import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        alert("Đã kết nối thành công!!!")
        document.getElementById("connectButton").innerHTML = "Đã kết nối"
        document.getElementById("connectButton").disabled = true
    } else {
        console.log("Not install metamask yet!")
        document.getElementById("connectButton").innerHTML = "Cài đặt MetaMask"
    }
}

// fund function
const listenForTransactionMine = (transactionResponse, provider) => {
    console.log(`Mining ${transactionResponse.hash}...`)
    // listem for this transaction tp finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionRecepit) => {
            console.log(
                `Completed with ${transactionRecepit.confirmations} confirmations`
            )
            resolve()
        })
    })
}

const fund = async () => {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider/ connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer/wallet
        const signer = provider.getSigner()
        console.log(signer)
        // contract & ABI//address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionresponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // wait for this TX to finish
            await listenForTransactionMine(transactionresponse, provider)
            console.log("Đã hoàn thành")
        } catch (err) {
            console.log(err)
        }
    }
}

// getBalance function
const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        const balanceField = document.createElement("h3")
        balanceField.innerHTML = ethers.utils.formatEther(balance)
        document.body.appendChild(balanceField)
    }
}

// withdraw function
const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // contract & ABI//address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (err) {
            console.log(err)
        }
    }
}

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)
