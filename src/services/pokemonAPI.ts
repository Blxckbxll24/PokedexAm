import type { Pokemon, PokemonListResponse, SimplePokemon } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache simple para evitar múltiples requests
const pokemonListCache = new Map<string, SimplePokemon[]>();
const pokemonCache = new Map<string, Pokemon>();

export const pokemonAPI = {
  // Obtener lista de Pokemon (máximo 50 para cumplir el requisito de 30 mínimo)
  async getPokemonList(limit: number = 50): Promise<SimplePokemon[]> {
    const cacheKey = `pokemon-list-${limit}`;
    
    if (pokemonListCache.has(cacheKey)) {
      return pokemonListCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PokemonListResponse = await response.json();
      
      // Obtener detalles de cada Pokemon para tener la imagen
      const pokemonPromises = data.results.map(async (_, index) => {
        const id = index + 1; // Los primeros Pokemon tienen IDs secuenciales
        const pokemonData = await this.getPokemonById(id);
        
        // Extraer estadísticas
        const stats = {
          hp: pokemonData.stats[0]?.base_stat || 0,
          attack: pokemonData.stats[1]?.base_stat || 0,
          defense: pokemonData.stats[2]?.base_stat || 0,
          specialAttack: pokemonData.stats[3]?.base_stat || 0,
          specialDefense: pokemonData.stats[4]?.base_stat || 0,
          speed: pokemonData.stats[5]?.base_stat || 0,
        };
        
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
          types: pokemonData.types.map(t => t.type.name),
          stats,
          height: pokemonData.height,
          weight: pokemonData.weight
        };
      });

      const pokemonList = await Promise.all(pokemonPromises);
      pokemonListCache.set(cacheKey, pokemonList);
      return pokemonList;

    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      
      // Devolver datos desde cache si existe un error de red
      if (pokemonListCache.has(cacheKey)) {
        return pokemonListCache.get(cacheKey)!;
      }
      
      throw new Error('No se pudieron cargar los Pokemon. Verifica tu conexión a internet.');
    }
  },

  // Obtener detalles de un Pokemon específico
  async getPokemonById(id: number): Promise<Pokemon> {
    const cacheKey = `pokemon-${id}`;
    
    if (pokemonCache.has(cacheKey)) {
      return pokemonCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${BASE_URL}/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const pokemon: Pokemon = await response.json();
      pokemonCache.set(cacheKey, pokemon);
      return pokemon;

    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error);
      
      // Devolver datos desde cache si existe un error de red
      if (pokemonCache.has(cacheKey)) {
        return pokemonCache.get(cacheKey)!;
      }
      
      throw new Error(`No se pudo cargar la información del Pokemon ${id}.`);
    }
  },

  // Obtener Pokemon por nombre
  async getPokemonByName(name: string): Promise<Pokemon> {
    const cacheKey = `pokemon-name-${name}`;
    
    if (pokemonCache.has(cacheKey)) {
      return pokemonCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const pokemon: Pokemon = await response.json();
      pokemonCache.set(cacheKey, pokemon);
      return pokemon;

    } catch (error) {
      console.error(`Error fetching Pokemon ${name}:`, error);
      
      // Devolver datos desde cache si existe un error de red
      if (pokemonCache.has(cacheKey)) {
        return pokemonCache.get(cacheKey)!;
      }
      
      throw new Error(`No se pudo encontrar el Pokemon "${name}".`);
    }
  }
};