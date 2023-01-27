import { gql } from "@apollo/client";

export const ALL_STATIONS = gql`
  query allStations($offset: Int, $limit: Int) {
    allStations(offset: $offset, limit: $limit) {
      capacity
      id
      kaupunki
      lat
      long
      nimi
      number
      osoite
    }
  }
`;

export const SINGLE_STATION = gql`
  query singleStation($id: String) {
    singleStation(id: $id) {
      capacity
      id
      kaupunki
      lat
      long
      nimi
      number
      osoite
    }
  }
`;

export const STATION_STATS = gql`
  query stationWithStats($id: String) {
    stationStats(id: $id) {
      stationId
      startTotal
      returnTotal
      startAvg
      returnAvg
      popularReturn
      popularDeparture
    }
    singleStation(id: $id) {
      capacity
      id
      kaupunki
      lat
      long
      nimi
      number
      osoite
    }
  }
`;

export const ALL_TRIPS = gql`
  query allTrips($offset: Int, $limit: Int) {
    allTrips(offset: $offset, limit: $limit) {
      departure
      departureStation {
        id
        nimi
        number
      }
      distance
      duration
      id
      return
      returnStation {
        id
        nimi
        number
      }
    }
  }
`;

export const LATEST_TRIPS = gql`
  query latestTrips($limit: Int) {
    latestTrips(limit: $limit) {
      departure
      departureStation {
        id
        nimi
        number
      }
      distance
      duration
      id
      return
      returnStation {
        id
        nimi
        number
      }
    }
  }
`;
