import { useTable, useSortBy, usePagination, useFilters } from 'react-table'
import { Filter, DefaultColumnFilter } from './filters'
import { useClientStore } from './../../state/StateManager'

function Table({ columns }) {
    const data = useClientStore( (state) => state.clients);

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
        state: { pageIndex },
      } = useTable(
        { 
          columns, 
          data,           
          defaultColumn: { Filter: DefaultColumnFilter },
          initialState: {
            hiddenColumns: ["_id"],
            pageSize: 5
          }
        },
        useFilters, // useFilters!        
        useSortBy,
        usePagination,
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
      </div>

    </>
    )
}

export default Table;