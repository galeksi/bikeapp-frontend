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

import './StationList.css'
import './pagination.css'

const StationList = (params) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchedStations, setSearchedStations] = useState('')
  const [search, setSearch] = useState('')
  const [mapRef, setMapRef] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [infoWindowData, setInfoWindowData] = useState()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  })

  const stations = searchedStations === '' ? params.stations : searchedStations
  const stationsToView = paginationLoader(stations, currentPage, 20)

  const markers = stations.map((s) => ({
    name: s.nimi,
    number: s.number,
    address: s.osoite,
    capacity: s.capacity,
    lat: Number(s.lat),
    lng: Number(s.long),
  }))

  const onMapLoad = (map) => {
    setMapRef(map)
    const bounds = new window.google.maps.LatLngBounds()
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }))
    map.fitBounds(bounds)
  }

  const handleMarkerClick = (id, lat, lng, name, number, address, capacity) => {
    mapRef?.panTo({ lat, lng })
    setInfoWindowData({ id, name, number, address, capacity })
    setIsOpen(true)
  }

  const handleSearchChange = (event) => setSearch(event.target.value)

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
  // console.log(stations)

  return (
    <div>
      <h2 class="text-center text-4xl font-bold mb-2">Stations</h2>
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
      <div class="flex flex-row bg-zinc-200 p-5 rounded-md shadow my-5">
        <form onSubmit={searchStations}>
          <input
            class="rounded py-2 px-5"
            value={search}
            onChange={handleSearchChange}
          />
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
        pageCount={stationsToView.pageCount}
        pageClassName={'item pagination-page '}
        pageRangeDisplayed={2}
        previousClassName={'item previous'}
        previousLabel={'< back'}
      />
      <table class="w-full p-8">
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {stationsToView.items.map((s) => (
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
