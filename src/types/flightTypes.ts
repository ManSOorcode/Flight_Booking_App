export interface FlightData {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  airline: string;
  price: number;
  seatsAvailable: number;
  seatsBooked: number;
  departure_airport: {
    name: string;
    id: string;
    time: string;
  };
  arrival_airport: {
    name: string;
    id: string;
    time: string;
  };
  duration: number;
  airplane: string;
  airline_logo: string;
  flight_number: string;
  travel_class: string;
  legroom: string;
  extensions: string[];
}

export interface RawFlightData {
  flight_date: string;
  flight_status: string;
  departure: {
    airport?: string;
    iata?: string;
    scheduled?: string;
  };
  arrival: {
    airport?: string;
    iata?: string;
    scheduled?: string;
  };
  airline: {
    name: string;
  };
  flight: {
    number: string;
    iata: string;
  };
}
