const WAValidator = require('multicoin-address-validator');
const xrpl = require("xrpl")
const client = new xrpl.Client('wss://s1.ripple.com');
const RippleAPI = require('ripple-lib').RippleAPI;
const api       = new RippleAPI({ server: 'wss://s1.ripple.com' }) 
 
// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        async function main() {
            const wallet = xrpl.Wallet.generate()
            if (wallet) {
                resolve({
                    success : true,
                    publickKey : wallet.publicKey,
                    privateKey : wallet.privateKey,
                    address : wallet.classicAddress,
                    seed : wallet.seed
                })
            } else {
                resolve({
                    success : false,
                    msg : "XRP Server Error"
                })
            }
        }
          
        main()
    })
}

// Get balance of the XRP from the address
const getBalance = (address) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, "xrp")) {
            async function Balance() {
                await client.connect();
                await client.request({
                    "command": "account_info",
                    "account": address,
                    "ledger_index": "validated"
                }).then(response => {
                    resolve({
                        success : true,
                        balance : response.result.account_data.Balance / 1e6
                    })
                }).catch(err => {
                    console.log(err)
                    resolve({
                        success : false,
                        msg : "XRP Server Error"
                    })
                })
            }
            
            Balance()
        } else {
            resolve({
                success : false,
                msg : "Wallet Addres Error"
            })
        }
    })
}

// Transfer XRP from one to another wallet
const transferXRP = (seed, toAddress, amount) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(toAddress, "xrp")) {
            async function Transfer() {
                await client.connect();
                try {
                    const wallet = xrpl.Wallet.fromSeed(seed);
                    const prepared = await client.autofill({
                        "TransactionType": "Payment",
                        "Account": wallet.address,
                        "Amount": xrpl.xrpToDrops(amount),
                        "Destination": toAddress
                    });
                    const signed = wallet.sign(prepared);
                    if (signed) {
                        resolve({
                            success : true,
                            hash : signed.hash
                        })
                    }
                } catch (error) {
                    resolve({
                        success : false,
                        msg : "XRP Server Error"
                    })             
                }
            }
            
            Transfer();
        } else {
            resolve({
                success : false,
                msg : "Receiver Wallet Addres Error"
            })
        }
    })
}

// Get the gas price of the xrp
const getGasPriceXrp = () => {
    return new Promise((resolve, reject) => {
        api.connect().then(() => {
            api.getServerInfo().then(function (result) {
                return resolve({
                    success : true,
                    estimateGasPrice : result.validatedLedger.baseFeeXRP
                })
            })
        }).catch((err) => {
            return resolve({
                success : false,
                msg : "XRP Server Error"
            })
        })
    });
};

module.exports = {
    walletGeneration,
    getBalance,
    transferXRP,
    getGasPriceXrp,
}