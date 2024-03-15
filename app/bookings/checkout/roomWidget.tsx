
type RoomType = {
  roomType: string,
  checkInDate: string,
  checkOutDate: string,
  nights: string,
  totalPrice: number
}
export default function RoomWidget({
  roomType,
  checkInDate,
  checkOutDate,
  nights,
  totalPrice,
}: RoomType) {
  return (
    <div>
      <h3>{roomType}</h3>
      <p>Check In Date: <span>{checkInDate}</span></p>
      <p>Check Out Date: <span>{checkOutDate}</span></p>
      <p>Total Cost: {totalPrice}</p>
      <p>{ nights } Night (s)</p>
    </div>
  )
}