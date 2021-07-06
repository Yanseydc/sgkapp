

const Box = (props) => {

    return(
        <div className="box">          
            <div className="box__title">                
                <h1 className="box__title-text">{props.title}</h1>
            </div>
            <div className="box__form">
                {props.children}
            </div>
        </div>
    );
}

export default Box;