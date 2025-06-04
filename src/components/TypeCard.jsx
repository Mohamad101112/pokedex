import { pokemonTypeColors } from "../utils";

function TypeCard(props) {
    const {type} = props;

    return (

        <div className="type-tile" style={{color: pokemonTypeColors?.[type]?.color,
            background: pokemonTypeColors?.[type]?.background
        }}>{type}</div>
    )
}

export default TypeCard;