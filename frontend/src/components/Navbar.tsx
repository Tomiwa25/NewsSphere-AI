import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav className="flex justify-between p-5 bg-black text-white">

            <Link to="/">NewsSphere AI</Link>
            <div>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}

export default Navbar;