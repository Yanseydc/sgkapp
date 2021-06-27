import axios from 'axios';
import {  useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination, useFilters } from 'react-table'
import { useTokenStore } from '../state/StateManager'
import { Link } from "react-router-dom";
import { Filter, DefaultColumnFilter } from './../components/Table/filters'
// import matchSorter from 'match-sorter'

function Table({ columns, data }) {

    const generateSortingIndicator = column => {
      return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
    }

    const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page
    
        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,        
        // setPageSize,        
        state: { pageIndex, pageSize },
      } = useTable(
        { 
          columns, 
          data,           
          defaultColumn: { Filter: DefaultColumnFilter },
          initialState: {
            hiddenColumns: ["_id"]
          }
        },
        useFilters, // useFilters!        
        useSortBy,
        usePagination
      )

    return (
      <>
        <table {...getTableProps()}>         
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />           
                  </th>
                ))}
              </tr>              
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
      </table>    
       {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Pagina{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Ir a la pagina:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        {/* <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select> */}
      </div>

    </>
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
          //return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
          let paymentDescription = { description: 'Corriente', class: 'active' };
          if(!client.lastPayment) { 
            paymentDescription = { description: 'Pendiente', class: 'pending' };
           }
          if(client.lastPayment) {
            let currentDate = new Date().getTime();
            let registerDate = new Date(`${client.lastPayment}`);
            let nextPayment = new Date(registerDate.setMonth( registerDate.getMonth() + 1)).getTime();
            if(currentDate >= nextPayment) {              
              paymentDescription = { description: 'Deudor', class: 'expired' };
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
            disableFilters: true,
            Cell: ({ cell }) => {
              let status = cell.row.values.status;             
              return <div className={`status ${status.class}`}>{status.description}</div>;
            },            
        },{
            Header: 'Acciones',
            disableSortBy: true,
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