import {  useEffect, useMemo, useState } from 'react';
import { useTokenStore, useClientStore } from '../state/StateManager'
import { Link } from "react-router-dom";
import Table from './../components/Table/Table'
import alertify from 'alertifyjs';



function Home() {
    const [loading, setLoading] = useState(true);
    const removeToken = useTokenStore( (state) => state.removeToken );
    const getClients = useClientStore( (state) => state.getClients);
    const removeClient = useClientStore( (state) => state.removeClient);
    const checkInClient = useClientStore( (state) => state.checkIn);

    const jwt = useTokenStore( (state) => state.jwt);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect( async () => {  
        try {
            await getClients(jwt); 
            setLoading(false); 
        } catch(error) {
            if(error.response.data.name == 'JsonWebTokenError') {
                removeToken();
            }
        }
    },[])

    const checkIn = async (clientName, clientId) => {
        alertify.confirm(`Registrar Entrada`, `Registrar entrada de ${clientName}?`, 
            async function() {
                await checkInClient(jwt, clientId);    
            },
            function() {}
        );
    };

    const deleteClient = async (clientName, clientId) => {
        alertify.confirm(`Registrar Entrada`, `Seguro que quieres eliminar a ${clientName} ?`, 
            async function() {
                await removeClient(jwt, clientId);   
            },
            function() {}
        );
    }

    const columns = useMemo( () => [
        { accessor: '_id' },        
        { 
            Header: 'Foto',
            accessor: 'imagePath',
            Cell: ({ cell }) => {
                let imagePath = cell.row.values.imagePath;
                if(imagePath) {
                    return <div><img src={ process.env.REACT_APP_IMAGE_URL + imagePath } alt="foto del cliente" /></div>;
                }
                return '';
            },
            disableSortBy: true,
            disableFilters:true
        }, {
            Header: 'Nombre(s)',
            accessor: 'firstName', // accessor is the "key" in the data            
        }, {
            Header: 'Apellidos',
            accessor: 'lastName' 
        }, {
            Header: 'Fecha de registro',
            accessor: 'lastPayment',
            Cell: ({ cell }) => {
                let lastPayment = cell.row.values.lastPayment;
                let status = cell.row.values.status;
                let id = cell.row.values._id;
                if(lastPayment && status != 'Deudor') {
                    return lastPayment;
                }
                return <div className="btn-payment"><Link to={`/payment/${id}`}>+ Agregar pago</Link></div>
            },          
        },{
            Header: 'Estatus',
            accessor: 'status',                     
            Cell: ({ cell }) => {
                let status = cell.row.values.status;
                //return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
                let className = status !== 'Corriente' ? ( status === 'Pendiente' ? 'pending' : 'expired' ) : 'active';
                return <div className={`status ${className}`}>{status}</div>;
            },            
        },{
            Header: 'Acciones',
            disableSortBy: true,
            Cell: ({ cell }) => {
              //check in
                const { lastPayment, firstName, lastName, _id, status } = cell.row.values;
                let fullName = `${firstName} ${lastName}`;
            
                return (
                    <div className="actions">
                        { (lastPayment && status != 'Deudor')
                            ?   <i onClick={ () => {checkIn(fullName, _id)} } className="fas fa-calendar-check checkIn"></i>
                            :   <i className="fas fa-calendar-check" style={{color: 'gray', cursor: 'not-allowed'}}></i>
                        }
                        <Link to={`/viewClient/${_id}`} ><i className="fas fa-eye view"></i></Link>
                        <i className="fas fa-trash remove" onClick={ () => {deleteClient(fullName, _id)} }></i>
                    </div>
                );                
            },                    
        }, 
    ], [dateOptions])
    
    return(
        <div className="table">
            <div className="table__content">
                { loading 
                    ? <p>Loading......</p>
                    : <Table columns={columns}  />       
                }
            </div>
        </div>
    );
}

export default Home;