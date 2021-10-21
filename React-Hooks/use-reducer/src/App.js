import React, { useReducer } from 'react';
import './App.css';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import ComponentC from './ComponentC';
import DataFetchingOne from './DataFetchingOne';

export const CountContext = React.createContext();

const initialState = 0
const reducer = (state, action) => {
	switch (action) {
		case 'increment':
			return state + 1
		case 'decrement':
			return state - 1
		case 'reset':
			return initialState
		default:
			return state
	}
}

function App() {
  const [count, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="App">
    <DataFetchingOne />
    </div>
  );
}

export default App;

/*
    <CountContext.Provider value={{countState: count, countDispatch: dispatch}}>
    <div className="App">
      <h1>Count - {count}</h1>
      <ComponentA />
      <ComponentB />
      <ComponentC />
    </div>
    </CountContext.Provider>
*/