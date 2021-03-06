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
    if(!isFocused || state.userQuery.trim().length === 0 || state.typedUserQuery.trim().length === 0) {
      dispatchState({type: 'UPDATE_LIST', pokemonList: []}); // flush pokemon list when Input not focused.
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

  // A guard function to check if button should be enabled or disabled
  const isSearchButtonDisabled = () => state.typedUserQuery.trim().length === 0;
  
  /**
   * Function to handle suggestion select either via click or 'Enter' pressed.
   * Fetch pokemon based on Input value
   * Remove focus from Input.
   * @param {string} value 
   * @param {Event} e 
   */
  const itemSelectHandler = async(value, e) => {
    if(!value.trim()) return;
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
    const keyPressed = e.code;
    switch(keyPressed) {
        case 'ArrowUp':
          if(!isAutoCompleteShown()) return;
          e.preventDefault(); // Disallow cursor going to beginning on ArrowUp press
          dispatchState({type: 'AC_ARROW_UP_PRESSED'});
          break;
        case 'ArrowDown':
          if(!isAutoCompleteShown()) return;
          dispatchState({type: 'AC_ARROW_DOWN_PRESSED'});
          break;
        case 'Enter':
          itemSelectHandler(state.userQuery, e);
          break;
        default: 
          dispatchState({type: 'AC_TYPED', typedUserQuery: e.target.value});
          break;
    }
  }

  return (
    <div className={styles.search}>
      <div className={styles["search-wrap"]}>
        <input
          className={styles.search__input}
          type="text"
          placeholder="Enter the pok??mon you want to find"
          onKeyDown={onKeyDown}
          onChange={onChange}
          onFocus={onFocus}
          onClick={onFocus} // Since simply focus doesn't trigger updateQuery() with isFocused = true;
          onBlur={onBlur}
          value={state.userQuery}
          role="searchbox"
          aria-label="Enter Pokemon name"
        />
        {isSearching ? <div className={styles.sp}></div> : ""}
        {state.pokemonList.length > 0 && isFocused && (
          <div className={styles.suggestions} role="suggestions">
            {state.pokemonList.map((obj, i) => {
              const active = i === state.suggestionIndex ? styles.active: '';
              return (
                <div
                  key={obj.id}
                  className={`${styles.suggestions__item} ${active}`}
                  onMouseDown={(e) => itemSelectHandler(obj.name, e)}
                  aria-label={`suggested item: ${obj.name}`}
                >
                  {obj.name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button 
        className={`${styles.search__button} ${isSearchButtonDisabled() ? styles['search__button--disabled'] : ''}`} 
        onClick={(e) => itemSelectHandler(state.userQuery, e)}
        disabled={isSearchButtonDisabled()}
        role="button"
        aria-label="Search for Pokemon"
        >
          Use Pok??dex ???
      </button>
    </div>
  );
}

export default Autocomplete;
