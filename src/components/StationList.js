import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api'
import ReactPaginate from 'react-paginate'
import { paginationLoader } from '../utils/helpers'

import '../styles/map.css'
import '../styles/pagination.css'

const StationList = (params) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchedStations, setSearchedStations] = useState('')
  const [search, setSearch] = useState('')
  const [mapRef, setMapRef] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [infoWindowData, setInfoWindowData] = useState()

  // Loads google API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  })

  // Decides if all stations or search result is added for pagination and initial view
  const stations = searchedStations === '' ? params.stations : searchedStations
  const stationsToView = paginationLoader(stations, currentPage, 20)

  // Google maps markers location and info
  const markers = stations.map((s) => ({
    name: s.nimi,
    number: s.number,
    address: s.osoite,
    capacity: s.capacity,
    lat: Number(s.lat),
    lng: Number(s.long),
  }))

  // Sets google map boundary and centers map accordingly
  const onMapLoad = (map) => {
    setMapRef(map)
    const bounds = new window.google.maps.LatLngBounds()
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }))
    map.fitBounds(bounds)
  }

  // Handels click to show markers on map
  const handleMarkerClick = (id, lat, lng, name, number, address, capacity) => {
    mapRef?.panTo({ lat, lng })
    setInfoWindowData({ id, name, number, address, capacity })
    setIsOpen(true)
  }

  // Changes pagination page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

  // Controlled form changes state for searchterm
  const handleSearchChange = (event) => setSearch(event.target.value)

  // Searches stations from params and sets state for rerender
  const searchStations = (event) => {
    event.preventDefault()
    const filteredStations = params.stations.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(search.toLowerCase())
    )
    setSearchedStations(filteredStations)
    setCurrentPage(0)
  }

  // Clears search and sets state for rerender of all stations
  const clearSearch = () => {
    setSearchedStations('')
    setSearch('')
  }

  return (
    <div>
      <h2 className="text-center text-4xl font-bold mb-2">STATIONS</h2>
      <div>
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            onLoad={onMapLoad}
            onClick={() => setIsOpen(false)}
          >
            {markers.map(
              ({ lat, lng, name, number, address, capacity }, ind) => (
                <Marker
                  key={ind}
                  position={{ lat, lng }}
                  onClick={() => {
                    handleMarkerClick(
                      ind,
                      lat,
                      lng,
                      name,
                      number,
                      address,
                      capacity
                    )
                  }}
                >
                  {isOpen && infoWindowData?.id === ind && (
                    <InfoWindow
                      onCloseClick={() => {
                        setIsOpen(false)
                      }}
                    >
                      <div>
                        <h3>
                          {infoWindowData.number}&nbsp;-&nbsp;
                          {infoWindowData.name}
                        </h3>
                        <p>
                          {infoWindowData.address}
                          <br />
                          <em>
                            Capacity:&nbsp;{infoWindowData.capacity}
                            &nbsp;bikes
                          </em>
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              )
            )}
          </GoogleMap>
        )}
      </div>
      <div className="grid justify-items-center bg-zinc-200 p-5 rounded-md my-5 border-zinc-500">
        <div className="flex flex-row">
          <form onSubmit={searchStations}>
            <input
              className="rounded py-2 px-5 focus:outline-blue-600"
              value={search}
              onChange={handleSearchChange}
            />
            <button
              className="ml-5 px-10 py-2 rounded bg-blue-600 text-white font-black hover:bg-blue-500"
              type="submit"
            >
              Search
            </button>
          </form>
          <button
            className="ml-5 px-5 py-2 bg-white font-black text-zinc-500 rounded hover:text-zinc-800"
            onClick={clearSearch}
          >
            Clear search
          </button>
        </div>
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
        pageCount={stationsToView.pageCount}
        pageClassName={'item pagination-page '}
        pageRangeDisplayed={2}
        previousClassName={'item previous'}
        previousLabel={'< back'}
      />
      <table className="w-full rounded-b-md">
        <thead className="bg-blue-600 font-black text-white">
          <tr>
            <th className="p-2">Number</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2">City</th>
            <th className="p-2">Capacity</th>
            <th className="p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {stationsToView.items.map((s) => (
            <tr className="even:bg-blue-50" key={s.id}>
              <td className="p-2 text-center">{s.number}</td>
              <td className="p-2">{s.nimi}</td>
              <td className="p-2">{s.osoite}</td>
              <td className="p-2 text-center">{s.kaupunki}</td>
              <td className="p-2 text-center">{s.capacity}</td>
              <td className="p-2 text-center">
                <Link
                  className="font-black text-blue-600 hover:text-blue-500"
                  to={`/station/${s.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StationList
