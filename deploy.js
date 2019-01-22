const HDWalletProvider = require("truffle-hdwallet-provider");
const { interface, bytecode } = require("./compile");
const Web3 = require("web3");
//const web3 = new Web3(provider);

const provider = new HDWalletProvider(
  "utility mango odor west slab dance charge coral coin silent right supreme",
  "https://rinkeby.infura.io/v3/b8a18d7725394e558f0c945f09af4da8"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deply from account", accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: 1000000, from: accounts[0] });

  console.log(interface);
  console.log("Contract deployed to", result.options.address);
};
deploy();
