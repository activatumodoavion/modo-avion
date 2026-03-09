type Hotel = {
  id: string
  name: string
  location: string
  pricePerNight: number
  image: string
}

export default function HotelOfferCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <img
        src={hotel.image}
        className="h-48 w-full object-cover"
      />

      <div className="p-6">

        <h3 className="font-bold text-lg mb-2">
          {hotel.name}
        </h3>

        <p className="text-gray-600 mb-2">
          {hotel.location}
        </p>

        <p className="font-semibold mb-4">
          Desde USD {hotel.pricePerNight} / noche
        </p>

        <button className="bg-red-500 text-white px-4 py-2 rounded-lg w-full">
          Reservar
        </button>

      </div>
    </div>
  )
}