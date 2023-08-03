import { useEffect, useState } from "react";
import PokemonCard, { PokemonInfo } from "./PokemonCard";



export default function Display() {
    const [allPokemons, setAllPokemons] = useState([] as PokemonInfo[])
    const [apiLink, setApiLink] = useState("https://pokeapi.co/api/v2/pokemon");
    useEffect(() => {

        let shouldSkip = false;
        const fetchPokemonInfo = async (pokemon : {name: string, url : string,}) : Promise<PokemonInfo> => {
            const pokemonInfo = await (await fetch(pokemon.url)).json();
            return {
                name: pokemon.name,
                height: pokemonInfo.height,
                weight: pokemonInfo.weight,
                imageUrl: pokemonInfo.sprites.other.dream_world.front_default,
            }
        }
        const fetchData = async (apiLink : string) => {
            const response = await (await fetch(apiLink)).json();
            if(!shouldSkip) {
                for(let pokemon of response.results) {
                    const newPokemonInfo = await fetchPokemonInfo(pokemon);
                    setAllPokemons((allPokemons) => [...allPokemons, newPokemonInfo]);
                }
                setApiLink(response.next);
            }
        }
        if(Boolean(apiLink)) {
            fetchData(apiLink);
        }
        return () => {
            shouldSkip = true;
        }
    }, [apiLink])

    console.log("updating...", allPokemons.length, allPokemons[allPokemons.length-1]);

    return (
        <div className="card-container">
            <ul>
            {allPokemons.map((pokemon, index) => 
                <li key={index}>
                    <PokemonCard {...pokemon} />
                </li>)}
            </ul>
        </div>
    );
}