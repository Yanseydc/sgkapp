import axios from 'axios';
import {  useEffect, useMemo, useState } from 'react';
import { useTokenStore } from '../state/StateManager'
import { Link } from "react-router-dom";
import Table from './../components/Table/Table'


function Home() {
    const [fetchedData, setFechedData] =  useState([]);    
    const [loading, setLoading] = useState(true);
    const getJwt = useTokenStore( (state) => state.jwt);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect( () => {              
        if(loading) {
            getData();
        }
    },[])

    const getData = async () => {
        try {                        
            getClients(await axios.get("http://localhost:4000/api/clients"));
        } catch (error) {
            console.error('error', error);
        }
    };

    const getClients = ({data}) => {
        const clients = data.map(client => {          
          let paymentDescription = 'Corriente';
          if(!client.lastPayment) { 
            paymentDescription = 'Pendiente';
           }
          if(client.lastPayment) {
            let currentDate = new Date().getTime();
            let registerDate = new Date(`${client.lastPayment}`);
            let nextPayment = new Date(registerDate.setMonth( registerDate.getMonth() + client.months)).getTime();
            if(currentDate >= nextPayment) {              
              paymentDescription = 'Deudor';
            }
          }
            return {
              ...client,
              lastPayment: client.lastPayment ? new Date(`${client.lastPayment}`).toLocaleDateString('es-Es', dateOptions) : '',
              status: paymentDescription
            };
        });
        
        setFechedData(clients);
        setLoading(false);
    }

    const checkIn = async (clientId) => {
      try {        
        const options = {
          method: 'POST',
          headers: { 
            'content-type': 'application/json',
            'x-access-token': getJwt
          },
          data: { clientId },
          url: 'http://localhost:4000/api/clients/checkIn'
        };

        await axios(options);
        
      } catch (error) {
        console.error('error', error);
      }
    };

    const columns = useMemo( () => [
        { accessor: '_id' },                
        {
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
              const { lastPayment } = cell.row.values;
              let actions;
                if(lastPayment) {
                  actions = (
                    <div className="actions">
                      <i onClick={ () => {checkIn(cell.row.values._id)} } className="fas fa-calendar-check checkIn"></i>
                      <Link to="/viewClient" ><i className="fas fa-eye view"></i></Link>
                      <i className="fas fa-trash remove"></i>
                    </div>
                  )
                } else {          
                  actions = (
                    <div className="actions">
                      <i className="fas fa-calendar-check" style={{color: 'gray', cursor: 'not-allowed'}}></i>
                      <Link to="/viewClient" ><i className="fas fa-eye view"></i></Link>
                      <i className="fas fa-trash remove"></i>
                    </div>
                  )
                }
                return actions;
            },                    
        }, 
    ], [dateOptions])
    
    return(
        // <div className="container">
            <div className="table">
                <div className="table__content">
                    { loading 
                        ? <p>Loading......</p>
                        : <Table columns={columns} data={fetchedData} />       
                    }
                </div>
            </div>
        // </div>
    );
}

export default Home;