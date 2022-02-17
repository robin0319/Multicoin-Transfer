const WAValidator = require('multicoin-address-validator');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring, encodeAddress  } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');
const { 
    mnemonicGenerate, 
    mnemonicValidate, 
    decodeAddress
} = require('@polkadot/util-crypto');
const balance = require('crypto-balances');
const BN = require('bn.js');

const keyring = new Keyring({type: 'sr25519'});

const connect = async () => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = new ApiPromise({ provider: wsProvider });
    return api.isReady;
};

const isValidAddressPolkadotAddress = (address) => {
    try {
        encodeAddress(
            isHex(address)
            ? hexToU8a(address)
            : decodeAddress(address)
        );
  
        return true;
    } catch (error) {
        console.log(error)
      return false;
    }
};

const createAccount = (mnemonic) => {
    mnemonic = mnemonic && mnemonicValidate(mnemonic) 
        ? mnemonic 
        : mnemonicGenerate();
    const account = keyring.addFromMnemonic(mnemonic);
    return { account, mnemonic };
}

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        const { account: account, mnemonic } = createAccount();
        if (account) {
            resolve({
                success : true,
                address : account.address,
                mnemonic : mnemonic
            })
        } else {
            resolve({
                success : false,
                msg : "Polk Adot Server Error"
            })
        }
    })
}

const getBalance = (address) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'dot')) {
            connect().then(async (api) => {
                if (api.isConnected) {
                    await api.derive.balances.all(address).then(balance => {
                        resolve({
                            success : true,
                            balance : balance.availableBalance.negative
                        })
                    }).catch(err => {
                        resolve({
                            success : false,
                            msg : "Polk Adot Server Error"
                        })
                    });
                } else {
                    resolve({
                        success : false,
                        msg : "Polk Adot Server Error"
                    })
                }
            })
            .catch((err) => {
                resolve({
                    success : false,
                    msg : "Polk Adot Server Error"
                })
            })
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

// Transfer Polkadot Coin from one to another wallet
const transferPolk = (mnemonic, toAddress, amount) => {
    return new Promise((resolve, reject) => {
        if (isValidAddressPolkadotAddress(toAddress)) {
            connect().then(async (api) => {
                if (api.isConnected) {
                    const { account: m1 } = createAccount(mnemonic);
                    const balance = await api.derive.balances.all(m1.address);
                    const available = balance.availableBalance;
                    const decims = new BN(api.registry.chainDecimals);
                    const factor = new BN(10).pow(decims);
                    const sendAmount = new BN(amount).mul(factor);
                    const transfer = api.tx.balances.transfer(toAddress, sendAmount)

                    const { partialFee } = await transfer.paymentInfo(m1);
                    const fees = partialFee.muln(110).divn(100);
                    
                    const total = amount
                        .add(fees)
                        .add(api.consts.balances.existentialDeposit);

                    if (total.gt(available)) {
                        resolve({
                            success : false,
                            msg : "Your balance is not enough"
                        })
                    }
                    else {
                        const tx = await transfer.signAndSend(m1);
                        resolve({
                            success : true,
                            transactionHash : tx,
                        })
                    }
                } else {
                    resolve({
                        success : false,
                        msg : "Polk Adot Server Error"
                    })
                }
            })
            .catch((err) => {
                resolve({
                    success : false,
                    msg : "Polk Adot Server Error"
                })
            })
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

// Get gas price of the POLK ADOT
const getGasPricePolk = (mnemonic, toAddress, amount) => {
    return new Promise((resolve, reject) => {
        if (isValidAddressPolkadotAddress(toAddress)) {
            connect().then(async (api) => {
                if (api.isConnected) {
                    const { account: m1 } = createAccount(mnemonic);
                    const decims = new BN(api.registry.chainDecimals);
                    const factor = new BN(10).pow(decims);
                    const sendAmount = new BN(amount).mul(factor);
                    const transfer = api.tx.balances.transfer(toAddress, sendAmount)

                    const { partialFee } = await transfer.paymentInfo(m1);
                    return resolve({
                        success : true,
                        estimateGasPrice : partialFee/factor
                    })
                } else {
                    resolve({
                        success : false,
                        msg : "Polk Adot Server Error"
                    })
                }
            })
            .catch((err) => {
                resolve({
                    success : false,
                    msg : "Polk Adot Server Error"
                })
            })
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
    transferPolk,
    getGasPricePolk,
}