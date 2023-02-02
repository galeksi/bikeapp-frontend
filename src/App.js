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

  const padding = {
    padding: 5,
  }

  const container = {
    width: '800px',
    margin: 'auto',
  }

  return (
    <div style={container}>
      <div>
        <Router>
          <div>
            <h1>Bikeapp 2023</h1>
            <div>
              <Link style={padding} to="/">
                stations
              </Link>
              <Link style={padding} to="/trips">
                trips
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

          {/* <div>
            <i>Bikeapp, Aleksi Rendel - 2023</i>
          </div> */}
        </Router>
      </div>
    </div>
  )
}

export default App
