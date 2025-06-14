export interface Booking {
  id: string;
  userEmail: string;
  flightId: string;
  from: string;
  to: string;
  airline: string;
  departure: string;
  arrival: string;
  passengers: {
    name: string;
    age: number;
  }[];
  totalAmount: number;
  bookingDate: string;
}
