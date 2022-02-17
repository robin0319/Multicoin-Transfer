const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, tokenTransfer, getGasPriceGraph } = require('../apis/graphService');


// @route    GET api/graph/walletGeneration
// @desc     Generate new wallet for Graph blockchain network
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

// @route    GET api/graph/getbalance/:address
// @desc     Get balance of coin according to wallet addresss and coin name in Graph network
// @access   Public
router.get('/getBalance/:address', async (req, res) => {
    try {
        if (req.params.address) {
            getBalance(req.params.address)
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

// @route    POST api/graph/transferGraph
// @desc     Transfer Graph from sender address to receiver address
// @access   Private
router.post('/transferGraph', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.amount && req.body.privateKey) {
            tokenTransfer(req.body.fromAddress, req.body.toAddress, req.body.amount, req.body.privateKey)
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

// @route    GET api/graph/getGasPriceGraph/:fromAddress/:toAddress/:amount
// @desc     Get gas price according to the token on the Graph Chain
// @access   Public
router.get('/getGasPriceGraph/:fromAddress/:toAddress/:amount', async (req, res) => {
    try {
        if (req.params.fromAddress && req.params.toAddress && req.params.amount) {
            getGasPriceGraph(req.params.fromAddress, req.params.toAddress, req.params.amount)
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
