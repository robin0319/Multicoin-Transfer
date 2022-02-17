const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, transferBch, getGasPriceBch } = require('../apis/bchService');


// @route    GET api/bch/walletGeneration
// @desc     Generate new wallet for bitcoin cash blockchain network
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

// @route    GET api/bch/getBalance/:cashAddress
// @desc     Get balance of coin according to wallet addresss in bitcoin cash chain network
// @access   Public
router.get('/getBalance/:cashAddress', async (req, res) => {
    try {
        getBalance(req.params.cashAddress)
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

// @route    POST api/bch/transferBch
// @desc     Transfer token from sender address to receiver address
// @access   Private
router.post('/transferBch', async (req, res) => {
    try {
        if (req.body.mnemonic && req.body.toAddress && req.body.amount) {
            transferBch(req.body.mnemonic, req.body.toAddress, req.body.amount)
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

// @route    POST api/bch/getGasPriceBch
// @desc     Get gas price of the bitcoin cash
// @access   Private
router.get('/getGasPriceBch/:amount', async (req, res) => {
    try {
        if (req.params.amount) {
            getGasPriceBch(req.params.amount)
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
