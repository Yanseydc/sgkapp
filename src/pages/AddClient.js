import Box from "../components/Box/Box";
import AddClientForm from "../components/AddForms/AddClientForm";

function AddMember() {
    

    return (
        <div className="addClient">
            <div className="addClient__content">
                <Box title="Crear cliente">
                    <AddClientForm/>
                </Box>
            </div>
        </div>
    );
        
}

export default AddMember;