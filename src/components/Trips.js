import { useQuery } from "@apollo/client";
import { ALL_TRIPS } from "../queries";

const Trips = () => {
  const trips = useQuery(ALL_TRIPS, {
    variables: {
      offset: 0,
      limit: 20,
    },
  });

  if (trips.loading) {
    return <div>loading...</div>;
  }

  console.log(trips.data.allTrips);

  return (
    <div>
      <h2>Trips</h2>
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
          {trips.data.allTrips.map((t) => (
            <tr key={t.id}>
              <td>{t.departureStation.nimi}</td>
              <td>{t.departureStation.number}</td>
              <td>
                {new Date(Number(t.departure)).toLocaleDateString("fi-FI")}
              </td>
              <td>
                {new Date(Number(t.departure)).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
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
  );
};

export default Trips;
