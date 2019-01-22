const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface,bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async()=>{
  accounts = await web3.eth.getAccounts();

  lottery= await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode})
  .send({from:accounts[0],gas:1000000});
});

describe('Lottery Contract',()=>{
  it('deplyos lottery contract',()=>{
    assert.ok(lottery.options.address);
  });

it('allows single player to enter',async ()=>{
  await lottery.methods.enter().send({
    from:accounts[0],
    value:web3.utils.toWei('0.1','ether')
  });
  const player = await lottery.methods.getPlayers().call({
    from:accounts[0]
  });

  assert.equal(accounts[0],player[0]);
  assert.equal(1,player.length);



});

it('allows multiple player to enter',async ()=>{
  await lottery.methods.enter().send({
    from:accounts[0],
    value:web3.utils.toWei('0.1','ether')
  });
  await lottery.methods.enter().send({
    from:accounts[1],
    value:web3.utils.toWei('0.1','ether')
  });
  await lottery.methods.enter().send({
    from:accounts[2],
    value:web3.utils.toWei('0.1','ether')
  });
  const player = await lottery.methods.getPlayers().call({
    from:accounts[0]
  });

  assert.equal(accounts[0],player[0]);
  assert.equal(accounts[1],player[1]);
  assert.equal(accounts[2],player[2]);
  assert.equal(3,player.length);
  });

  it('requires a minimum ether to enter',async()=>{
    try{
      await lottery.methods.enter().send({
        from:accounts[0],
        value:0
      });
        assert(false)
    } catch(err){
      assert(err)
    }

  });

  it('requires manager to pick a winner',async ()=>{
    try{
      await lottery.methods.pickWinner().send({
        from:accounts[1]

      });
        assert(false)
    } catch(err){
      assert(err)
    }
  })

  it('send money to the winner and reset the player array',async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei('2','ether')
      });

      const initialBalance = await web3.eth.getBalance(accounts[0]);

      await lottery.methods.pickWinner().send({
        from:accounts[0]
      });

      const finalBalance = await web3.eth.getBalance(accounts[0]);

      const difference = finalBalance-initialBalance;
      console.log(difference);
      assert(difference>web3.utils.toWei('1.8','ether'))



  });




});
