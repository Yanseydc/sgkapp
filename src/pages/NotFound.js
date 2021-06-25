import { Link } from "react-router-dom";

const NotFound = () => {
    return(
        <div className="notfound">
            <div className="content">
                <div className="img">
                    <img src="gorila.svg" alt="gorilaz!" />
                </div>
                
                <h1>Esta pagina no existe Gorila!</h1>
                <Link to="/">
                    Click para regresar
                </Link>
            </div>
        </div>
    )
}

export default NotFound;