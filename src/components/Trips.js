import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { LATEST_TRIPS } from "../queries";
import ReactPaginate from "react-paginate";
import "./pagination.css";

const Trips = () => {
  // const trips = useQuery(LATEST_TRIPS, {
  //   variables: {
  //     limit: 20,
  //   },
  // });

  // if (trips.loading) {
  //   return <div>loading...</div>;
  // }

  const [trips, setTrips] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  // const [itemsPerPage, setItemsPerPage] = useState(20);

  const [fetchTrips, { loading }] = useLazyQuery(LATEST_TRIPS, {
    onCompleted: (data) => {
      setTrips(data.latestTrips);
    },
  });

  useEffect(() => {
    fetchTrips({
      variables: {
        limit: 100,
      },
    });
  }, [fetchTrips]);

  if (loading) return <h2>Loading ...</h2>;

  const itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const tripsToView = trips.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(trips.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    const newOffset = (selected * itemsPerPage) % trips.length;
    setItemOffset(newOffset);
  };

  // console.log(tripsToView);

  return (
    <div>
      <h2>Trips</h2>
      <ReactPaginate
        activeClassName={"item active "}
        breakClassName={"item break-me "}
        breakLabel={"..."}
        containerClassName={"pagination"}
        disabledClassName={"disabled-page"}
        marginPagesDisplayed={2}
        nextClassName={"item next "}
        nextLabel={"forward >"}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        pageClassName={"item pagination-page "}
        pageRangeDisplayed={2}
        previousClassName={"item previous"}
        previousLabel={"< back"}
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
          {tripsToView.map((t) => (
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
