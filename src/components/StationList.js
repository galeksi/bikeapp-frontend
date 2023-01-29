import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.css";

var _ = require("lodash");

const StationList = (params) => {
  const [itemOffset, setItemOffset] = useState(20);
  const [searchedStations, setSearch] = useState("");

  useEffect(() => {});

  const stations = searchedStations === "" ? params.stations : searchedStations;
  const itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const stationsToView = stations.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(stations.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    const newOffset = (selected * itemsPerPage) % stations.length;
    setItemOffset(newOffset);
  };

  const searchStations = (event) => {
    event.preventDefault();
    const content = event.target.search.value;
    event.target.search.value = "";
    // const filteredStations = _.filter(params.stations, (s) =>
    //   _.includes(s, content)
    // );
    const filteredStations = params.stations.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(content.toLowerCase())
    );
    console.log(filteredStations);
    setItemOffset(0);
    setSearch(filteredStations);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div>
      <h2>StationList</h2>
      <div>
        <form onSubmit={searchStations}>
          <input name="search" />
          <button type="submit">Search</button>
          <button onClick={clearSearch}>Clear search</button>
        </form>
      </div>
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
                <td>
                  <Link to={`/station/${s.id}`}>{s.nimi}</Link>
                </td>
                <td>{s.osoite}</td>
                <td>{s.kaupunki}</td>
                <td>{s.capacity}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StationList;
