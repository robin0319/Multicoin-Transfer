const Web3 = require("web3");
const Constant = require('../config/Constant');
const WAValidator = require('multicoin-address-validator');
const { create, all } = require('mathjs');
const config = {
  number: 'BigNumber',
  precision: 20
}
const math = create(all, config)
const Web3Client = new Web3(new Web3.providers.HttpProvider(Constant.MEHH.PUBLIC_RPC));

const minABI = [
    // balanceOf
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    //transfer
    {
        constant: false,
        inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
        name: "transfer",
        outputs: [{ name: '', type: "bool"}],
        type: "function"
    }
];

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        var newWallet = Web3Client.eth.accounts.create();
        if (newWallet && newWallet.address !='' && newWallet.privateKey != '') {
            resolve({success : true, address : newWallet.address, privateKey : newWallet.privateKey})
        } else {
            resolve({success : false, msg : "Mehhc Server Error"});
        }
    })
}

// Get the balance according to coin name from address
const getBalance = (address, coin) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'eth')) {
            let tokenAddress = "";

            if (coin.toUpperCase() == "CO") {
                tokenAddress = Constant.MEHH.TOKEN_ADDRESSES.CO;
            } else if (coin.toUpperCase() == "USDCO") {
                tokenAddress = Constant.MEHH.TOKEN_ADDRESSES.USDCO;
            } 
            
            if (tokenAddress != "") {
                const walletAddress = address;
            
                const contract = new Web3Client.eth.Contract(minABI, tokenAddress);

                async function getBalance() {
                    const result = await contract.methods.balanceOf(walletAddress).call();

                    let format = Web3Client.utils.fromWei(result, 'mwei');

                    if (coin.toUpperCase() == "CO") {
                        format /= 100;
                    }
                    

                    resolve({success : true, balance : format});
                }
                
                getBalance();
            } else {
                resolve({success : false, msg : "Coin Name Error"});
            }
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    });
};

// Get the balance of the mehhc from address
const getBalanceMehhc = (address) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'eth')) {
            Web3Client.eth.getBalance(address, async (err, result) => {
                if(err) {
                    resolve({success : false, msg : "Mehhc  Server Error"});
                }
                const format = Web3Client.utils.fromWei(result);
                resolve({success : true, balance : format});
            });
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    });
};

// Transfer token from one to another wallet
const tokenTransfer = (fromAddress, toAddress, coin, amount, privateKey) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(fromAddress, 'eth') && WAValidator.validate(toAddress, 'eth')) {
            let tokenAddress = "";
            let decimal = "";

            if (coin.toUpperCase() == "CO") {
                tokenAddress = Constant.MEHH.TOKEN_ADDRESSES.CO;
                decimal = '100000000';
            } else if (coin.toUpperCase() == "USDCO") {
                tokenAddress = Constant.MEHH.TOKEN_ADDRESSES.USDCO;
                decimal = '1000000'
            }
            
            if (tokenAddress != "") {
                (async () => {
                    try {

                        let contract = new Web3Client.eth.Contract(minABI, tokenAddress, {from: fromAddress});
                        var volume = math.multiply(math.bignumber(amount), math.bignumber(decimal));
                        var formattedAmount = math.format(volume, {notation: 'fixed'}).toString();
                        Web3Client.eth.accounts.wallet.add(privateKey);

                        await contract.methods.transfer(toAddress, formattedAmount).send({ 
                            from: fromAddress,
                            gasPrice : Web3Client.utils.toHex(20 * 1e9),
                            gasLimit : Web3Client.utils.toHex(210000)
                        }).then((data) =>{
                            resolve({success : true, transactionHash : data.events[0].transactionHash});
                        })
                        .catch(err => {
                            resolve({success : false, msg : "Your balance is not enough"});
                        });
                    } catch (e) {
                    resolve({success : false, msg : "Mehh Server Error"});
                    }
                })()
            } else {
                resolve({success : false, msg : "Coin Name Error"});
            }
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    })
}

// Transfer MEHHC from one to another wallet
const trasnferMehhc = (fromAddress, toAddress, amount, privateKey) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(fromAddress, 'eth') && WAValidator.validate(toAddress, 'eth')) {
            async function TrasnferMehhc() {
                Web3Client.eth.getBalance(fromAddress, async (err, result) => {
                    if (err) {
                        return resolve({
                            success : false,
                            msg : "Mehhc Server Error."
                        })
                    }
                    let balance = Web3Client.utils.fromWei(result, "ether");

                    if(balance < amount) {
                        return resolve({
                            success : false,
                            msg : "Your Balance is not enough."
                        })
                    }

                    let privaKey = privateKey.split('0x')[1];

                    const createTransaction = await Web3Client.eth.accounts.signTransaction(
                        {
                            from: fromAddress,
                            to: toAddress,
                            value: Web3Client.utils.toWei(amount.toString(), 'ether'),
                            gas: '21000',
                        },
                        privaKey
                     );
                     
                     await Web3Client.eth.sendSignedTransaction(
                        createTransaction.rawTransaction
                     ).then(createReceipt => {
                        if (createReceipt) {
                            return resolve({
                                success : true,
                                transactionHash : createReceipt.transactionHash,
                            })
                        } else {
                            return resolve({
                                success : false,
                                msg : "Mehhc Server Error"
                            })
                        }
                     }).catch(err => {
                        return resolve({
                            success : false,
                            msg : "Mehhc Server Error"
                        })
                     })
                     
                });
            }

            TrasnferMehhc();
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    })
}

// Get the gas price of the mehhc
const getGasPriceMehhc = () => {
    return new Promise((resolve, reject) => {
        Web3Client.eth.getGasPrice().then((result)=> {
            return resolve({
                success : true,
                gasPrice : Web3Client.utils.fromWei(result,'ether') * 21000
            })
        })
    });
};

// Get the gas price according token
const getGasPrice = (fromAddress, toAddress, coin, amount) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(fromAddress, 'eth') && WAValidator.validate(toAddress, 'eth')) {
            let tokenAddress = "";

            if (coin.toUpperCase() == "CO") {
                tokenAddress = Constant.MEHH.TOKEN_ADDRESSES.CO;
                decimal = '100000000';
            } else if (coin.toUpperCase() == "USDCO") {
                tokenAddress = Constant.MEHH.TOKEN_ADDRESSES.USDCO;
                decimal = '1000000'
            }
            
            if (tokenAddress != "") {
                (async () => {
                    try {

                        let contract = new Web3Client.eth.Contract(minABI, tokenAddress, {from: fromAddress});
                        let tokenAmount = Web3Client.utils.toWei(amount.toString(), 'ether');
                        await Web3Client.eth.estimateGas({
                            "value": '0x0', // Only tokens
                            "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
                            "from": fromAddress,
                            "to": toAddress
                        }).then((result) => {
                            return resolve({
                                success : true,
                                estimateGasPrice : result/100000000
                            })
                        });
                    } catch (e) {
                    resolve({success : false, msg : "Mehhc Server Error"});
                    }
                })()
            } else {
                resolve({success : false, msg : "Coin Name Error"});
            }
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    })
}

module.exports = {
    walletGeneration,
    getBalance,
    getBalanceMehhc,
    tokenTransfer,
    trasnferMehhc,
    getGasPriceMehhc,
    getGasPrice
}