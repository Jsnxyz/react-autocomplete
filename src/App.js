import React, {useState} from "react";
import Autocomplete from "./components/Autocomplete/Autocomplete";
import Results from "./components/Results/Results";
import { findPokemon } from "./requests/pokemons";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [fetchingPokemon, setFetchingPokemon] = useState(false);
  
  const findPokemonHandler = async(value) => {
    setFetchingPokemon(true);
    const pokemonResult = await findPokemon(value);
    setResult(pokemonResult);
    setFetchingPokemon(false);
  }

  const fetchRenderedElement = fetchingPokemon ? <div className="fetching"></div> : '';
  return (
    <div className="container">
      <h1>Find Pokemons</h1>
      <Autocomplete findPokemonHandler={findPokemonHandler}/>
      {result !== null && !fetchingPokemon? <Results result={result}/> : fetchRenderedElement}
    </div>
  );
}

export default App;
