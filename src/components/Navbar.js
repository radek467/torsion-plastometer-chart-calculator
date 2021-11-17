import {Link} from "react-router-dom";
import "../styles/navbar.css"


export const Navbar = () => {
    return (
        <>
            <div className="navbar">
                <Link className="navbar-link" to="/">Strona główna</Link>
                <Link className="navbar-link" to="/getCharts">Zapisane wykresy</Link>
                <Link className="navbar-link" to="/processImage">Nowe obliczenia</Link>
            </div>
        </>
    )
}