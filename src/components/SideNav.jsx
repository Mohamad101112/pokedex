import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";


function SideNav(props) {
    const {selectedPokemon,setSelectedPokemon, handleToggleMenu ,showSideMenu,setShowSideMenu} = props;
    const [searchValue,setSearchValue] = useState('');

    const filteredPokemon = first151Pokemon.filter((ele,eleIndex) =>{
        // if full pokedex number includes the current search value,
        // return true

        // other
        if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
            return true;
        }

        if(ele.toLowerCase().includes(searchValue.toLowerCase())){
            return true;
        }

        return false;
    })

    return (
        <nav className={' ' + (showSideMenu ? " open": '')}>
            <div className={'header ' + (showSideMenu ? " open" : '')}>
                <button onClick={handleToggleMenu} className="open-nav-button">
                    Back
                </button>
            <h1 className="text-gradient">Pokedex</h1>
            </div>
            <input placeholder="E.g bulbasaur or 001" value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)
            }} type="text" name="" id="" />

        {filteredPokemon.map((e,index)=>{
        return (
            <button
             onClick={() => {setSelectedPokemon(first151Pokemon.indexOf(e));
                handleToggleMenu()
             }}
             key={index} className={'nav-card ' + (index === selectedPokemon ? 'nav-card-selected':'')}>
                <p>{getFullPokedexNumber(first151Pokemon.indexOf(e))}</p>
                <p>{e}</p>
            </button>
            )

        })}
        </nav>
    )
}

export default SideNav; 