import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas, fab);

function Icon(props) {
    return(
        <FontAwesomeIcon 
            icon={props.icon} 
            className={props.theClassName} 
            style={props.theStyle} 
            onClick={props.onClick} 
            size={props.theSize}
        />
    )
}

export default Icon;