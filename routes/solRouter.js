const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, transferSol, getGasPriceSol } = require('../apis/solService');


// @route    GET api/sol/walletGeneration
// @desc     Generate new wallet for Solana blockchain network
// @access   Public
router.get('/walletGeneration', async (req, res) => {
    try {
        walletGeneration()
        .then((data) =>{
            res.json(data);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send('Server Error');
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    GET api/sol/getBalance/
// @desc     Get balance of coin according to wallet addresss in Soalana blockchain network
// @access   Public
router.get('/getBalance/:publicKey', async (req, res) => {
    try {
        if(req.params.publicKey) {
            getBalance(req.params.publicKey)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            resolve({
                success : false,
                msg : "Request Error"
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    POST api/sol/transferSol
// @desc     Transfer Sol coin from sender address to receiver address
// @access   Private
router.post('/transferSol', async (req, res) => {
    try {
        if(req.body.mnemonic && req.body.receiverPublicKey && req.body.amount) {
            transferSol(req.body.mnemonic, req.body.receiverPublicKey, req.body.amount)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            resolve({
                success : false,
                msg : "Request Error"
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    GET api/sol/getGasPriceSol
// @desc     Get gas price of SOL on the Solana Chain
// @access   Public
router.get('/getGasPriceSol', async (req, res) => {
    try {
        getGasPriceSol()
        .then((data) =>{
            res.json(data);
        })
        .catch(err => {
            res.status(500).send('Server Error');
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
