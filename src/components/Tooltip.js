function Tooltip(props){
    return(
        <div className="tooltip">
            {props.children}
            <div className="tooltiptext">
                {props.text}
            </div>
        </div>
    )
}

export default Tooltip;