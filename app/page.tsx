"use client";

import SearchBox from "./components/SearchBox";

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section
        className="relative min-h-[600px] flex flex-col items-center justify-center text-white text-center px-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-4xl">

          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Activá tu MODO AVIÓN ✈
          </h1>

          <p className="text-xl mb-12 opacity-90">
            Descubrí hoteles, vuelos y experiencias únicas al mejor precio
          </p>

          {/* BUSCADOR */}
          <div className="bg-white text-black rounded-2xl shadow-2xl p-6">
            <SearchBox />
          </div>

        </div>
      </section>


      {/* DESTINOS */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold mb-10">
          🌴 Destinos populares
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506929562872-bb421503ef21"
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Cancún</h3>
              <p className="text-gray-500">desde $950</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1529260830199-42c24126f198"
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Roma</h3>
              <p className="text-gray-500">desde $1100</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a"
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">París</h3>
              <p className="text-gray-500">desde $1200</p>
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}