import axios from 'axios';
import {  useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table'
import { useTokenStore } from './../state/jwtState'


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
          hiddenColumns: ["_id"]
        }})

    return (
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'hsl(231, 12%, 22%)',
                    color: 'white',                    
                    fontWeight: '500',
                    padding: '1rem'
                    
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
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        // background: 'papayawhip',
                      }}
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

    useEffect( () => {              
        if(loading) {
            getData();
        }
    })

    const getData = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/Clients");            
            createClient(response);                        
        } catch (error) {
            console.error('error', error);
        }
    };

    const createClient = ({data}) => {
        const clients = data.map(client => {
            return {...client, status: '🔴', register: 'Entrada', action: 'ver' };
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
        const response = await axios(options);
        console.log(response);
      } catch (error) {
        console.error('error', error);
      }
    };

    const columns = useMemo( (props) => [
        { 
          Header: 'ID',
          accessor: '_id',          
        }, {
            Header: 'Nombre',
            accessor: 'name', // accessor is the "key" in the data
        }, {
            Header: 'Apellido',
            accessor: 'lastName',
        }, {
            Header: 'Fecha Proxima Pago',
            accessor: 'birthDate',
        }, {
            Header: 'Status',
            accessor: 'status'
        }, {
            Header: 'Registrar',
            accessor: 'register',
            Cell: ({ cell }) => (                              
                <button className="button red" onClick={ () => {checkIn(cell.row.values._id)} }>{cell.row.values.register}</button>
            )
        }, {
            Header: 'Accion',
            accessor: 'action',
            Cell: ({ cell }) => (                
                <button className="button blue"><i className="fas fa-eye"></i></button>
            )
        }
    ], [])
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