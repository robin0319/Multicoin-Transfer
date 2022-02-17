const Solana = require("@solana/web3.js");
const WAValidator = require('multicoin-address-validator');
const bip39 = require("bip39");
const nacl = require("tweetnacl");
const axios = require("axios");

function generateAccount(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic); // prefer async mnemonicToSeed
    const keyPair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32));
    return new Solana.Account(keyPair.secretKey);
}

function createConnection(url = Solana.clusterApiUrl('mainnet-beta')) {
    return new Solana.Connection(url);
}

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        const mnemonic = bip39.generateMnemonic();
        let account = generateAccount(mnemonic);
        if (account) {
            resolve({
                success : true,
                publicKey : account.publicKey.toString(),
                mnemonic : mnemonic,
            })
        } else {
            resolve({
                success : false,
                msg : "Solana Server Error"
            })
        }
    })
}

// Get balance of the SOL from the address
const getBalance = (publicKey) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(publicKey, "sol")) {
            
            async function Balance() {
                const connection = createConnection();
                let pubKey = new Solana.PublicKey(publicKey);

                await connection.getBalance(pubKey)
                .then(balance => {
                    resolve({
                        success : true,
                        balance : balance / 1e9
                    })
                })
                .catch(err => {
                    resolve({
                        success : false,
                        msg : "Solana Server Error"
                    })
                });
            }
    
            Balance();
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

// Transfer SOL from one to another wallet
const transferSol = (mnemonic, receiverPublicKey, amount) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(receiverPublicKey, "sol")) {
            const connection = createConnection();
            let sender = generateAccount(mnemonic);
            let receiver = new Solana.PublicKey(receiverPublicKey);
            let coinAmount = amount * 1e9;

            async function sendTransaction(connection, recipientPublicKey, recipientAmount, payer) {
                let balance = await connection.getBalance(payer.publicKey)
                if (amount >= balance / 1e9) {
                    resolve({
                        success : false,
                        msg : "Your balance is not enough"
                    })
                    return;
                }
                const transaction = new Solana.Transaction().add(
                    Solana.SystemProgram.transfer({
                        fromPubkey: payer.publicKey,
                        toPubkey: recipientPublicKey,
                        lamports: recipientAmount,
                    }),
                );
                
                await Solana.sendAndConfirmTransaction(connection, transaction, [payer])
                .then(signature => {
                    resolve({
                        success : true,
                        transactionHash : signature
                    })
                })
                .catch(err => {
                    console.log(err)
                    resolve({
                        success : false,
                        msg : "Solana Server Error"
                    })
                });
                
            }
    
            sendTransaction(connection, receiver, coinAmount, sender);
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

// Get the gas price of the sol
const getGasPriceSol = () => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'https://api.mainnet-beta.solana.com',
            data: {
                "jsonrpc":"2.0",
                "id":1, 
                "method":"getFees"
            }
        }).then((result) => {
            let lamportsPerSignature = result.data.result.value.feeCalculator.lamportsPerSignature;
            return resolve({
                success : true,
                estimateGasPrice : lamportsPerSignature/Solana.LAMPORTS_PER_SOL
            })
        }).catch((err) => {
            console.log(err);
            return resolve({
                success : false.valueOf,
                msg : "Solana Server Error"
            })
        });

    });
};

module.exports = {
    walletGeneration,
    getBalance,
    transferSol,
    getGasPriceSol,
}