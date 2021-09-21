import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';
import Crud from './artifacts/contracts/Crud.sol/Crud.json';
const crudAddress = '0x8F766dc69816D7FBB8c5C08F51a0eBfceAD225Fb';



function App() {

    const [account, setAccount] = useState('');
    // const [crud, setCrud] = useState('');
    const [user, setUser] = useState('');
    const [msg , setMsg]  = useState(null);
    const [userId, setId] = useState('');
    const [userData, setData] = useState(null);

    const initAccount = async () => {
      const getAccounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    console.log(getAccounts[0]);
    setAccount(getAccounts[0]);
    }


    const createUser = async () => {
      if( typeof window.ethereum !== 'undefined'){
        const provider = await new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const crud = await new ethers.Contract(crudAddress, Crud.abi, signer);
        const createTx = await crud.create(user);
        await createTx.wait();
        setMsg(user);
        setUser('');
      }
    }
    const getUser = async () => {
      if( typeof window.ethereum !== 'undefined'){
        let _id = parseInt(userId);
        console.log(_id);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(await provider.getBlockNumber());
        const crud = new ethers.Contract(crudAddress, Crud.abi, provider);
        console.log(crud);
        try{
        const result = await crud.read(_id);
        setId('');
        setData(result);
        console.log(result);
        }catch(err){
          console.log('Error : ', err);
        }
        
      }
    }

    const updateUser = async () => {
      let _id = parseInt(userId);
      if( typeof window.ethereum !== 'undefined'){
        const provider = await new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const crud = await new ethers.Contract(crudAddress, Crud.abi, signer);
        try{
        const updateTx = await crud.update(_id,user);
          const result = await updateTx.wait();
        setId('');
        setUser('');
        console.log(result);
        } catch (err){
          console.log('Error : ' , err );
        }
      }

    }

    const deleteUser = async () => {
      let _id = parseInt(userId);
      if( typeof window.ethereum !== 'undefined'){
        const provider = await new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const crud = await new ethers.Contract(crudAddress, Crud.abi, signer);
        try{
        const removeTx = await crud.remove(_id);
          const result = await removeTx.wait();
        setId('');
        console.log(result);
        } catch (err){
          console.log('Error : ' , err );
        }
      }

    }
  return (
    <div className="App">
      <button onClick={initAccount}> {account?'Connected': 'Connec Wallet'}</button>
       <p className=".bg-info">{account}</p>


        Create User : <input onChange = {e => setUser(e.target.value)} placeholder = "Name"  />
       <button type="button" className="btn btn-primary" onClick ={createUser}> Add User </button><br />
       <p className="text-success">{msg?`The new user ${msg} created`:''} </p>
       
       
       View User : <input onChange = {e => setId(e.target.value)} placeholder = "ID"  />
       <button type="button" className="btn btn-info" onClick={getUser} >Submit</button>
        <p className=".text-info"> {userData ? `ID : ${userData[0]} User : ${userData[1]}` : ''} </p>


        Update User: <input onChange = {e => setId(e.target.value)} placeholder = "ID"  />
        <input onChange = {e => setUser(e.target.value)} placeholder = "Name"  />
         <button type="button" className="btn btn-warning" onClick={updateUser} >Update</button><br />
         <br />
         
        Delete User : <input onChange = {e => setId(e.target.value)} placeholder = "ID"  />
        <button type="button" className="btn btn-danger" onClick={deleteUser} >Delete</button> 

    </div>
  );
}

export default App;
