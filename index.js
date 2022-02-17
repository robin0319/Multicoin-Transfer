const express = require('express');
var cors = require('cors');
var path = require('path');
var multer = require('multer');
var upload = multer();
var bodyParser = require("body-parser");
var Web3 = require('web3')

const app = express();

app.use(bodyParser.json()); 
app.use(express.json()); 
app.use(cors());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 

app.use(express.static(path.join(__dirname, 'public')));

// Define Routes

//Binance Network
app.use('/api/bsc', require('./routes/bscRouter'));

//Graph Network
app.use('/api/graph', require('./routes/graphRouter'));

//Ethereum Network
app.use('/api/eth', require('./routes/ethRouter'));

//Solana Network
app.use('/api/sol', require('./routes/solRouter'));

//XRP Network
app.use('/api/xrp', require('./routes/xrpRouter'));

//Bitcoin Cash Network
app.use('/api/bch', require('./routes/bchRouter'));

//Dogecoin Network
app.use('/api/doge', require('./routes/dogeRouter'));

//LiteCoin Network
app.use('/api/ltc', require('./routes/ltcRouter'));

//Polkadot Network
app.use('/api/polk', require('./routes/polkRouter'));

//MEHHC Network
app.use('/api/mehhc', require('./routes/mehhcRouter'));

//Bitcoin Network
app.use('/api/btc', require('./routes/btcRouter'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));