import { useEffect, useState} from "react";
import PokemonCard, { PokemonInfo } from "./PokemonCard";
import { List } from "react-virtualized";

const fetchPokemonInfo = async (pokemon : {name: string, url : string,}) : Promise<PokemonInfo> => {
    const pokemonInfo = await (await fetch(pokemon.url)).json();
    const imageSprites = pokemonInfo.sprites.other
    return {
        name: pokemon.name,
        height: pokemonInfo.height,
        weight: pokemonInfo.weight,
        imageUrl: imageSprites.home.front_default ?? imageSprites.dream_world.front_default ?? imageSprites["official-artwork"].front_default
    }
}

const POKE_API_BASE_URL : string = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20;

// const fetchMorePokemon = async () => {
//     const apiLink = `${POKE_API_BASE_URL}?offset=0&limit=${LIMIT}`;
//     const response = await (await fetch(apiLink)).json();
//     const newPokemons : PokemonInfo[] = [];
//     for(let pokemon of response.results) {
//         const newPokemonInfo = await fetchPokemonInfo(pokemon);
//         newPokemons.push(newPokemonInfo);
//     }
//     return newPokemons;
// };





export default function Display() {
    const [allPokemons, setAllPokemons] = useState<PokemonInfo[]>([] as PokemonInfo[])
    const [offSet, setOffSet] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);



    useEffect(() => {

        let shouldSkip = false;
        let shouldFetchInfo = true;

        const apiLink = `${POKE_API_BASE_URL}?offset=${offSet}&limit=${LIMIT}`;

        const fetchData = async (apiLink : string) => {
            const response = await (await fetch(apiLink)).json();
            if(!shouldSkip) {
                for(let pokemon of response.results) {
                    const newPokemonInfo = await fetchPokemonInfo(pokemon);
                    if(shouldFetchInfo){
                        setAllPokemons((allPokemons) => [...allPokemons, newPokemonInfo]);
                    }
                }
                setOffSet((offSet) => offSet + LIMIT);
                setIsLoading(false);
            }
        }
        if(isLoading && Boolean(apiLink)) {
            fetchData(apiLink)
        }
        
        return () => {
            shouldSkip = true;
            shouldFetchInfo = false;
        }
    }, [offSet, isLoading]);


    return (
        <div className="card-container">
            <ul>
            {allPokemons.map((pokemon, index) => 
                <li key={index}>
                    <PokemonCard  {...pokemon} index={index}/>
                </li>)}
            </ul>
        </div>
    );
}

