import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { LATEST_TRIPS, ALL_TRIPS } from '../utils/queries'
import ReactPaginate from 'react-paginate'
import { paginationLoader } from '../utils/helpers'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import '../styles/pagination.css'

const Trips = (params) => {
  const [allTrips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [departureFilter, setDepartureFilter] = useState('')
  const [returnFilter, setReturnFilter] = useState('')
  const [startDate, setStartDate] = useState('')

  // Sets options for dropdown select to filter departure and return stations
  const stationOptions = params.stations.map((s) => ({
    value: s.id,
    label: s.nimi,
  }))

  // Lazy query to trigger fetching all trips ordered my latest
  const [fetchTrips, { loadingTrips }] = useLazyQuery(LATEST_TRIPS, {
    onCompleted: (data) => {
      setTrips(data.latestTrips)
    },
  })

  // Lazy query to fetch all trips with filter variables
  const [fetchFilteredTrips, { loadingFilterdTrips }] = useLazyQuery(
    ALL_TRIPS,
    {
      onCompleted: (data) => {
        setFilteredTrips(data.allTrips)
      },
    }
  )

  // Initial query of trips limited to 100 to reduce browser load
  useEffect(() => {
    fetchTrips({
      variables: {
        limit: 100,
      },
    })
  }, [fetchTrips])

  if (loadingTrips || loadingFilterdTrips) return <h2>Loading ...</h2>

  // Decides if all trips or filter result is added for pagination and initial view
  const trips = filteredTrips === '' ? allTrips : filteredTrips
  const tripsToView = paginationLoader(trips, currentPage, 20)

  // Changes pagination page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

  // Triggers filtered query with variables and limits to 100 to reduce browser load
  const filterTrips = () => {
    fetchFilteredTrips({
      variables: {
        limit: 100,
        departure: departureFilter.value,
        return: returnFilter.value,
        date: startDate,
      },
    })
    setCurrentPage(0)
  }

  // Clears filter and sets State for rerender
  const clearFilter = () => {
    setFilteredTrips('')
    setDepartureFilter('')
    setReturnFilter('')
    setStartDate('')
  }

  return (
    <div>
      <h2 className="text-center text-4xl font-bold mb-2">Trips</h2>
      <div className="bg-zinc-200 p-5 rounded-md my-5 border-zinc-500">
        <div className="flex items-center grid grid-cols-3 gap-4 mb-5">
          <Select
            id="departurestation"
            className="basic-single focus:outline-blue-600"
            classNamePrefix="Departure..."
            value={departureFilter}
            isClearable={true}
            isSearchable={true}
            placeholder="Departure station"
            options={stationOptions}
            onChange={setDepartureFilter}
          />
          <Select
            id="returnstation"
            className="basic-single focus:outline-blue-600"
            classNamePrefix="Return..."
            value={returnFilter}
            isClearable={true}
            isSearchable={true}
            placeholder="Return station"
            options={stationOptions}
            onChange={setReturnFilter}
          />
          <DatePicker
            id="datepicker"
            className="p-2 w-full text-zinc-500 rounded focus:outline-blue-600"
            placeholderText="Date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="grid justify-end">
          <div>
            <button
              id="tripfilterbutton"
              className="ml-5 px-10 py-2 rounded bg-blue-600 text-white font-black hover:bg-blue-500"
              onClick={filterTrips}
            >
              Filter
            </button>
            <button
              className="ml-5 px-5 py-2 bg-white font-black text-zinc-500 rounded hover:text-zinc-800"
              onClick={clearFilter}
            >
              Clear filter
            </button>
          </div>
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
        pageCount={tripsToView.pageCount}
        pageClassName={'item pagination-page '}
        pageRangeDisplayed={2}
        previousClassName={'item previous'}
        previousLabel={'< back'}
      />
      <table className="w-full">
        <thead className="bg-blue-600 font-black text-white">
          <tr>
            <th className="p-2 pl-5 text-left">Departure station</th>
            <th className="p-2">Station Nr</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2 pl-5 text-left">Return Station</th>
            <th className="p-2">Station Nr</th>
            <th className="p-2">Duration</th>
            <th className="p-2">Distance</th>
          </tr>
        </thead>
        <tbody>
          {tripsToView.items &&
            tripsToView.items.map((t) => (
              <tr className="even:bg-blue-50" key={t.id}>
                <td className="p-2 pl-5">{t.departureStation.nimi}</td>
                <td className="p-2 text-center">{t.departureStation.number}</td>
                <td className="p-2 text-center">
                  {new Date(Number(t.departure)).toLocaleDateString('fi-FI')}
                </td>
                <td className="p-2 text-center">
                  {new Date(Number(t.departure)).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-2 pl-5">{t.returnStation.nimi}</td>
                <td className="p-2 text-center">{t.returnStation.number}</td>
                <td className="p-2 text-center">
                  {(t.duration / 60).toFixed(0)}&nbsp;min
                </td>
                <td className="p-2 text-center">
                  {(t.distance / 1000).toFixed(1)}&nbsp;km
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Trips
