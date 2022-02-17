const BchWallet = require('minimal-slp-wallet/index');
const WAValidator = require('multicoin-address-validator');

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        async function generate() {
            const bchWallet = new BchWallet()
            await bchWallet.walletInfoPromise
            if (bchWallet.walletInfo && bchWallet.walletInfo.mnemonic != '' && bchWallet.walletInfo.cashAddress !='' 
            && bchWallet.walletInfo.legacyAddress != '' && bchWallet.walletInfo.privateKey != '') {
                resolve({
                    success : true,
                    mnemonic : bchWallet.walletInfo.mnemonic,
                    cashAddress : bchWallet.walletInfo.cashAddress,
                    legacyAddress : bchWallet.walletInfo.legacyAddress,
                    privateKey : bchWallet.walletInfo.privateKey
                });
            } else {
                resolve({
                    success : false,
                    msg : "BLOCKCHAIN SERVER ERROR"
                });
            }
        }
        generate();
    })
}

// Get balance of the bitcoin cash from the cashAddress
const getBalance = (cashAddress) => {
    return new Promise((resolve, reject) => {
       if (WAValidator.validate(cashAddress, "bch")) {
            const bchWallet = new BchWallet()
            async function Balance() {
                await bchWallet.getBalance(
                    'bitcoincash:' + cashAddress
                ).then(balance => {
                    resolve({
                        success : true,
                        balance : balance
                    })
                }).catch(err => {
                    resolve({
                        success : false,
                        msg : "BLOCKCHAIN SERVER ERROR"
                    })
                })
            }
            Balance();
       } else {
            resolve({
                success : false,
                msg : "CASH ADDRESS ERROR"
            })
       }
    })
}

// Transfer Bitcoin cash from one to another wallet
const transferBch = (mnemonic, toAddress, amount) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(toAddress, "bch")) {
            async function sendBch () {
                try {
                    const MNEMONIC = mnemonic;
                    const RECIEVER = toAddress;
                    const SATS_TO_SEND = amount * 1e8;
                
                    const bchWallet = new BchWallet(MNEMONIC)
                
                    await bchWallet.walletInfoPromise
                
                    const balance = await bchWallet.getBalance()
        
                    if (balance === 0) {
                            resolve({
                                success : false,
                                msg : "YOUR BALANCE IS NOT ENOUGH"
                            })
                            return
                    }
                    const outputs = []
                    
                    outputs.push({
                        address: RECIEVER,
                        amountSat: SATS_TO_SEND
                    })
                
                    await bchWallet.send(outputs)
                    .then(txId => {
                        resolve({
                            success : true,
                            txId : txId
                        })
                    })
                    .catch(err => {
                        resolve({
                            success : false,
                            msg : "BLOCKCHAIN SERVER ERROR"
                        })
                    })

                } catch (err) {
                    resolve({
                        success : false,
                        msg : "BLOCKCHAIN SERVER ERROR"
                    })
                }
            }
            sendBch()
        } else {
            resolve({
                success : false,
                msg : "CASH ADDRESS ERROR"
            })
        }
    })
}

// Get gas price according to amount
const getGasPriceBch = (amount) => {
    return new Promise((resolve, reject) => {
        if (amount >= 0.003) {
            let gasPrice = amount * (0.0000145 / 0.003);
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
    transferBch,
    getGasPriceBch,
}