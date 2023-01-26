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
