var web3;
var contractAddress = "0x34485b9aA40fB4c3130dD18D4AD205777Fa00696"; // Replace this with your deployed contract address
var contract;
var account;
var depositedAmount = 0;
var withdrawnAmount = 0;

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            account = (await web3.eth.getAccounts())[0];
            contract = new web3.eth.Contract(abi, contractAddress);
            updateBalance();
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    } else {
        alert("Please install and connect MetaMask to use this application.");
    }
}

async function createAccount() {
    const name = document.getElementById("name").value;
    if (name.trim() === "") {
        alert("Please enter your name.");
        return;
    }

    try {
        await contract.methods.createAccount(name).send({ from: account });
        alert("Account created successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to create an account.");
    }
}

async function updateBalance() {
    try {
        const balance = await contract.methods.getBalance().call({ from: account });
        const remainingBalance = balance - withdrawnAmount;
        document.getElementById("balance").textContent = remainingBalance;
        document.getElementById("depositedAmount").textContent = depositedAmount;
        document.getElementById("withdrawnAmount").textContent = withdrawnAmount;
    } catch (error) {
        console.error(error);
    }
}

async function deposit() {
    const amount = document.getElementById("amount").value;
    if (!isNaN(amount) && amount > 0) {
        try {
            await contract.methods.deposit(amount).send({ from: account });
            depositedAmount += parseFloat(amount);
            setTimeout(updateBalance, 2000);
        } catch (error) {
            console.error(error);
        }
    } else {
        alert("Please enter a valid amount to deposit.");
    }
}

async function withdraw() {
    const amount = document.getElementById("amount").value;
    if (!isNaN(amount) && amount > 0) {
        try {
            await contract.methods.withdraw(amount).send({ from: account });
            withdrawnAmount += parseFloat(amount);
            setTimeout(updateBalance, 2000);
        } catch (error) {
            console.error(error);
        }
    } else {
        alert("Please enter a valid amount to withdraw.");
    }
}

var abi = [
    // ... Your contract's ABI ...
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "createAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "_amt",
                "type": "int256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "_amt",
                "type": "int256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Automatically initialize the connection when the page loads
window.addEventListener('load', async () => {
    await init();
    
    // Attach event listeners
    document.getElementById("create").addEventListener("click", createAccount);
    document.getElementById("deposit").addEventListener("click", deposit);
    document.getElementById("withdraw").addEventListener("click", withdraw);
});


