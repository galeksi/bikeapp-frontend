import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Station from "./components/Station";
import StationList from "./components/StationList";
import Trips from "./components/Trips";

const App = () => {
  const padding = {
    padding: 5,
  };

  return (
    <div>
      <Router>
        <div>
          <h1>Bikeapp 2023</h1>
          <div>
            <Link style={padding} to="/">
              home
            </Link>
            <Link style={padding} to="/trips">
              notes
            </Link>
            <Link style={padding} to="/station">
              users
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
  );
};

export default App;
