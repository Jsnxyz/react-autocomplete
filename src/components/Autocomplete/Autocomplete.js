import React, { useState, useReducer, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { searchPokemonByStartString } from "../../requests/pokemons";
import styles from "./Autocomplete.module.css";
import {AutocompleteReducer, defaultAutocompleteState} from "./AutocompleteReducer";

function Autocomplete(props) {
  const [state, dispatchState] = useReducer(AutocompleteReducer, defaultAutocompleteState);
  // State for search status (whether there is a pending API request)
  const [isSearching, setIsSearching] = useState(false);
  // State whether to show pokemonList or not, In case of blur or focus
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Fetch items for autocomplete suggestions if input is focused
   * OR input length is not empty
   * @returns void
   */
  const updateQuery = async () => {
    // A search query api call.
    if(!isFocused || state.userQuery.length === 0) {
      dispatchState({type: 'UPDATE_LIST', pokemonList: []});
      return;
    }
    setIsSearching(true);
    const result = await searchPokemonByStartString(state.userQuery);
    dispatchState({type: 'UPDATE_LIST', pokemonList: result});
    setIsSearching(false);
  };

  // Now we call our hook, passing in the current searchTerm value.
  // The hook will only return the latest value (what we passed in) ...
  // ... if it's been more than 500ms since it was last called.
  // Otherwise, it will return the previous value of searchTerm.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const delayedQuery = useDebounce(state.typedUserQuery, 500);

  // Run updateQuery if delayedQuery changed.
  useEffect(async() => {
    if (delayedQuery) {
      updateQuery();
    }
  }, [delayedQuery]);

  /**
   * On Change of Input, update typedUserQuery.  
   * @param {Event} e 
   */
  const onChange = (e) => {
    dispatchState({type: 'AC_TYPED', typedUserQuery: e.target.value});
  };

  /**
   * On Blur, set isFocused state to false. 
   * @param {Event} e 
   * @returns void
   */
  const onBlur = (e) => setIsFocused(false);

  /**
   * On Focus, set isFocused state to true and run updateQuery to get suggestions based on current Input value
   * @param {Event} e 
   */
  const onFocus = (e) => {
    setIsFocused(true);
    updateQuery();
  };

  // A guard function to know if suggestions can be shown and is shown.
  const isAutoCompleteShown = () => state.pokemonList.length > 0 && isFocused;
  
  /**
   * Function to handle suggestion select either via click or 'Enter' pressed.
   * Fetch pokemon based on Input value
   * Remove focus from Input.
   * @param {string} value 
   * @param {Event} e 
   */
  const itemSelectHandler = async(value, e) => {
    dispatchState({type: 'AC_SELECTED', userQuery: value});
    setIsFocused(false); // Hide Autocomplete.
    props.findPokemonHandler(value);
    e.target.blur();
  }
  
  /**
   * Function to handle keyDown event when Input is focused.
   * @param {Event} e 
   * @returns void
   */
  const onKeyDown = (e) => {
    if(!isAutoCompleteShown()) return;
    const keyPressed = e.code;
    switch(keyPressed) {
        case 'ArrowUp':
          e.preventDefault(); // Disallow cursor going to beginning on ArrowUp press
          dispatchState({type: 'AC_ARROW_UP_PRESSED'});
          break;
        case 'ArrowDown':
          dispatchState({type: 'AC_ARROW_DOWN_PRESSED'});
          break;
        case 'Enter':
          itemSelectHandler(state.userQuery, e);
          break;
        default: break;
    }
  }

  return (
    <div className={styles.search}>
      <div className={styles["search-wrap"]}>
        <input
          className={styles.search__input}
          type="text"
          placeholder="Enter search query"
          onChange={onChange}
          onFocus={onFocus}
          onClick={onFocus} // Since simply focus doesn't trigger updateQuery() with isFocused = true;
          onBlur={onBlur}
          value={state.userQuery}
          onKeyDown={onKeyDown}
        />
        {isSearching ? <div className={styles.sp}></div> : ""}
      </div>

      <button className={styles.search__button} onClick={(e) => itemSelectHandler(state.typedUserQuery, e)}>Use Pokedex</button>

      {state.pokemonList.length > 0 && isFocused && (
        <div className={styles.suggestions}>
          {state.pokemonList.map((obj, i) => {
            const active = i === state.suggestionIndex ? styles.active: '';
            return (
              <div
                key={obj.id}
                className={`${styles.suggestions__item} ${active}`}
                onMouseDown={(e) => itemSelectHandler(obj.name, e)}
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
