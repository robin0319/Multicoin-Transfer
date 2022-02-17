const WAValidator = require('multicoin-address-validator');
const CoinKey = require("coinkey");
const coinInfo = require("coininfo");
const  balance = require('crypto-balances');
const CryptoAccount = require("send-crypto");

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        var btcInfo = coinInfo('BTC').versions;
        var wallet = new CoinKey.createRandom(btcInfo);
        if (wallet) {
            resolve({
                success : true,
                address : wallet.publicAddress,
                privateKey : wallet.privateKey.toString('hex'),
            })
        } else {
            resolve({
                success : false,
                msg : "BitCoin Server Error"
            })
        }
    })
}

//Get the balance according to the address
const getBalance = (address) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'btc')) {
            balance(address, function(error, result) {
                if(error) {
                    resolve({
                        success : false,
                        msg : "BitCoin Server Error"
                    })
                } else {
                    resolve({
                        success : true,
                        balance : result[0].quantity
                    })
                }
            });
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

// Transfer token from one to another wallet
const transferBtc = (fromAddress, toAddress, amount, privateKey) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(fromAddress, 'btc') && WAValidator.validate(toAddress, 'btc')) {
            async function Transfer() {
                const account = new CryptoAccount(privateKey);
                const address = await account.address("BTC");

                if (address != fromAddress) {
                    return resolve({
                        success : false,
                        msg : "Your wallet address is wrong"
                    })
                }

                const balance = await account.getBalance("BTC");

                if (balance < amount) {
                    return resolve({
                        success : false,
                        msg : "Your balance is not enough"
                    })
                }

                const txHash = await account.send(toAddress, amount, "BTC")
                                .on("transactionHash", console.log)
                                .on("confirmation", console.log);
                if (txHash) {
                    return resolve({
                        success : true,
                        txHash : txHash
                    })
                } else {
                    return resolve({
                        success : true,
                        msg : "Bitcoin Server Error"
                    })
                }
            }

            Transfer();
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

// Get gas price according to amount
const getGasPriceBtc = (amount) => {
    return new Promise((resolve, reject) => {
        if (amount >= 0.0005) {
            let gasPrice = amount * (0.000005 / 0.0005);
            return resolve({
                success : true,
                estimateGasPrice : gasPrice
            })
        } else {
            return resolve({
                success : false,
                msg : 'Amount is very small'
            })
        }
    })
}

module.exports = {
    walletGeneration,
    getBalance,
    transferBtc,
    getGasPriceBtc,
}