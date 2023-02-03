import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { STATION_STATS } from '../utils/queries'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

import '../styles/map.css'

const Station = (params) => {
  const id = useParams().id
  const stations = params.stations

  // Loads google API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  })

  // Queries single station data and statistics
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

  // Statistics query only returns stations by Id; other station details are added from params
  const returnStations = stats.popularReturn.map((ret) =>
    stations.find((station) => station.id === ret)
  )
  const departureStations = stats.popularDeparture.map((dep) =>
    stations.find((station) => station.id === dep)
  )

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mb-2">
        Station Nr {station.number}: {station.nimi}
      </h1>
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
      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="bg-blue-50 rounded-md p-5">
          <h2 className="font-black text-blue-600 border-b-2 border-blue-600 mb-5">
            {station.osoite}&nbsp;{station.kaupunki}
          </h2>
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
            <b>Average distance for departure:</b>&nbsp;{stats.startAvg}
            &nbsp;km
          </p>
          <p>
            <b>Average distance for return:</b>&nbsp;{stats.returnAvg}
            &nbsp;km
          </p>
        </div>
        <div className="bg-blue-50 rounded-md p-5">
          <h2 className="font-black text-blue-600 border-b-2 border-blue-600 mb-5">
            Most popular return stations:
          </h2>
          <ol>
            {returnStations.map((s) => (
              <li key={s.id}>
                <b>
                  {s.nimi}&nbsp;(Nr.{s.number})
                </b>
                &nbsp;-&nbsp;{s.osoite}
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-blue-50 rounded-md p-5">
          <h2 className="font-black text-blue-600 border-b-2 border-blue-600 mb-5">
            Most popular departure stations:
          </h2>
          <ol>
            {departureStations.map((s) => (
              <li key={s.id}>
                <b>
                  {s.nimi}&nbsp;(Nr.{s.number})
                </b>
                &nbsp;-&nbsp;{s.osoite}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Station
