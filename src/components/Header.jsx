function Header(props) {
    const {handleToggleMenu} = props;

    return (
        <header >
        <button onClick={handleToggleMenu} className="open-nav-button">
            <i className="fa-solid fa-bars"></ i>
        </button>

        <h1 className="text-gradient">pokedex</h1>
        </header>
    )

}

export default Header;