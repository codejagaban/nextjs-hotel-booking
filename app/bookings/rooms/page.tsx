import { getRoomTypes } from "@/lib/apis";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Rooms({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  console.log(searchParams);
  const { capacity, checkInDate, checkOutDate } = searchParams;

  const formattedCheckInDate = dayjs(checkInDate).format("YYYY-MM-DD");
  const formattedCheckOutDate = dayjs(checkOutDate).format("YYYY-MM-DD");
  const roomTypes = await getRoomTypes(
    formattedCheckInDate,
    formattedCheckOutDate,
    capacity
  );

  return (
    <main>
      <div>
        <h1>Select a Room of your choice</h1>
        <div>
          {roomTypes &&
            roomTypes.map((roomType) => {
              return (
                <div key={roomType.id}>
                  <h2>{roomType.name}</h2>
                  <p>capacity: {roomType.capacity}</p>
                  <p>Price per night: {roomType.price}</p>
                  {roomType.rooms.length > 0 ? (
                    <Link
                      href={`/bookings/checkout?checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}&room=${roomType.rooms[0]}&price=${roomType.price}&roomType=${roomType.name}`}
                    >
                      Book room
                    </Link>
                  ) : (
                    "Room unavailable"
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
