import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import ReactPaginate from 'react-paginate'

import './StationList.css'
import './pagination.css'

const StationList = (params) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchedStations, setSearchedStations] = useState('')
  const [search, setSearch] = useState('')

  console.log(process.env.REACT_APP_TEST)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCQ8XgBzFz7ZCkP3a4plEjTOuXtZHkKLpw',
  })
  const center = useMemo(
    () => ({
      lat: 60.16861358586236,
      lng: 24.966495679482307,
    }),
    []
  )

  const stations = searchedStations === '' ? params.stations : searchedStations
  const itemsPerPage = 20
  const itemOffset = currentPage * itemsPerPage
  const endOffset = itemOffset + itemsPerPage
  const stationsToView = stations.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(stations.length / itemsPerPage)

  const handleSearchChange = (event) => setSearch(event.target.value)

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

  const searchStations = (event) => {
    event.preventDefault()
    const filteredStations = params.stations.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(search.toLowerCase())
    )
    console.log('searched')
    setSearchedStations(filteredStations)
    setCurrentPage(0)
  }

  const clearSearch = () => {
    setSearchedStations('')
    setSearch('')
  }

  return (
    <div className="StationList">
      <h2>StationList</h2>
      <div className="App">
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={10}
          />
        )}
      </div>
      <div>
        <form onSubmit={searchStations}>
          <input value={search} onChange={handleSearchChange} />
          <button type="submit">Search</button>
        </form>
        <button onClick={clearSearch}>Clear search</button>
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
