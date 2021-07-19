import {  useEffect, useMemo } from 'react';
import { useTokenStore, useClientStore, useAxiosStore } from '../state/StateManager'
import { Link } from "react-router-dom";
import Table from './../components/Table/Table';
import alertify from 'alertifyjs';
import Tooltip from './../components/Tooltip';
import Icon from './../components/Icon'

function Home() {
    const loading = useAxiosStore( state => state.loading);
    const getClients = useClientStore( (state) => state.getClients);
    const removeClient = useClientStore( (state) => state.removeClient);
    const checkInClient = useClientStore( (state) => state.checkIn);

    const jwt = useTokenStore( (state) => state.jwt);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect( () => {  
        async function fetchClients() {
            await getClients(jwt);
        }
        fetchClients();
    },[getClients, jwt])

    const checkIn = async (clientName, clientId) => {
        alertify.confirm(`Registrar Entrada`, `Registrar entrada de ${clientName}?`, 
            function() {
                async function chekingInClient() {
                    await checkInClient(jwt, clientId);
                }
                chekingInClient();
            },
            function() {}
        );
    };

    const deleteClient = async (clientName, clientId) => {
        alertify.confirm(`Registrar Entrada`, `Seguro que quieres eliminar a ${clientName} ?`, 
            function() {
                async function removingClient() {
                    await removeClient(jwt, clientId); 
                }

                removingClient();
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
                if(lastPayment && status !== 'Deudor') {
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
                        { (lastPayment && status !== 'Deudor')
                            ?   <Tooltip text="Registrar entrada">
                                    <Icon icon="calendar-check" theClassName="checkIn icon" onClick={ () => checkIn(fullName, _id) } />
                                </Tooltip>
                            :   <Tooltip text="Revisar pagos">
                                    <Icon icon="calendar-check" theStyle={{color: 'gray', cursor: 'not-allowed'}} />
                                </Tooltip>
                        }
                    <Tooltip text="Ver Cliente">
                            <Link to={`/viewClient/${_id}`} >
                                <Icon icon="eye" theClassName="icon" theStyle={{color: '#187bcd'}} />
                            </Link>
                        </Tooltip>
                        <Tooltip text="Borrar Cliente">
                            <Icon icon="trash" theClassName="remove icon" onClick={ () => {deleteClient(fullName, _id)} }/>
                        </Tooltip>
                    </div>
                );                
            },                    
        }, 
    ], [dateOptions])
    
    return(
        <div className="table">
            <div className="table__content">
                { loading 
                    ? <h4>Loading...</h4>
                    : <Table columns={columns}  />       
                }
            </div>
        </div>
    );
}

export default Home;