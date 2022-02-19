import "core-js/stable";
import "regenerator-runtime/runtime";
/**
 * Fetch autocomplete suggestions 
 * @param {string} searchQuery
 * @returns {Pokemon[]} pokemonList
 */
export async function searchPokemonByStartString(searchQuery) {
  searchQuery = searchQuery.toLowerCase().trim();
  try {
    const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
      method: "POST",
      body: JSON.stringify({
        query: `
                    query getPokemonsByStartString($searchTerm: String!, $limit: Int!) {
                        pokemon_v2_pokemon(limit: $limit, where: {name: {_regex: $searchTerm}}) {
                            id
                            name
                        }
                    }
                `,
        variables: {
          searchTerm: `^${searchQuery}`,
          limit: 10,
        },
        operationName: "getPokemonsByStartString",
      }),
    });
    const { errors, data } = await response.json();
    if (errors) {
      throw `Error while fetching pokemons. \n ${jsonResponse.errors}`;
    }
    return data.pokemon_v2_pokemon;
  } catch (err) {
    console.error(err);
  }
  return [];
}

/**
 * Fetch specific pokemon data based on entered value. 
 * image, url and name is returned
 * In case of failure, only name is returned which is handled in <Results>.
 * @param {string} value 
 * @returns {pokemonResult}
 */
export async function findPokemon(value) {
    value = value.toLowerCase().trim();
    const url = `https://pokeapi.co/api/v2/pokemon/${value}`;
    try {
        const response = await fetch(url);
        if(response.status === 404) {
            return {name: value};
        }
        const data = await response.json();
        const pokemonObj = {
            url,
            image: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_shiny ?? null,
            name: value,
        };
        return pokemonObj;
    } catch(err) {
        console.error(`Error fetching ${value}. \n ${err}`);
    }
    return {name: value};
}