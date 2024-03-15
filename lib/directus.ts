import { createDirectus, rest } from "@directus/sdk";

type RoomTypes = {
  id: string;
  capacity: number;
  price: string;
  name: string;
  rooms: [
    reservations: []
  ];
};

type Rooms = {
  name: string;
};

type Reservations = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  check_in_date: string;
  check_out_date: string;
  room_id: string;
  nights: string;
  total_price: string;
  payment_id: string
};

type Schema = {
  room_types: RoomTypes[];
  rooms: Rooms;
  reservations: Reservations[];
};
const directus = createDirectus<Schema>(
  process.env.DIRECTUS_URL as string
).with(rest());

export default directus;
