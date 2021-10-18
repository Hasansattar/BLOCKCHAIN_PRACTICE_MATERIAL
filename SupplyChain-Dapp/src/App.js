import React, { Component } from 'react'
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";
import "./App.css";

export class App extends Component {
  state = { cost: 0, itemName: "exampleItem1", loaded: false }

  componentDidMount = async ()=> {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      const networkId = await this.web3.eth.net.getId();

      this.itemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address
      );
      this.item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address
      );
      
      // this.listenToPaymentEvent();
      this.listenToPaymentEvent();
      this.setState({loaded: true});
      
    } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }
  };

  listenToPaymentEvent = ()=> {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async function(evt) {
      if(evt.returnValues._step === "1") {
              let item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
              console.log(item);
              alert(`Item ${item._identifier} was paid, deliver it now!`);
            };
            console.log(evt);
    });
  }

  handleInputChange = (event)=> {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = async ()=> {
    const { cost, itemName } = this.state;
    let result = await this.itemManager.methods.createItem(itemName, cost).send({from: this.accounts[0]});
    console.log(result);
    alert(`Send ${cost} Wei to ${result.events.SupplyChainStep.returnValues._address}`);
  } 

  render() {
    if(!this.state.loaded) {
      return <div>Loading Web3, Accounts, and Contract...</div>;
    }
    return (
      <div className="container my-container">
      <h1>Event Trigger / Supply Chain Example!</h1>
      <h2>Items</h2>

      <h3>Add Items</h3>
      <form className="form-custom">
        <div className="form-group">
        <label htmlFor="price">Cost in Wei:</label>
        <input type="number" className="form-control" name="cost" value={this.state.cost} onChange={this.handleInputChange}/>
        </div>
        <div className="form-group">
        <label htmlFor="name">Item Name:</label>
        <input type="text" className="form-control" name="itemName" value={this.state.itemName} onChange={this.handleInputChange}/>
        </div>
        <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create new Item</button>
      </form>
    </div>
    )
  }
}

export default App
