import Box from "../components/Box/Box";
import AddClientForm from "../components/AddForms/AddClientForm";

function AddMember() {
    

    return (
        <div className="addClient">
            <Box title="Crear cliente">
                <AddClientForm/>
            </Box>
        </div>
    );
        
}

export default AddMember;