import React from 'react';
import { MemoryRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

export default {
  title: 'Components/PokemonCard',
  component: PokemonCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a Pokémon sprite, ID, name, and clickable type chips. Optionally navigates via linkHref and emits onTypeClick.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    onTypeClick: { action: 'type chip clicked' },
    linkHref: { control: 'text' },
    className: { control: 'text' },
  },
};

const basePokemon = {
  id: 25,
  name: 'pikachu`',
  types: ['electric'],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
};

export const Default = {
  args: { pokemon: basePokemon },
};

export const MultipleTypes = {
  args: {
    pokemon: {
      ...basePokemon,
      id: 3,
      name: 'venusaur',
      types: ['grass', 'poison'],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
      },
    },
  },
};

export const MissingSprite = {
  args: {
    pokemon: {
      ...basePokemon,
      id: 'missing',
      name: 'MissingNo.',
      types: [],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Card should render a fallback or empty state when sprite is missing.',
      },
    },
  },
};

export const NoTypes = {
  args: {
    pokemon: {
      ...basePokemon,
      id: 0,
      name: '???',
      types: [],
      sprites: {
        front_default:
          'http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Validates layout when no type chips are available. This ensures the card remains visually consistent.',
      },
    },
  },
};

export const VeryLongName = {
  args: {
    pokemon: {
      ...basePokemon,
      id: 10228,
      name: 'Toxtricity-low-key-gmax',
      types: ['electric', 'poison'],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10228.png',
      },
    },
  },
  parameters: {
    docs: { description: { story: 'Checks text wrapping/truncation for long names.' } },
  },
};

export const WithLinkNavigation = {
  render: (args) => {
    function Details() {
      const { id } = useParams();
      return (
        <div style={{ padding: 16, width: 320 }}>
          <h3 style={{ marginTop: 0 }}>Pokémon Details</h3>
          <p>Route matched: /pokemon/{id}</p>
          <p>This is a stub detail view rendered by react-router in Storybook.</p>
          <Link to="/">Back to list</Link>
        </div>
      );
    }

    return (
      <div style={{ width: 320 }}>
        <Routes>
          <Route path="/" element={<PokemonCard {...args} />} />
          <Route path="/pokemon/:id" element={<Details />} />
        </Routes>
      </div>
    );
  },
  args: {
    pokemon: {
      id: 35,
      name: 'clefairy',
      types: ['fairy'],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png',
      },
    },
    linkHref: '/pokemon/35',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Clicking the card navigates to a stubbed details route rendered via react-router. Use the Back link to return.',
      },
    },
  },
};

export const WithLinkHref = {
  args: {
    pokemon: basePokemon,
    linkHref: '/pokemon/35',
  },
  parameters: {
    docs: {
      description: { story: 'Shows the card as a link (routing is provided by MemoryRouter).' },
    },
  },
};

export const InGrid = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
        width: 600,
      }}
    >
      {[
        basePokemon,
        {
          ...basePokemon,
          id: 1,
          name: 'bulbasaur',
          types: ['grass', 'poison'],
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          },
        },
        {
          ...basePokemon,
          id: 4,
          name: 'charmander',
          types: ['fire'],
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
          },
        },
        {
          ...basePokemon,
          id: 7,
          name: 'squirtle',
          types: ['water'],
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
          },
        },
      ].map((p) => (
        <PokemonCard key={p.id} {...args} pokemon={p} />
      ))}
    </div>
  ),
  args: {},
  parameters: {
    docs: { description: { story: 'Multiple cards in a responsive grid wrapper.' } },
  },
};
