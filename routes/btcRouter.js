const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, transferBtc, getGasPriceBtc } = require('../apis/btcService');


// @route    GET api/btc/walletGeneration
// @desc     Generate new wallet for bitcoin blockchain network
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

// @route    GET api/btc/getBalance/
// @desc     Get balance of coin according to wallet addresss in BitCoin blockchain network
// @access   Public
router.get('/getBalance/:address', async (req, res) => {
    try {
        if(req.params.address) {
            getBalance(req.params.address)
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

// @route    POST api/btc/transferBtc
// @desc     Transfer bicoin from sender address to receiver address
// @access   Private
router.post('/transferBtc', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.amount && req.body.privateKey) {
            transferBtc(req.body.fromAddress, req.body.toAddress, req.body.amount, req.body.privateKey)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Parameter Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    POST api/btc/getGasPriceBtc
// @desc     Get gas price of the bitcoin
// @access   Private
router.get('/getGasPriceBtc/:amount', async (req, res) => {
    try {
        if (req.params.amount) {
            getGasPriceBtc(req.params.amount)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Parameter Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
