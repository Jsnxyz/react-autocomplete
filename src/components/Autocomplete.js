import React, { useState, useCallback, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import { searchPokemonByStartString } from "../requests/pokemons";
import styles from "./Autocomplete.module.css";

function Autocomplete() {
  // State and setter for search term
  const [userQuery, setUserQuery] = useState("");
  // State and setter for search results
  const [pokemonList, setPokemonList] = useState([]);
  // State for search status (whether there is a pending API request)
  const [isSearching, setIsSearching] = useState(false);
  // State whether to show pokemonList or not, In case of blur or focus
  const [showPokemonList, setShowPokemonList] = useState(true);

  const updateQuery = async () => {
    // A search query api call.
    setIsSearching(true);
    if (userQuery.length !== 0) {
      const result = await searchPokemonByStartString(userQuery);
      setPokemonList(result);
      setIsSearching(false);
    } else {
      setPokemonList([]);
    }
  };

  // Now we call our hook, passing in the current searchTerm value.
  // The hook will only return the latest value (what we passed in) ...
  // ... if it's been more than 500ms since it was last called.
  // Otherwise, it will return the previous value of searchTerm.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const delayedQuery = useDebounce(userQuery, 500);

  const onChange = (e) => {
    setUserQuery(e.target.value);
  };

  const onBlur = (e) => setShowPokemonList(false);
  const onFocus = (e) => setShowPokemonList(true);
  const modifyInput = (value) => setUserQuery(value);

  useEffect(() => {
    if (delayedQuery) {
      updateQuery();
    }
  }, [delayedQuery]);

  return (
    <div className={styles.search}>
      <div className={styles["search-wrap"]}>
        <input
          className={styles.search__input}
          type="text"
          placeholder="Enter search query"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={userQuery}
        />
        {isSearching ? <div className={styles.sp}></div> : ""}
      </div>

      <button className={styles.search__button}>Search Pokemon</button>
      {pokemonList.length > 0 && showPokemonList && (
        <div className={styles.suggestions}>
          {pokemonList.map((obj) => {
            return (
              <div
                key={obj.id}
                className={styles.suggestions__item}
                onMouseDown={() => modifyInput(obj.name)}
              >
                {obj.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Autocomplete;
