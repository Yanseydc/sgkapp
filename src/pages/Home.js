import axios from 'axios';
import {  useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table'
import { useTokenStore } from '../state/StateManager'
import { Link } from "react-router-dom";
// import matchSorter from 'match-sorter'

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
        { accessor: '_id' },        
        { accessor: 'lastName' },
        {
            Header: 'Nombre',
            accessor: 'firstName', // accessor is the "key" in the data
            Cell: ({ cell }) => {
              const { firstName, lastName } = cell.row.values;
              return `${firstName} ${lastName}`;
            }
        }, {
          Header: 'Fecha de registro',
          accessor: 'lastPayment',
          Cell: ({ cell }) => {
            let lastPayment = cell.row.values.lastPayment;
            let id = cell.row.values._id;
            if(lastPayment) {
              return new Date(`${lastPayment}`).toLocaleDateString('es-Es', dateOptions);
            }
            return <div className="btn-payment"><Link to={`/payment/${id}`}>+ Agregar pago</Link></div>
          }
        },{
            Header: 'Estatus',
            Cell: ({ cell }) => {
              let lastPayment = cell.row.values.lastPayment;
              let cssClass = 'active';
              let text = 'Corriente';
              if(!lastPayment) {
                cssClass = "pending";
                text = "Pendiente";
              }

              if(lastPayment) {
                let currentDate = new Date().getTime();
                let registerDate = new Date(`${lastPayment}`);
                let nextPayment = new Date(registerDate.setMonth( registerDate.getMonth() + 1)).getTime();
                if(currentDate >= nextPayment) {
                  cssClass = "expired";
                  text = "Deudor";
                }
              }
              return <div className={`status ${cssClass}`}>{text}</div>;
            }
        },{
            Header: 'Acciones',
            Cell: ({ cell }) => {
              //check in
              const { lastPayment } = cell.row.values;
              let checkIn;
                if(lastPayment) {
                  checkIn = (
                    <div className="actions">
                      <i onClick={ () => {checkIn(cell.row.values._id)} } className="fas fa-calendar-check checkIn"></i>
                      <Link to="/viewClient" ><i className="fas fa-eye view"></i></Link>
                      <i className="fas fa-trash remove"></i>
                    </div>
                    
                  )
                } else {          
                  checkIn = (
                    <div className="actions">
                      <i className="fas fa-calendar-check" style={{color: 'gray', cursor: 'not-allowed'}}></i>
                      <Link to="/viewClient" ><i className="fas fa-eye view"></i></Link>
                      <i className="fas fa-trash remove"></i>
                    </div>
                  )
                }
                return checkIn;
            }              
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