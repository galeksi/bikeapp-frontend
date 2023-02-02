import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { LATEST_TRIPS, ALL_TRIPS } from '../utils/queries'
import ReactPaginate from 'react-paginate'
import { paginationLoader } from '../utils/helpers'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import './pagination.css'

const Trips = (params) => {
  const [allTrips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [departureFilter, setDepartureFilter] = useState('')
  const [returnFilter, setReturnFilter] = useState('')
  const [startDate, setStartDate] = useState('')

  const stationOptions = params.stations.map((s) => ({
    value: s.id,
    label: s.nimi,
  }))

  const [fetchTrips, { loadingTrips }] = useLazyQuery(LATEST_TRIPS, {
    onCompleted: (data) => {
      setTrips(data.latestTrips)
    },
  })

  const [fetchFilteredTrips, { loadingFilterdTrips }] = useLazyQuery(
    ALL_TRIPS,
    {
      onCompleted: (data) => {
        setFilteredTrips(data.allTrips)
      },
    }
  )

  useEffect(() => {
    fetchTrips({
      variables: {
        limit: 100,
      },
    })
  }, [fetchTrips])

  if (loadingTrips || loadingFilterdTrips) return <h2>Loading ...</h2>

  const trips = filteredTrips === '' ? allTrips : filteredTrips
  const tripsToView = paginationLoader(trips, currentPage, 20)

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

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

  const clearFilter = () => {
    setFilteredTrips('')
    setDepartureFilter('')
    setReturnFilter('')
    setStartDate('')
  }

  return (
    <div>
      <h2>Trips</h2>
      <div>
        <Select
          className="basic-single"
          classNamePrefix="Departure..."
          value={departureFilter}
          isClearable={true}
          isSearchable={true}
          name="Departure station"
          options={stationOptions}
          onChange={setDepartureFilter}
        />
        <Select
          className="basic-single"
          classNamePrefix="Return..."
          value={returnFilter}
          isClearable={true}
          isSearchable={true}
          name="Return station"
          options={stationOptions}
          onChange={setReturnFilter}
        />
        <DatePicker
          placeholderText="Select date..."
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <button onClick={filterTrips}>Filter</button>
        <button onClick={clearFilter}>Clear filter</button>
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
      <table>
        <tbody>
          <tr>
            <th>Departure station</th>
            <th>Station Nr</th>
            <th>Date</th>
            <th>Time</th>
            <th>Return Station</th>
            <th>Station Nr</th>
            <th>Duration</th>
            <th>Distance</th>
          </tr>
          {tripsToView.items &&
            tripsToView.items.map((t) => (
              <tr key={t.id}>
                <td>{t.departureStation.nimi}</td>
                <td>{t.departureStation.number}</td>
                <td>
                  {new Date(Number(t.departure)).toLocaleDateString('fi-FI')}
                </td>
                <td>
                  {new Date(Number(t.departure)).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>{t.returnStation.nimi}</td>
                <td>{t.returnStation.number}</td>
                <td>{(t.duration / 60).toFixed(0)}&nbsp;min</td>
                <td>{(t.distance / 1000).toFixed(1)}&nbsp;km</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Trips
