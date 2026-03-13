"use client";

import { useState } from "react";
import { 
  Plane, 
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  Search,
  ArrowRight,
  Star,
  Shield,
  Clock,
  CreditCard,
  CheckCircle,
  Percent,
  Headphones,
  Menu,
  X,
  User,
  ShoppingCart,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  ChevronRight,
  Heart,
  Sparkles,
  Palmtree,
  Umbrella,
  Sun
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"vuelos" | "hoteles" | "paquetes">("vuelos");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscando:", { activeTab, origin, destination, date, returnDate, passengers });
    alert(`Buscando ${activeTab} desde ${origin} a ${destination}`);
  };

  const destinations = [
    { 
      name: "Cancún", 
      country: "México",
      price: "$950", 
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600",
      tag: "Más popular",
      discount: "15% OFF",
      color: "from-blue-500 to-cyan-400"
    },
    { 
      name: "Punta Cana", 
      country: "República Dominicana",
      price: "$1.100", 
      image: "https://images.unsplash.com/photo-1583795460885-b095a4c7078d?w=600",
      tag: "Todo incluido",
      discount: "20% OFF",
      color: "from-green-500 to-emerald-400"
    },
    { 
      name: "Varadero", 
      country: "Cuba",
      price: "$890", 
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
      tag: "Playa",
      discount: null,
      color: "from-orange-500 to-yellow-400"
    },
    { 
      name: "San Andrés", 
      country: "Colombia",
      price: "$650", 
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
      tag: "Económico",
      discount: "10% OFF",
      color: "from-purple-500 to-pink-400"
    },
    { 
      name: "Riviera Maya", 
      country: "México",
      price: "$1.250", 
      image: "https://images.unsplash.com/photo-1552074291-ad4dfdc360d4?w=600",
      tag: "Lujo",
      discount: null,
      color: "from-teal-500 to-cyan-400"
    },
    { 
      name: "Jamaica", 
      country: "Caribe",
      price: "$1.400", 
      image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600",
      tag: "Exótico",
      discount: "25% OFF",
      color: "from-red-500 to-orange-400"
    },
  ];

  const benefits = [
    { icon: <Percent className="w-8 h-8" />, title: "Mejores precios", desc: "Garantizamos el mejor precio o te devolvemos la diferencia", color: "bg-green-500" },
    { icon: <Shield className="w-8 h-8" />, title: "Compra 100% segura", desc: "Tu información está protegida con encriptación SSL", color: "bg-blue-500" },
    { icon: <Clock className="w-8 h-8" />, title: "Atención 24/7", desc: "Nuestro equipo está disponible para ayudarte siempre", color: "bg-purple-500" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "Cancelación flexible", desc: "Modifica o cancela tu reserva sin problemas", color: "bg-orange-500" },
    { icon: <CreditCard className="w-8 h-8" />, title: "Cuotas sin interés", desc: "Pagá en hasta 12 cuotas sin interés", color: "bg-pink-500" },
    { icon: <Sparkles className="w-8 h-8" />, title: "Experiencias únicas", desc: "Accedé a tours exclusivos en cada destino", color: "bg-yellow-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-white">
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-bold text-white drop-shadow-md">
                  Activá tu <span className="text-yellow-300">MODO AVIÓN</span>
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/vuelos" className="px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium transition-all">Vuelos</Link>
              <Link href="/hoteles" className="px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium transition-all">Hoteles</Link>
              <Link href="/paquetes" className="px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium transition-all">Paquetes</Link>
              <Link href="/ofertas" className="px-4 py-2 rounded-lg bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all flex items-center gap-1 shadow-lg">
                <Percent className="w-4 h-4" />
                Ofertas
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-all">
                <ShoppingCart className="w-6 h-6" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItems}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="hidden md:flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-blue-800 transition-all shadow-lg"
              >
                <User className="w-4 h-4" />
                Ingresar
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 bg-blue-800 rounded-b-2xl mb-4">
              <div className="flex flex-col gap-2 px-4">
                <Link href="/vuelos" className="text-white hover:bg-white/20 px-4 py-3 rounded-lg font-medium">Vuelos</Link>
                <Link href="/hoteles" className="text-white hover:bg-white/20 px-4 py-3 rounded-lg font-medium">Hoteles</Link>
                <Link href="/paquetes" className="text-white hover:bg-white/20 px-4 py-3 rounded-lg font-medium">Paquetes</Link>
                <Link href="/ofertas" className="bg-yellow-400 text-blue-900 px-4 py-3 rounded-lg font-bold">Ofertas</Link>
                <button 
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-white text-blue-600 px-4 py-3 rounded-lg font-bold text-center mt-2"
                >
                  Ingresar / Registrarse
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION - FONDO CARIBE */}
      <section className="relative min-h-[750px] pt-16 flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
        {/* Background Caribe */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544144433-d50aff500b91?w=1920" 
            alt="Caribe"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/50 to-cyan-600/80" />
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-32 left-10 animate-bounce">
          <Palmtree className="w-16 h-16 text-yellow-300/30" />
        </div>
        <div className="absolute bottom-40 right-10 animate-pulse">
          <Sun className="w-20 h-20 text-yellow-400/20" />
        </div>

        <div className="relative z-10 max-w-5xl w-full">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg transform hover:scale-105 transition-transform">
              ✈️ Tu agencia de viajes online #1
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
              Activá tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">MODO AVIÓN</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-10 max-w-2xl mx-auto font-medium drop-shadow-lg">
              Descubrí hoteles, vuelos y experiencias únicas al mejor precio. 
              <span className="block text-yellow-300 mt-2">¡El Caribe te espera! 🌴</span>
            </p>
          </div>

          {/* SEARCH BOX CON COLORES */}
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400">
            {/* Tabs con colores */}
            <div className="flex">
              <button
                onClick={() => setActiveTab("vuelos")}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-lg transition-all ${
                  activeTab === "vuelos" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-inner" 
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                }`}
              >
                <Plane className="w-5 h-5" />
                Vuelos
              </button>
              <button
                onClick={() => setActiveTab("hoteles")}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-lg transition-all ${
                  activeTab === "hoteles" 
                    ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-inner" 
                    : "bg-gray-100 text-gray-600 hover:bg-green-50"
                }`}
              >
                <Hotel className="w-5 h-5" />
                Hoteles
              </button>
              <button
                onClick={() => setActiveTab("paquetes")}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-lg transition-all ${
                  activeTab === "paquetes" 
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-inner" 
                    : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                }`}
              >
                <MapPin className="w-5 h-5" />
                Paquetes
              </button>
            </div>

            {/* Search Form con bordes de color */}
            <form onSubmit={handleSearch} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Origen */}
                <div className="relative">
                  <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Origen
                  </label>
                  <input
                    type="text"
                    placeholder="¿De dónde salís?"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50 font-medium text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Destino */}
                <div className="relative">
                  <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    Destino
                  </label>
                  <input
                    type="text"
                    placeholder="¿A dónde vas?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 font-medium text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Ida */}
                <div className="relative">
                  <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Ida
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/50 font-medium text-gray-800"
                  />
                </div>

                {/* Vuelta */}
                <div className="relative">
                  <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Vuelta
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/50 font-medium text-gray-800"
                  />
                </div>

                {/* Pasajeros */}
                <div className="relative">
                  <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
                    <Users className="w-4 h-4 text-pink-600" />
                    Pasajeros
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50/50 font-medium text-gray-800 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'pasajero' : 'pasajeros'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-3 text-lg shadow-xl transform hover:scale-[1.02]"
              >
                <Search className="w-6 h-6" />
                Buscar {activeTab}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-bold text-lg flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            ¡Oferta especial! Hasta 30% de descuento en vuelos al Caribe 
            <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-lg font-black shadow-lg mx-2">
              Código: CARIBE30
            </span>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </p>
        </div>
      </section>

      {/* DESTINOS POPULARES */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
            DESTINOS MÁS BUSCADOS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🌴 Paraísos del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Caribe</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Descubrí estos destinos increíbles con los mejores precios del mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <div key={idx} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border-2 border-gray-100 hover:border-blue-300">
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className={`bg-gradient-to-r ${dest.color} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {dest.tag}
                  </span>
                </div>
                
                {/* Discount */}
                {dest.discount && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg animate-pulse">
                      {dest.discount}
                    </span>
                  </div>
                )}
                
                {/* Heart button */}
                <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-50">
                  <Heart className="w-6 h-6 text-red-500" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{dest.name}</h3>
                    <p className="text-gray-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {dest.country}
                    </p>
                  </div>
                  <div className="text-right bg-blue-50 px-4 py-2 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold uppercase">desde</p>
                    <p className="text-2xl font-black text-blue-600">{dest.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2 font-medium">(4.8)</span>
                </div>
                
                <button className={`w-full bg-gradient-to-r ${dest.color} text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]`}>
                  Ver ofertas
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
            Ver todos los destinos
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* BENEFICIOS CON COLORES */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
              ¿POR QUÉ ELEGIRNOS?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Tu mejor opción para <span className="text-blue-600">viajar</span> ✈️
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-gray-200 hover:border-blue-400">
                <div className={`${benefit.color} text-white p-4 rounded-2xl inline-block mb-4 shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER - FONDO COLORIDO */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20">
            <Mail className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              ¡No te pierdas ninguna <span className="text-yellow-300">oferta</span>!
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Suscribite y recibí las mejores promociones de vuelos y hoteles directamente en tu email. 
              <span className="block text-yellow-300 font-bold mt-2">¡Descuentos exclusivos para suscriptores!</span>
            </p>
            
            <form className="max-w-lg mx-auto flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu mejor email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 font-medium shadow-lg"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
              >
                Suscribirme 🚀
              </button>
            </form>
            <p className="text-sm text-blue-200 mt-4">
              * Al suscribirte aceptás recibir promociones. Podés darte de baja cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-16 border-t-4 border-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Activá tu <span className="text-yellow-400">MODO AVIÓN</span>
                </span>
              </div>
              <p className="text-sm mb-4 text-gray-400">
                Tu agencia de viajes online de confianza. Encontrá los mejores precios en vuelos, hoteles y paquetes turísticos al Caribe.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 transition-colors"><Facebook className="w-5 h-5 text-white" /></a>
                <a href="#" className="bg-pink-600 p-2 rounded-lg hover:bg-pink-500 transition-colors"><Instagram className="w-5 h-5 text-white" /></a>
                <a href="#" className="bg-sky-500 p-2 rounded-lg hover:bg-sky-400 transition-colors"><Twitter className="w-5 h-5 text-white" /></a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg border-b-2 border-blue-600 pb-2 inline-block">Servicios</h4>
              <ul className="space-y-3">
                <li><Link href="/vuelos" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Plane className="w-4 h-4" /> Vuelos</Link></li>
                <li><Link href="/hoteles" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Hotel className="w-4 h-4" /> Hoteles</Link></li>
                <li><Link href="/paquetes" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><MapPin className="w-4 h-4" /> Paquetes</Link></li>
                <li><Link href="/ofertas" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Percent className="w-4 h-4" /> Ofertas especiales</Link></li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg border-b-2 border-blue-600 pb-2 inline-block">Empresa</h4>
              <ul className="space-y-3">
                <li><Link href="/nosotros" className="hover:text-yellow-400 transition-colors">Sobre nosotros</Link></li>
                <li><Link href="/contacto" className="hover:text-yellow-400 transition-colors">Contacto</Link></li>
                <li><Link href="/terminos" className="hover:text-yellow-400 transition-colors">Términos y condiciones</Link></li>
                <li><Link href="/privacidad" className="hover:text-yellow-400 transition-colors">Política de privacidad</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg border-b-2 border-blue-600 pb-2 inline-block">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="font-medium">+54 9 0351 203-6281</span>
                </li>
                <li className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <a href="mailto:admin@activatumodoavion.com" className="hover:text-yellow-400 transition-colors text-sm">
                    admin@activatumodoavion.com
                  </a>
                </li>
                <li className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <a href="mailto:info@activatumodoavion.com" className="hover:text-yellow-400 transition-colors text-sm">
                    info@activatumodoavion.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">&copy; 2024 Activá tu MODO AVIÓN. Todos los derechos reservados.</p>
            <p className="mt-2 text-blue-500 font-bold">www.activatumodoavion.com</p>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl border-4 border-blue-200">
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-2xl inline-block mb-4 shadow-lg">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h2>
              <p className="text-gray-600">Ingresá a tu cuenta de <span className="text-blue-600 font-bold">Activá tu MODO AVIÓN</span></p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg transform hover:scale-[1.02]"
              >
                Ingresar
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tenés cuenta?{' '}
                <button className="text-blue-600 font-bold hover:underline">
                  Registrate gratis
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHAT WIDGET */}
      <button className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 border-4 border-white">
        <Headphones className="w-7 h-7" />
      </button>
    </main>
  );
}