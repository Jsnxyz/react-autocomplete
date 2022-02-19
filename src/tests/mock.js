const noSuggestions = [];

const suggestionsFor_A = [
  { id: 24, name: "arbok" },
  { id: 59, name: "arcanine" },
  { id: 63, name: "abra" },
  { id: 65, name: "alakazam" },
  { id: 142, name: "aerodactyl" },
  { id: 144, name: "articuno" },
  { id: 168, name: "ariados" },
  { id: 181, name: "ampharos" },
  { id: 184, name: "azumarill" },
  { id: 190, name: "aipom" },
];

const suggestionsFor_Ab = [
  { id: 63, name: "abra" },
  { id: 359, name: "absol" },
  { id: 460, name: "abomasnow" },
  { id: 10057, name: "absol-mega" },
  { id: 10060, name: "abomasnow-mega" },
];

const suggestionsFor_Abra = [{ id: 63, name: "abra" }];

const samplePokemon = {
  url: "https://pokeapi.co/api/v2/pokemon/articuno",
  image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png",
  name: "articuno",
};

export {
  noSuggestions,
  suggestionsFor_A,
  suggestionsFor_Ab,
  suggestionsFor_Abra,
  samplePokemon,
};
