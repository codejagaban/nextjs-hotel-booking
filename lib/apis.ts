import directus from "./directus";
import { readItems, createItem } from "@directus/sdk";

type ReservationData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  check_in_date: string;
  check_out_date: string;
  room_id: string;
  nights: string;
  total_price: string;
  payment_id: string;
};
export const getRoomTypes = async (
  checkInDate: string,
  checkOutDate: string,
  capacity: string
) => {
  try {
    const availableRooms = await directus.request(
      readItems("room_types", {
        // fetches all fields from room_types
        fields: ["*"],
        filter: {
          // check if the capacity is greater than the requested capacity
          capacity: { _gte: Number(capacity) },
        },
        deep: {
          rooms: {
            // limit the rooms that will be returned to just one as you only need the first available room
            _limit: 1,
            _filter: {
              _or: [
                // check if the room is available and if the check_in_date is empty
                {
                  _and: [
                    {
                      is_available: true,
                      reservations: {
                        check_in_date: { _null: true },
                      },
                    },
                  ],
                },
                // check if the room is available and if the check_out_date is empty
                {
                  _and: [
                    {
                      is_available: true,
                      reservations: {
                        check_out_date: { _null: true },
                      },
                    },
                  ],
                },
                // check if the check_out_date is less than the requested checkInDate
                {
                  _and: [
                    {
                      is_available: true,
                      reservations: {
                        check_out_date: { _lt: checkInDate },
                      },
                    },
                  ],
                },
                // check if the check_in_date is less than the requested checkOutDate
                {
                  _and: [
                    {
                      is_available: true,
                      reservations: {
                        check_in_date: { _gt: checkOutDate },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      })
    );
    console.log(availableRooms);
    return availableRooms;
  } catch (error) {
    console.error("Error fetching available room types:", error);
    // Handle the error as needed
    console.log(error);
  }
};

export const makeReservation = async (reservationData: ReservationData) => {
  try {
    const data = await directus.request(
      createItem("reservations", {
        ...reservationData,
      })
    );
    return "Booking Successful";
  } catch (error) {
    console.error("Error creating a reservation:", error);
    // Handle the error as needed
    console.log(error);
  }
};
