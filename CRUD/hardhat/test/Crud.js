const { expect , assert } = require("chai");
const { ethers } = require("hardhat");

let crud;

describe('Crud', function () {
  before(async function () {
    this.Crud = await ethers.getContractFactory('Crud');
  });

  beforeEach(async function () {
    this.crud = await this.Crud.deploy();
    await this.crud.deployed();
     crud = this.crud;
  });
  it('Should create an user', async function () {
    const creatTx = await crud.create('Usman');
    await creatTx.wait();
    let user = await crud.read(1);
    expect(user[0]).to.equal(1);
    expect(user[1]).to.equal('Usman');
  });

  it('Should update an user' , async function (){
    const creatTx = await crud.create('Usman');
    await creatTx.wait();
    const updateTx= await crud.update(1,"Arslan");
    await updateTx.wait();
    let user = await crud.read(1);
    expect(user[0]).to.equal(1);
    expect(user[1]).to.equal('Arslan');
  });

  it('Shoul delet an user', async function () {
    const creatTx = await crud.create('Usman');
    await creatTx.wait();
    const updateTx= await crud.remove(1);
    await updateTx.wait();
    //expect(await crud.read(1)).to.throw( Error);
    try{
      await crud.read(1);
      } catch (e){
        assert(e.message.includes('User dose not exist!'));
        return;
      }
      assert(false);
  });

  it('Should not update user not-exist!',async function (){
    try{
      const updateTx = await crud.update(1, 'Usman');
      await updateTx.wait();
      } catch (e){
        assert(e.message.includes('User dose not exist!'));
        return;
      }
      assert(false);
  });

  it('Should not remove user that not-exist',async function (){
    try{
      const removeTx = await crud.remove(5);
      await removeTx.wait();
      } catch (e){
        assert(e.message.includes('User dose not exist!'));
        return;
      }
      assert(false);
  });
});
