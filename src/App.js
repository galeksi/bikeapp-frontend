import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_STATIONS } from './utils/queries'
import Station from './components/Station'
import StationList from './components/StationList'
import Trips from './components/Trips'

const App = () => {
  const [stations, setStations] = useState([])

  const [fetchStations, { loading }] = useLazyQuery(ALL_STATIONS, {
    onCompleted: (data) => {
      setStations(data.allStations)
    },
  })

  useEffect(() => {
    fetchStations()
  }, [fetchStations])

  if (loading) return <h2>Loading ...</h2>

  // const padding = {
  //   padding: 5,
  // }

  // const container = {
  //   width: '800px',
  //   margin: 'auto',
  // }

  return (
    <div className="container mx-auto text-zink-600 tracking-wider">
      <div>
        <Router>
          <div class="flex flex-row bg-zinc-200 p-5 rounded-b-md shadow mb-5">
            <h1 class="grow mx-5 text-2xl font-black text-blue-600">
              BIKEAPP 2023
            </h1>
            <div>
              <Link class="mx-5 text-xl font-black hover:text-blue-600" to="/">
                STATIONS
              </Link>
              <Link
                class="mx-5 text-xl font-black hover:text-blue-600"
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
      <div class="bg-zinc-200 p-5 mt-10 rounded-t-md shadow">
        <p class="font-black text-zinc-500">Bikeapp 2023 - Aleksi Rendel</p>
      </div>
    </div>
  )
}

export default App
