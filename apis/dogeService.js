const WAValidator = require('multicoin-address-validator');
const CoinKey = require("coinkey");
const coinInfo = require("coininfo");
const  balance = require('crypto-balances');

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        var dogeInfo = coinInfo('DOGE').versions;
        var wallet = new CoinKey.createRandom(dogeInfo);
        if (wallet) {
            resolve({
                success : true,
                address : wallet.publicAddress,
                privateKey : wallet.privateWif,
                privateKeyHex : wallet.privateKey.toString('hex'),
            })
        } else {
            resolve({
                success : false,
                msg : "Doge Coin Server Error"
            })
        }
    })
}

// Get the balance according to the address
const getBalance = (address) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'doge')) {
            balance(address, function(error, result) {
                if(error) {
                    resolve({
                        success : false,
                        msg : "Doge Coin Server Error"
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

module.exports = {
    walletGeneration,
    getBalance,
}