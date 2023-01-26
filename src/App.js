import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Station from "./components/Station";
import StationList from "./components/StationList";
import Trips from "./components/Trips";

const App = () => {
  const padding = {
    padding: 5,
  };

  const container = {
    width: "800px",
    margin: "auto",
  };

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
              <Link style={padding} to="/station">
                station
              </Link>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<StationList />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/station" element={<Station />} />
          </Routes>

          <div>
            <i>Bikeapp, Aleksi Rendel - 2023</i>
          </div>
        </Router>
      </div>
    </div>
  );
};

export default App;
