const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, tokenTransfer, trasnferEth, getBalanceEth, getGasPriceEth, getGasPrice } = require('../apis/ethService');


// @route    GET api/eth/walletGeneration
// @desc     Generate new wallet for ethereum blockchain network
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

// @route    GET api/eth/getbalance/:address/:coin
// @desc     Get balance of coin according to wallet addresss and coin name in ethereum blockchain network
// @access   Public
router.get('/getBalance/:address/:coin', async (req, res) => {
    try {
        if (req.params.address && req.params.coin) {
            getBalance(req.params.address, req.params.coin)
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
        res.status(500).send('Server Error');
    }
});

// @route    GET api/eth/getBalanceEth/:address
// @desc     Get balance of ETH on the Ethereum Chain
// @access   Public
router.get('/getBalanceEth/:address', async (req, res) => {
    try {
        if (req.params.address) {
            getBalanceEth(req.params.address)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Request Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/eth/tokenTransfer
// @desc     Transfer token from sender address to receiver address
// @access   Private
router.post('/tokenTransfer', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.coin && req.body.amount && req.body.privateKey) {
            tokenTransfer(req.body.fromAddress, req.body.toAddress, req.body.coin, req.body.amount, req.body.privateKey)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Request Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    POST api/eth/trasnferEth
// @desc     Transfer eth from sender address to receiver address
// @access   Private
router.post('/transferEth', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.amount && req.body.privateKey) {
            trasnferEth(req.body.fromAddress, req.body.toAddress, req.body.amount, req.body.privateKey)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Request Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    GET api/eth/getGasPriceEth
// @desc     Get gas price of ETH on the Ethereum Chain
// @access   Public
router.get('/getGasPriceEth', async (req, res) => {
    try {
        getGasPriceEth()
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

// @route    GET api/eth/getGasPrice/:fromAddress/:toAddress/:coin/:amount
// @desc     Get gas price according to the token on the Ethereum Chain
// @access   Public
router.get('/getGasPrice/:fromAddress/:toAddress/:coin/:amount', async (req, res) => {
    try {
        if (req.params.fromAddress && req.params.toAddress && req.params.coin && req.params.amount) {
            getGasPrice(req.params.fromAddress, req.params.toAddress, req.params.coin, req.params.amount)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Request Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
