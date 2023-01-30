import { Link } from 'react-router-dom'
import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import './pagination.css'

const StationList = (params) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchedStations, setSearchedStations] = useState('')
  const [search, setSearch] = useState('')

  const stations = searchedStations === '' ? params.stations : searchedStations
  const itemsPerPage = 20
  const itemOffset = currentPage * itemsPerPage
  const endOffset = itemOffset + itemsPerPage
  const stationsToView = stations.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(stations.length / itemsPerPage)

  const handelSearchChange = (event) => setSearch(event.target.value)

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

  const searchStations = (event) => {
    event.preventDefault()
    const filteredStations = params.stations.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(search.toLowerCase())
    )
    setSearchedStations(filteredStations)
    setCurrentPage(0)
  }

  const clearSearch = () => {
    setSearchedStations('')
    setSearch('')
  }

  return (
    <div>
      <h2>StationList</h2>
      <div>
        <form onSubmit={searchStations}>
          <input value={search} onChange={handelSearchChange} />
          <button type="submit">Search</button>
          <button onClick={clearSearch}>Clear search</button>
        </form>
      </div>
      <ReactPaginate
        activeClassName={'item active '}
        breakClassName={'item break-me '}
        breakLabel={'...'}
        containerClassName={'pagination'}
        disabledClassName={'disabled-page'}
        marginPagesDisplayed={2}
        nextClassName={'item next '}
        nextLabel={'forward >'}
        onPageChange={handlePageClick}
        forcePage={currentPage}
        pageCount={pageCount}
        pageClassName={'item pagination-page '}
        pageRangeDisplayed={2}
        previousClassName={'item previous'}
        previousLabel={'< back'}
      />
      <table>
        <tbody>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Capacity</th>
          </tr>
          {stationsToView &&
            stationsToView.map((s) => (
              <tr key={s.id}>
                <td>{s.number}</td>
                <td>
                  <Link to={`/station/${s.id}`}>{s.nimi}</Link>
                </td>
                <td>{s.osoite}</td>
                <td>{s.kaupunki}</td>
                <td>{s.capacity}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default StationList
