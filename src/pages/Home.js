import axios from 'axios';
import {  useEffect, useMemo, useState } from 'react';
import { useTokenStore, useClientStore } from '../state/StateManager'
import { Link } from "react-router-dom";
import Table from './../components/Table/Table'


function Home() {
    // const [fetchedData, setFechedData] =  useState([]);   
    const [loading, setLoading] = useState(true);
    const getFechedData = useClientStore( (state) => state.getClients);
    const removeClient = useClientStore( (state) => state.removeClient);
    const checkInClient = useClientStore( (state) => state.checkIn);

    const getJwt = useTokenStore( (state) => state.jwt);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect( () => {   
        getData();        
    },[])

    const getData = () => {
        getFechedData(); 
        setLoading(false);      
    };

    const checkIn = async (clientName, clientId) => {
        if (window.confirm(`Quieres registrar entrada de ${clientName} ?`)) {
            await checkInClient(getJwt, clientId);
        }
    };

    const deleteClient = async (clientName, clientId) => {
        if (window.confirm(`Seguro que quieres eliminar a ${clientName} ?`)) {
            await removeClient(getJwt, clientId);
        }
    }

    const columns = useMemo( () => [
        { accessor: '_id' },        
        { 
            Header: 'Foto',
            accessor: 'imagePath',
            Cell: ({ cell }) => {
                let imagePath = cell.row.values.imagePath;
                if(imagePath) {
                    return <div><img src={ "http://localhost:4000/static/" + imagePath } alt="foto del cliente" /></div>;
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
                let id = cell.row.values._id;
                if(lastPayment) {
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
                let className = status != 'Corriente' ? ( status == 'Pendiente' ? 'pending' : 'expired' ) : 'active';
                return <div className={`status ${className}`}>{status}</div>;
            },            
        },{
            Header: 'Acciones',
            disableSortBy: true,
            Cell: ({ cell }) => {
              //check in
                const { lastPayment, firstName, lastName, _id } = cell.row.values;
                let fullName = `${firstName} ${lastName}`;
            
                return (
                    <div className="actions">
                        { lastPayment 
                            ?   <i onClick={ () => {checkIn(fullName, _id)} } className="fas fa-calendar-check checkIn"></i>
                            :   <i className="fas fa-calendar-check" style={{color: 'gray', cursor: 'not-allowed'}}></i>
                        }
                        <Link to="/viewClient" ><i className="fas fa-eye view"></i></Link>
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