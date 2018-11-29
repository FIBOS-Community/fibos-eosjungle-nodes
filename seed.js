var fibos = require('fibos');
var fs = require("fs");
var config = require('./config');
var p2p_peer_address = require('./p2p');
console.notice("start FIBOS for EOS seed node");


fibos.config_dir = config.config_dir;
fibos.data_dir = config.data_dir;

console.notice("config_dir:", fibos.config_dir);
console.notice("data_dir:", fibos.data_dir);


fibos.load("http", {
	"http-server-address": "0.0.0.0:8801",
	"access-control-allow-origin": "*",
	"http-validate-host": false,
	"verbose-http-errors": true //打开报错
});


fibos.load("net", {
	"p2p-peer-address": p2p_peer_address,
	"max-clients": 100,
	"p2p-listen-endpoint": "0.0.0.0:9801"
});

var chain_config = {
	"contracts-console": true,
	'chain-state-db-size-mb': config["chain-state-db-size-mb"]
};

if (!fs.exists(fibos.data_dir) && !fs.exists(fibos.config_dir)) {
	chain_config['genesis-json'] = "genesis.json";
}

fibos.load("producer");

fibos.load("chain", chain_config);
fibos.load("chain_api");

fibos.pubkey_prefix = "EOS";
fibos.core_symbol = "EOS";
fibos.enableJSContract = false;

fibos.start();