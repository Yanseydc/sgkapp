

const Box = (props) => {

    return(
        <div className="box">            
            <h1 className="box__title">{props.title}</h1>
            <div className="box__form">
                {props.children}
            </div>
        </div>
    );
}

export default Box;