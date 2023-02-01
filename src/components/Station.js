import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { STATION_STATS } from '../queries'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

import './Station.css'

const Station = (params) => {
  const id = useParams().id
  const stations = params.stations

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  })

  const stationData = useQuery(STATION_STATS, {
    variables: {
      id: id,
    },
  })

  if (stationData.loading) {
    return <h2>loading...</h2>
  }

  const station = stationData.data.singleStation
  const stats = stationData.data.stationStats
  const center = { lat: Number(station.lat), lng: Number(station.long) }

  const returnStations = stats.popularReturn.map((ret) =>
    stations.find((station) => station.id === ret)
  )
  const departureStations = stats.popularDeparture.map((dep) =>
    stations.find((station) => station.id === dep)
  )

  return (
    <div className="Station">
      <h1>
        Station Nr {station.number}: {station.nimi}
      </h1>
      <h2>
        {station.osoite}&nbsp;{station.kaupunki}
      </h2>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container-station"
          center={center}
          zoom={15}
        >
          <Marker position={center} />
        </GoogleMap>
      )}
      <h3>Statistics</h3>
      <div>
        <p>
          <b>Capacity:</b>&nbsp;{station.capacity}&nbsp;bikes
        </p>
        <p>
          <b>Departures from station:</b>&nbsp;{stats.startTotal}
        </p>
        <p>
          <b>Returns to station:</b>&nbsp;{stats.returnTotal}
        </p>
        <p>
          <b>Average distance for departure trips:</b>&nbsp;{stats.startAvg}
          &nbsp;km
        </p>
        <p>
          <b>Average distance for return trips:</b>&nbsp;{stats.returnAvg}
          &nbsp;km
        </p>
        <p>
          <b>Most popular return station from here:</b>
        </p>
        <ol>
          {returnStations.map((s) => (
            <li key={s.id}>
              {s.nimi}&nbsp;(Nr.{s.number})&nbsp;-&nbsp;{s.osoite}
            </li>
          ))}
        </ol>
        <p>
          <b>Most popular departure station to here:</b>
        </p>
        <ol>
          {departureStations.map((s) => (
            <li key={s.id}>
              {s.nimi}&nbsp;(Nr.{s.number})&nbsp;-&nbsp;{s.osoite}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Station
