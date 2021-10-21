import logo from './logo.svg';
import './App.css';
import WalletCard from "./WalletCard";
import WalletCardEthers from "./WalletCardEther";

function App() {
  return (
    <div className="App">
         <WalletCard />
      <WalletCardEthers />
    </div>
  );
}

export default App;
