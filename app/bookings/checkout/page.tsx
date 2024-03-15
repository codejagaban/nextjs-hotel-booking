import dayjs from "dayjs";
import BookingForm from "./form";
import RoomWidget from "./roomWidget";


export default async function Bookings({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { checkInDate, checkOutDate, room, price, roomType } = searchParams;
  // Calculate the number of nights
  const nights = dayjs(checkOutDate).diff(checkInDate, "day");
  const totalPrice = nights * Number(price);
  return (
    <main>
      <div>
        <RoomWidget
          roomType={roomType}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          totalPrice={totalPrice}
          nights={nights.toString()}
        />
        <BookingForm
          roomID={room}
          nights={nights.toString()}
          price={totalPrice}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          roomType={roomType}
        />
      </div>
    </main>
  );
}
