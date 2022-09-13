import store from './store';
import { useState, useEffect, useSyncExternalStore } from 'react';

function useStore(selector = (state) => state) {
  const itemValue = selector(store.getState());
  const [state, setState] = useState(itemValue);

  useEffect(function () {
    const setter = (state) => setState(selector(state));
    const unsubscribe = store.subscribe(setter);
    return () => unsubscribe();
  });

  return state;
}

const useStore2 = (selector = (state) => state) => {
  const getSnapshot = () => selector(store.getState());
  return useSyncExternalStore(store.subscribe, getSnapshot);
};

function IncrementValue({ item }) {
  function increment() {
    const state = store.getState();
    store.setState({
      ...state,
      [item]: state[item] + 1,
    });
  }
  return (<button
    onClick={increment}>
    Increment {item}
  </button>);
}

function DisplayValue({ item }) {
  const value = useStore2((state) => state[item]);
  return <div>{item}: {value}</div>;
}

function App() {
  const divStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    maxWidth: 600,
    gap: "1rem"
  };
  return (
    <div style={divStyle}>
      <IncrementValue item="value1" />
      <DisplayValue item="value1" />
      <IncrementValue item="value2" />
      <DisplayValue item="value2" />
    </div>
  );
}

export default App;
