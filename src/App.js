import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_STATIONS } from './utils/queries'
import Station from './components/Station'
import StationList from './components/StationList'
import Trips from './components/Trips'

const App = () => {
  const [stations, setStations] = useState([])
  // Fetching all Stations from DB to serve all routes
  const [fetchStations, { loading }] = useLazyQuery(ALL_STATIONS, {
    onCompleted: (data) => {
      setStations(data.allStations)
    },
  })

  useEffect(() => {
    fetchStations()
  }, [fetchStations])

  if (loading) return <h2>Loading ...</h2>

  return (
    <div className="container mx-auto text-zink-600 tracking-wider">
      <div>
        <Router>
          <div className="flex flex-row bg-blue-600 p-5 rounded-b-md mb-5">
            <h1 className="grow mx-5 text-2xl font-black text-white">
              BIKEAPP 2023
            </h1>
            <div>
              <Link
                className="mx-5 text-xl font-black text-white hover:text-blue-200"
                to="/"
              >
                STATIONS
              </Link>
              <Link
                className="mx-5 text-xl font-black text-white hover:text-blue-200"
                to="/trips"
              >
                TRIPS
              </Link>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<StationList stations={stations} />} />
            <Route path="/trips" element={<Trips stations={stations} />} />
            <Route
              path="/station/:id"
              element={<Station stations={stations} />}
            />
          </Routes>
        </Router>
      </div>
      <div className="bg-zinc-200 p-5 my-5 rounded-md">
        <p className="font-black text-zinc-500">Bikeapp 2023 - Aleksi Rendel</p>
      </div>
    </div>
  )
}

export default App
