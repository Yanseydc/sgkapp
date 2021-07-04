
function Modal ({handleClose}) {

    // const show

    return(
        <div className="modal">
            <section className="modal__content">
                {children}
                <button type="button" onClick={handleClose}>
                    close
                </button>
            </section>
        </div>
    );
}


export default Modal;