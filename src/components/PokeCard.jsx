import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

function PokeCard(props) {
    const {selectedPokemon} = props;
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const {name,height,abilities,stats,types,moves,sprites} = data || {};
    const [skill,setSkill] = useState(null);
    const [loadingSkill,setLoadingSkill] = useState(false);

    const imgList = Object.keys(sprites || {}).filter(e => {
        if(!sprites[e]) {return false};
        if(['versions','other'].includes(e)) {return false}
        return true;
    });



    async function fetchMoveData(move,moveUrl){
        if (loadingSkill || !localStorage || !moveUrl) {return}

        // check cache for move
        let c = {};
        if(localStorage.getItem('pokemon-moves')){
            c = JSON.parse(localStorage.getItem('pokemon-moves'));
        }

        if (move in c) {
            setSkill(c[move]);
            console.log('found move in cache');
            return;
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        // if loading exit loop
        if(loading || !localStorage) {
            return;
        }

        
        // check if the selected pokemon info is available in the cache
        // 1 -define the cache
        let cache = {};
        if(localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }
        
        // 2- check if the selected pokemon is available in the cache, otherwise fetch
        if(selectedPokemon in cache) {
            console.log(cache);
            console.log('in memory');
            console.log(cache[selectedPokemon]);
            setData(cache[selectedPokemon]);
            return;
        }

        // we passed all the cache stuff to no avail and need to fetch
        // the data from the url

        async function fetchPokemonData() {
            setLoading(true);
            try{
                const baseUrl = `https://pokeapi.co/api/v2/`;
                const suffix = `pokemon/${getPokedexNumber(selectedPokemon)}`;
                const finalUrl = baseUrl + suffix;

                console.log(`/${getPokedexNumber(selectedPokemon)}`)
                const res = await fetch(finalUrl);
                const pokemonData = await res.json();
                console.log(pokemonData);
                setData(pokemonData);

                cache[selectedPokemon] = pokemonData;
                localStorage.setItem('pokedex',JSON.stringify(cache));


            }catch(error) {
                console.log(error.message);
            }finally {
                setLoading(false);
            }
        }

        fetchPokemonData();
        // 3-if we fetch a non cached item cache it
    },
    [selectedPokemon])

    if(loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return (
        <div  className="poke-card">
             {skill && (<Modal handleCloseModal={() => {setSkill(null)}}>
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name}</h2>
                </div>

                <div>
                    <h6>Description</h6>
                    <h3>{skill.description}</h3>
                </div>

            </Modal>)}

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj,typeIndex)=>{
                    return (
                        <TypeCard key={typeIndex} type={typeObj.type.name} />
                    )
                })}
            </div>
            <img src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} className="default-img" alt={`${name}-large-img`} />

            <div className="img-container">
                {imgList.map((e,index) => {
                    const imgUrl = sprites[e];
                    return (
                        < img key={index} src={imgUrl} />
                    )
                })}
            </div>

            <h3>Stats</h3>

            <div className="stats-card">
                {stats.map((statsObj, statIndex) => {
                    const {stat, base_stat} = statsObj;
                    return(
                        <div key={statIndex} className="stat-item">
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>

            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj,moveIndex) => {
                    return (
                        <button className="button-card pokemon-move" 
                        key={moveIndex} onClick={()=>{  
                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-' , ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default PokeCard;