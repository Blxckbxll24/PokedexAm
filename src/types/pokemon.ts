// Interfaces para la API de Pokemon
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  base_experience: number;
  stats: PokemonStat[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface SimplePokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface SimplePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: SimplePokemonStats;
  height: number;
  weight: number;
}

// Para las notificaciones
export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}