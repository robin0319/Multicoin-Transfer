const express = require('express');
const router = express.Router();

const { getBalance, tokenTransfer, trasnferMehhc, getBalanceMehhc, walletGeneration, getGasPriceMehhc, getGasPrice } = require('../apis/mehhService');


// @route    GET api/mehhc/walletGeneration
// @desc     Generate new wallet for mehhc blockchain network
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

// @route    GET api/mehhc/getbalance/:address/:coin
// @desc     Get balance of coin according to wallet addresss and coin name in Mehhc chain network
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

// @route    GET api/mehhc/getBalanceMehhc/:address
// @desc     Get balance of Mehhc on the Mehhc Chain
// @access   Public
router.get('/getBalanceMehhc/:address', async (req, res) => {
    try {
        if (req.params.address) {
            getBalanceMehhc(req.params.address)
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

// @route    POST api/mehhc/tokenTransfer
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

// @route    POST api/mehhc/trasnferMehhc
// @desc     Transfer mehhc from sender address to receiver address
// @access   Private
router.post('/transferMehhc', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.amount && req.body.privateKey) {
            trasnferMehhc(req.body.fromAddress, req.body.toAddress, req.body.amount, req.body.privateKey)
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

// @route    GET api/mehhc/getGasPriceMehhc
// @desc     Get gas price of MEHH on the Mehhc Chain
// @access   Public
router.get('/getGasPriceMehhc', async (req, res) => {
    try {
        getGasPriceMehhc()
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

// @route    GET api/mehhc/getGasPrice/:fromAddress/:toAddress/:coin/:amount
// @desc     Get gas price according to the token on the Mehhc Chain
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
