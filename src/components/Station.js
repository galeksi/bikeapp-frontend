import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { STATION_STATS } from "../queries";

const Station = () => {
  const id = useParams().id;
  const stationData = useQuery(STATION_STATS, {
    variables: {
      id: id,
    },
  });

  if (stationData.loading) {
    return <h2>loading...</h2>;
  }

  const station = stationData.data.singleStation;
  const stats = stationData.data.stationStats;

  return (
    <div>
      <h1>
        Station Nr {station.number}: {station.nimi}
      </h1>
      <h2>
        {station.osoite}&nbsp;{station.kaupunki}
      </h2>
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
          {stats.popularReturn.map((s) => (
            <li>{s}</li>
          ))}
        </ol>
        <p>
          <b>Most popular departure station to here:</b>
        </p>
        <ol>
          {stats.popularDeparture.map((s) => (
            <li>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Station;
