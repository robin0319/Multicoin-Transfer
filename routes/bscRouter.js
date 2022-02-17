const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, tokenTransfer, getBalanceBnb, trasnferBnb, getGasPriceBnb, getGasPrice } = require('../apis/bscService');


// @route    GET api/bsc/walletGeneration
// @desc     Generate new wallet for binance blockchain network
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

// @route    GET api/bsc/getbalance/:address/:coin
// @desc     Get balance of coin according to wallet addresss and coin name in binance chain network
// @access   Public
router.get('/getBalance/:address/:coin', async (req, res) => {
    try {
        if (req.params.address && req.params.coin) {
            getBalance(req.params.address, req.params.coin)
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

// @route    GET api/bsc/getBalanceBnb/:address
// @desc     Get balance of BNB on the Binance Smart Chain
// @access   Public
router.get('/getBalanceBnb/:address', async (req, res) => {
    try {
        if (req.params.address) {
            getBalanceBnb(req.params.address)
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

// @route    POST api/bsc/tokenTransfer
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

// @route    POST api/bsc/trasnferBnb
// @desc     Transfer bnb from sender address to receiver address
// @access   Private
router.post('/transferBnb', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.amount && req.body.privateKey) {
            trasnferBnb(req.body.fromAddress, req.body.toAddress, req.body.amount, req.body.privateKey)
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

// @route    GET api/bsc/getGasPriceBnb
// @desc     Get gas price of BNB on the Binance Smart Chain
// @access   Public
router.get('/getGasPriceBnb', async (req, res) => {
    try {
        getGasPriceBnb()
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

// @route    GET api/bsc/getGasPrice/:fromAddress/:toAddress/:coin/:amount
// @desc     Get gas price according to the token on the Binance Smart Chain
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
