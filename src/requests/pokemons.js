import "core-js/stable";
import "regenerator-runtime/runtime";
/**
 *
 * @param {String} searchQuery
 * @returns {Pokemon[]} pokemonList
 */
export async function searchPokemonByStartString(searchQuery) {
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
