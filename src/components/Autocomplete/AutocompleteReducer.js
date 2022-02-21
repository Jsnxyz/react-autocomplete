
/**
 * default autocomplete state.
 * userQuery: State to keep track of what user typed, clicked or toggled in suggestion box
 * pokemonList: State to store suggested items/pokemons
 * suggestionIndex: State to track which suggestion item user is toggling via arrow keys. -1 index defaults to the value what user has typed in Input.
 * typedUserQuery: State to exclusively keep track of user typed. Since managing this state enables google autocomplete like behavior.
 */
export const defaultAutocompleteState = {
  userQuery: "",
  pokemonList: [],
  suggestionIndex: -1,
  typedUserQuery: "",
};

/**
 * Set of possible dispatchable actions.
 */
const ACTIONS = {
  UPDATE_LIST: ({userQuery, pokemonList, suggestionIndex, typedUserQuery}, action) => {
    return {
      userQuery,
      pokemonList: action.pokemonList,
      suggestionIndex,
      typedUserQuery,
    };
  },
  AC_ARROW_UP_PRESSED: ({userQuery, pokemonList, suggestionIndex, typedUserQuery}) => {
    let value = --suggestionIndex;
    if (value === -2) value = pokemonList.length - 1;
    // if value is -1, set userQuery back to what user had typed
    return {
      userQuery: value === -1 ? typedUserQuery : pokemonList[value].name,
      pokemonList,
      suggestionIndex: value,
      typedUserQuery,
    };
  },
  AC_ARROW_DOWN_PRESSED: ({userQuery, pokemonList, suggestionIndex, typedUserQuery}) => {
    let value = ++suggestionIndex;
    if (value === pokemonList.length) value = -1;
    // if value is -1, set userQuery back to what user had typed
    return {
      userQuery: value === -1 ? typedUserQuery : pokemonList[value].name,
      pokemonList,
      suggestionIndex: value,
      typedUserQuery,
    };
  },
  AC_SELECTED: ({userQuery, pokemonList, suggestionIndex, typedUserQuery}, action) => {
    // set both userQuery and typedQuery as same.
    return {
      userQuery: action.userQuery,
      pokemonList: [], // empty out pokemonList since refocus can give old results if user types too quickly and selects.
      suggestionIndex,
      typedUserQuery: action.userQuery,
    };
  },
  AC_TYPED: ({userQuery, pokemonList, suggestionIndex, typedUserQuery}, action) => {
    // User typed something onto Input.
    return {
      userQuery: action.typedUserQuery,
      pokemonList,
      suggestionIndex: -1,
      typedUserQuery: action.typedUserQuery,
    };
  }
};

/**
 * Reducer for Autocomplete state management and dispatchable actions.
 * @param {AutocompleteState} state 
 * @param {AutocompleteStateChanges} action 
 * @returns {UpdatedAutocompleteState | defaultAutocompleteState}
 */
export const AutocompleteReducer = (state, action) => {
  if (!ACTIONS[action.type]) {
    return defaultAutocompleteState;
  }
  return ACTIONS[action.type](state, action);
};