import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_STATIONS } from "../queries";
import ReactPaginate from "react-paginate";
import "./pagination.css";

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [fetchStations] = useLazyQuery(ALL_STATIONS, {
    // variables: {
    //   offset: 0,
    //   limit: 20,
    // },
    onCompleted: (data) => {
      setStations(data.allStations);
    },
  });

  useEffect(() => {
    fetchStations({
      // variables: {
      //   offset: 0,
      //   limit: 20,
      // },
    });
  }, [fetchStations]);

  const endOffset = itemOffset + itemsPerPage;
  const stationsToView = stations.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(stations.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    const newOffset = (selected * itemsPerPage) % stations.length;
    setItemOffset(newOffset);
  };

  console.log(stationsToView);

  return (
    <div>
      <h2>StationList</h2>
      <table>
        <tbody>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Capacity</th>
          </tr>
          {stationsToView &&
            stationsToView.map((s) => (
              <tr key={s.id}>
                <td>{s.number}</td>
                <td>{s.nimi}</td>
                <td>{s.osoite}</td>
                <td>{s.kaupunki}</td>
                <td>{s.capacity}</td>
              </tr>
            ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default StationList;
