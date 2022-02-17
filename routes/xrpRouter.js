const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, transferXRP, getGasPriceXrp } = require('../apis/xrpService');


// @route    GET api/xrp/walletGeneration
// @desc     Generate new wallet for XRP blockchain network
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

// @route    GET api/xrp/getBalance/
// @desc     Get balance of coin according to wallet addresss in XRP blockchain network
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

// @route    POST api/sol/getBalance/
// @desc     Transfer coin from sender address to receiver address
// @access   Public
router.post('/transferXRP', async (req, res) => {
    try {
        if(req.body.seed && req.body.toAddress && req.body.amount) {
            transferXRP(req.body.seed, req.body.toAddress, req.body.amount)
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

// @route    GET api/xrp/getGasPriceXrp
// @desc     Get gas price of Xrp on the XRPL Chain
// @access   Public
router.get('/getGasPriceXrp', async (req, res) => {
    try {
        getGasPriceXrp()
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
