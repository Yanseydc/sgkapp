import axios from 'axios';
import {  useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table'
import { useTokenStore } from '../state/StateManager'
import { Link } from "react-router-dom";

function Table({ columns, data }) {

    const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ 
        columns, 
        data , 
        initialState: {
          hiddenColumns: ["_id", "lastName"]
        }})

    return (
        <table {...getTableProps()}> 
        {/* style={{ border: 'solid 2px black' }} */}
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 1px black',
                    background: 'hsl(231, 12%, 22%)',
                    color: 'white',                    
                    fontWeight: '500',
                    padding: '1rem',
                    width: '250px'
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{ padding: '10px', border: 'solid 1px gray'}}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>    
    )
}

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
            createClient(await axios.get("http://localhost:4000/api/clients"));
        } catch (error) {
            console.error('error', error);
        }
    };

    const createClient = ({data}) => {
        const clients = data.map(client => {
            return {...client, register: 'Entrada', action: 'ver' };
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
        { 
          Header: 'ID',
          accessor: '_id',          
        }, {
            Header: 'Nombre',
            accessor: 'firstName', // accessor is the "key" in the data
            Cell: ({ cell }) => {
              const { firstName, lastName } = cell.row.values;
              return `${firstName} ${lastName}`;
            }
        }, {
            Header: 'Apellido',
            accessor: 'lastName',
        }, {
            Header: 'Fechas',
            columns: [
              {
                Header: 'Ultimo pago',
                accessor: 'lastPayment',
                Cell: ({ cell }) => {
                  let lastPayment = cell.row.values.lastPayment;
                  if(lastPayment) {
                    return new Date(`${lastPayment}`).toLocaleDateString('es-Es', dateOptions);
                  }
                  return 'Registrar pago';
                }
              }, {
                Header: 'Siguiente Pago',
                Cell: ({ cell }) => {                       
                  const { lastPayment, plan } = cell.row.values;

                  if(lastPayment) {                         
                    var date1 = new Date(`${lastPayment}`);                  
                    var nextPayment = date1.setMonth( date1.getMonth() + plan.quantity);
                    var date2 = new Date(nextPayment);
                    return `${date2.toLocaleDateString('es-Es', dateOptions)}`;
                  }
                  return '----';
                }
              }
            ]
        }, {
            Header: 'Plan',
            accessor: 'plan',
            Cell: ({ cell }) => {
              let  plan = cell.row.values.plan
              if(plan) {
                return plan.name;
              }
              return '';
            }
        },{
            Header: 'Status',
            Cell: () => { return '🟢';}        
        },{
            Header: 'Acciones',
            columns: [
              {
                Header: 'Registrar Entrada',                
                Cell: ({ cell }) => {
                  const { lastPayment } = cell.row.values;
                  if(lastPayment) {
                    return <div className="actions"><i onClick={ () => {checkIn(cell.row.values._id)} } className="fas fa-calendar-check checkIn"></i></div>;
                  } 
                  
                  return <div className="actions"><i className="fas fa-calendar-check"  style={{color: 'gray', cursor: 'not-allowed'}}></i></div>;
                  
                }
              }, {

                Header: 'Detalles Cliente',                
                Cell: ({ cell }) => (<Link
                    to="/viewClient"
                  >
                    <div className="actions"><i className="fas fa-eye view"></i></div>
                  </Link>)              
              }, {
                Header: 'Realizar Pago',                
                Cell: ({ cell }) => {
                  const { lastPayment, plan } = cell.row.values;

                  if(lastPayment) {                         
                    let date1 = new Date(`${lastPayment}`);                  
                    let nextPayment = date1.setMonth( date1.getMonth() + plan.quantity);
                    let date2 = new Date(nextPayment).getTime();
                    let actualDate = new Date().getTime();                    
                    if(actualDate < date2) {                    
                      return <div className="actions"><i style={{color: 'gray', cursor: 'not-allowed'}} className="fas fa-money-bill-alt"></i></div>                      
                    }                     
                  }
                  
                  let id = cell.row.values._id;
                  return (
                    <Link to={`/payment/${id}`}>
                      <div className="actions"><i className="fas fa-money-bill-alt pay"></i></div>
                    </Link>
                  )                  
                }                
              }
            ]
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