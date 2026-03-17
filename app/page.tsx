"use client";

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Sun,
  Building2,
  Globe,
  Loader2,
  Baby,
  Minus,
  Plus
} from "lucide-react";
import Link from "next/link";

// Tipo que coincide con tu API actual
interface Airport {
  id: string;
  name: string;
  iataCode: string;
  address: {
    cityName?: string;
    countryName?: string;
  };
}

// Tipo para pasajeros
interface PassengerConfig {
  adults: number;
  children: number[];
}

// Hook personalizado para detectar el tamaño de viewport
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}

// Componente de búsqueda de aeropuertos conectado a tu API
interface AirportSearchProps {
  value: string;
  onChange: (value: string, airport?: Airport) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  excludeCode?: string;
}

function AirportSearch({ value, onChange, placeholder, label, icon, excludeCode }: AirportSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchAirports = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setAirports([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/airports?keyword=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar aeropuertos');
      }

      const data = await response.json();
      const results = Array.isArray(data) ? data : data.data || [];
      
      const filtered = results.filter((airport: Airport) => 
        airport.iataCode !== excludeCode
      );
      
      setAirports(filtered.slice(0, 8));
      setHighlightedIndex(0);
    } catch (err) {
      console.error('Error fetching airports:', err);
      setError('No se pudieron cargar los aeropuertos');
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, [excludeCode]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchTerm.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        searchAirports(searchTerm);
      }, 300);
    } else {
      setAirports([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, searchAirports]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    setSearchTerm(`${airport.address?.cityName || airport.name} (${airport.iataCode})`);
    onChange(airport.iataCode, airport);
    setIsOpen(false);
    setAirports([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || airports.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < airports.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case "Enter":
        e.preventDefault();
        if (airports[highlightedIndex]) {
          handleSelect(airports[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
    if (!val) {
      setSelectedAirport(null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 2 && airports.length === 0) {
      searchAirports(searchTerm);
    }
  };

  const isCity = (airport: Airport) => {
    return airport.id.startsWith('C') || airport.id.startsWith('city');
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50 font-medium text-gray-800 placeholder-gray-400 pr-10"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}
        {!loading && selectedAirport && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {selectedAirport.iataCode}
            </span>
          </div>
        )}
      </div>

      {isOpen && (airports.length > 0 || loading || error) && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
          
          {loading && (
            <div className="px-4 py-6 text-center">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Buscando aeropuertos...</p>
            </div>
          )}

          {error && !loading && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-red-500">{error}</p>
              <button 
                onClick={() => searchAirports(searchTerm)}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && airports.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {airports.length} resultado{airports.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-gray-400">Powered by Amadeus</span>
              </div>
              
              {airports.map((airport, idx) => {
                const isHighlighted = idx === highlightedIndex;
                const cityName = airport.address?.cityName || airport.name;
                const countryName = airport.address?.countryName || '';
                const cityType = isCity(airport);
                
                return (
                  <button
                    key={airport.id}
                    type="button"
                    onClick={() => handleSelect(airport)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-blue-50 transition-colors text-left ${
                      isHighlighted ? "bg-blue-50 border-l-4 border-blue-500" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      cityType ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {cityType ? <Building2 className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{cityName}</span>
                        <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                          {airport.iataCode}
                        </span>
                        {cityType && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                            Ciudad
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{airport.name}</div>
                      {countryName && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3" />
                          {countryName}
                        </div>
                      )}
                    </div>
                    
                    {isHighlighted && <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
      
      {isOpen && !loading && !error && searchTerm.length >= 2 && airports.length === 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 text-center">
          <div className="text-gray-400 mb-2">
            <Search className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">No se encontraron aeropuertos</p>
          <p className="text-sm text-gray-400 mt-1">
            Probá con otra ciudad o código IATA
          </p>
        </div>
      )}

      {isOpen && !loading && searchTerm.length < 2 && !selectedAirport && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">
            Escribí al menos 2 caracteres para buscar
          </p>
          <div className="flex gap-2 justify-center mt-2 text-xs text-gray-400">
            <span>Ej: "Bue", "Mia", "Mad"</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de selección de pasajeros - VERSIÓN DEFINITIVA CON PORTAL CORREGIDO
interface PassengerSelectorProps {
  value?: PassengerConfig;
  onChange: (config: PassengerConfig) => void;
}

function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Valor por defecto si value es undefined
  const safeValue: PassengerConfig = value || { adults: 1, children: [] };
  
  const totalPassengers = safeValue.adults + safeValue.children.length;
  const maxPassengers = 9;

  // Montar solo en cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular posición del dropdown cuando se abre
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    
    // Calcular posición considerando el scroll
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    setDropdownPosition({
      top: rect.bottom + scrollY + 8,
      left: rect.left + scrollX,
      width: Math.max(320, rect.width)
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      // Recalcular en resize
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen, calculatePosition]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen || !mounted) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // No cerrar si se hace click en el botón
      if (buttonRef.current?.contains(target)) return;
      
      // No cerrar si se hace click dentro del dropdown
      if (dropdownRef.current?.contains(target)) return;
      
      setIsOpen(false);
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, mounted]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const updateAdults = (delta: number) => {
    const newAdults = Math.max(1, Math.min(9, safeValue.adults + delta));
    onChange({ ...safeValue, adults: newAdults });
  };

  const addChild = () => {
    if (totalPassengers >= maxPassengers) return;
    onChange({ ...safeValue, children: [...safeValue.children, 2] });
  };

  const removeChild = (index: number) => {
    const newChildren = safeValue.children.filter((_, i) => i !== index);
    onChange({ ...safeValue, children: newChildren });
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildren = [...safeValue.children];
    newChildren[index] = age;
    onChange({ ...safeValue, children: newChildren });
  };

  const getSummaryText = () => {
    const adultText = `${safeValue.adults} ${safeValue.adults === 1 ? 'adulto' : 'adultos'}`;
    if (safeValue.children.length === 0) return adultText;
    const childText = `${safeValue.children.length} ${safeValue.children.length === 1 ? 'niño' : 'niños'}`;
    return `${adultText}, ${childText}`;
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen) {
      calculatePosition();
    }
    
    setIsOpen(!isOpen);
  };

  // Renderizar dropdown en portal
  const renderDropdown = () => {
    if (!isOpen || !mounted) return null;

    const dropdownContent = (
      <div 
        ref={dropdownRef}
        className="fixed bg-white rounded-2xl shadow-2xl border-2 border-pink-200"
        style={{ 
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 2147483647,
          maxHeight: '450px',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 sticky top-0 z-10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Seleccionar pasajeros
          </h3>
          <p className="text-sm text-pink-100 mt-1">
            Máximo {maxPassengers} pasajeros total
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Adultos */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Adultos</p>
                <p className="text-xs text-gray-500">12+ años</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateAdults(-1);
                }}
                disabled={safeValue.adults <= 1}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-6 text-center">{safeValue.adults}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateAdults(1);
                }}
                disabled={totalPassengers >= maxPassengers}
                className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Niños */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Baby className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Niños</p>
                  <p className="text-xs text-gray-500">2-11 años</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addChild();
                }}
                disabled={totalPassengers >= maxPassengers}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            {safeValue.children.length > 0 && (
              <div className="space-y-2 pl-11">
                {safeValue.children.map((age, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-16">
                      Niño {index + 1}
                    </span>
                    <select
                      value={age}
                      onChange={(e) => updateChildAge(index, parseInt(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 2).map((year) => (
                        <option key={year} value={year}>
                          {year} años
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChild(index);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {safeValue.children.length === 0 && (
              <p className="text-sm text-gray-400 italic pl-11">
                No hay niños seleccionados
              </p>
            )}
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800 flex items-start gap-2">
              <Baby className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Bebés menores de 2 años viajan en brazos. Contactanos para agregarlos.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="font-bold text-lg text-gray-800">
              {totalPassengers} pasajero{totalPassengers !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    );

    return createPortal(dropdownContent, document.body);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
        <Users className="w-4 h-4 text-pink-600" />
        Pasajeros
      </label>
      
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50/50 font-medium text-gray-800 text-left flex items-center justify-between hover:bg-pink-50 transition-colors ${
          isOpen ? 'border-pink-500 ring-2 ring-pink-500' : 'border-pink-200'
        }`}
      >
        <span className="truncate">{getSummaryText()}</span>
        <Users className={`w-5 h-5 text-pink-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {renderDropdown()}
    </div>
  );
}

// LOGO COMPONENT - Versión profesional sin fondo blanco
function Logo({ className = "", size = "normal" }: { className?: string, size?: "small" | "normal" | "large" }) {
  const sizeClasses = {
    small: "text-lg",
    normal: "text-xl",
    large: "text-3xl"
  };

  const iconSizes = {
    small: "w-6 h-6",
    normal: "w-8 h-8",
    large: "w-10 h-10"
  };

  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* OPCIÓN 1: Logo con icono (recomendado, no necesita imagen externa) */}
      <div className="relative">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-0.5 rounded-2xl transform group-hover:rotate-12 transition-transform duration-300">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-2xl">
            <Plane className={`${iconSizes[size]} text-white transform -rotate-45`} />
          </div>
        </div>
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Texto del logo */}
      <div className="flex flex-col">
        <span className={`font-black ${sizeClasses[size]} tracking-tight leading-none`}>
          <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            ACTIVÁ TU
          </span>
        </span>
        <span className={`font-black ${sizeClasses[size]} tracking-tighter leading-none`}>
          <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            MODO AVIÓN
          </span>
        </span>
      </div>

      {/* OPCIÓN 2: Si tenés una imagen de logo, descomentá esto y comentá la OPCIÓN 1:
      <Image 
        src="/logo.png" 
        alt="Activá tu Modo Avión" 
        width={size === "large" ? 200 : size === "small" ? 120 : 160} 
        height={size === "large" ? 60 : size === "small" ? 36 : 48}
        className="object-contain"
      />
      */}
    </Link>
  );
}

export default function Home() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"vuelos" | "hoteles" | "paquetes">("vuelos");
  const [origin, setOrigin] = useState("");
  const [originAirport, setOriginAirport] = useState<Airport | null>(null);
  const [destination, setDestination] = useState("");
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  
  // Estado de pasajeros con valor inicial seguro
  const [passengers, setPassengers] = useState<PassengerConfig>({
    adults: 1,
    children: []
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !date) {
      alert("Completá origen, destino y fecha");
      return;
    }

    setSearching(true);

    try {
      const params = new URLSearchParams();
      params.append('origin', origin);
      params.append('destination', destination);
      params.append('departureDate', date);
      if (returnDate) params.append('returnDate', returnDate);
      params.append('adults', passengers.adults.toString());
      
      if (passengers.children.length > 0) {
        params.append('children', passengers.children.join(','));
        passengers.children.forEach((age, idx) => {
          params.append(`childAge${idx + 1}`, age.toString());
        });
      }

      if (activeTab === "vuelos") {
        router.push(`/vuelos?${params.toString()}`);
      }

      if (activeTab === "hoteles") {
        const hotelParams = new URLSearchParams();
        hotelParams.append('destination', destination);
        hotelParams.append('checkin', date);
        hotelParams.append('checkout', returnDate);
        hotelParams.append('adults', passengers.adults.toString());
        hotelParams.append('children', passengers.children.length.toString());
        router.push(`/hoteles?${hotelParams.toString()}`);
      }

      if (activeTab === "paquetes") {
        router.push(`/paquetes?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      alert('Hubo un error al realizar la búsqueda');
    } finally {
      setSearching(false);
    }
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
      {/* NAVBAR - Logo integrado profesionalmente */}
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* LOGO - Versión limpia sin fondo blanco */}
            <Logo />

            <div className="hidden md:flex items-center gap-1">
              <Link href="/vuelos" className="px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium transition-all">Vuelos</Link>
              <Link href="/hoteles" className="px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium transition-all">Hoteles</Link>
              <Link href="/paquetes" className="px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium transition-all">Paquetes</Link>
              <Link href="/ofertas" className="px-4 py-2 rounded-lg bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all flex items-center gap-1 shadow-lg">
                <Percent className="w-4 h-4" />
                Ofertas
              </Link>
            </div>

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

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

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

      {/* HERO SECTION - FONDO ARUBA/CARIBE */}
      <section className="relative min-h-[750px] pt-20 flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          {/* FOTO DE ARUBA - Playa con palmeras y agua turquesa */}
          <img 
            src="https://images.unsplash.com/photo-1583795460885-b095a4c7078d?w=1920" 
            alt="Aruba - Playa del Caribe"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-800/40 to-cyan-600/70" />
        </div>

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

          {/* SEARCH BOX - z-index alto para que el dropdown esté por encima */}
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-visible border-4 border-yellow-400 relative z-[100]">
            {/* Tabs */}
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

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Origen */}
                <AirportSearch
                  label="Origen"
                  placeholder="¿De dónde salís?"
                  value={origin}
                  onChange={(code, airport) => {
                    setOrigin(code);
                    setOriginAirport(airport || null);
                  }}
                  excludeCode={destination}
                  icon={<MapPin className="w-4 h-4 text-blue-600" />}
                />

                {/* Destino */}
                <AirportSearch
                  label="Destino"
                  placeholder="¿A dónde vas?"
                  value={destination}
                  onChange={(code, airport) => {
                    setDestination(code);
                    setDestinationAirport(airport || null);
                  }}
                  excludeCode={origin}
                  icon={<MapPin className="w-4 h-4 text-green-600" />}
                />

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
                    min={new Date().toISOString().split('T')[0]}
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
                    min={date || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/50 font-medium text-gray-800"
                  />
                </div>

                {/* Selector de pasajeros */}
                <PassengerSelector
                  value={passengers}
                  onChange={setPassengers}
                />
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-3 text-lg shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Buscar {activeTab}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* PROMO BANNER - z-index menor que el search box */}
      <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-4 relative overflow-hidden z-10">
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
                
                <div className="absolute top-4 left-4">
                  <span className={`bg-gradient-to-r ${dest.color} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {dest.tag}
                  </span>
                </div>
                
                {dest.discount && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg animate-pulse">
                      {dest.discount}
                    </span>
                  </div>
                )}
                
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

      {/* BENEFICIOS */}
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

      {/* NEWSLETTER */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
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

      {/* FOOTER - Logo integrado */}
      <footer className="bg-gray-900 text-gray-300 py-16 border-t-4 border-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* FOOTER LOGO - Versión limpia */}
            <div>
              <Logo size="small" className="mb-4" />
              <p className="text-sm mb-4 text-gray-400">
                Tu agencia de viajes online de confianza. Encontrá los mejores precios en vuelos, hoteles y paquetes turísticos al Caribe.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 transition-colors"><Facebook className="w-5 h-5 text-white" /></a>
                <a 
                  href="https://www.instagram.com/activatumodoavion.viajes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-2 rounded-lg hover:opacity-90 transition-all"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="bg-sky-500 p-2 rounded-lg hover:bg-sky-400 transition-colors"><Twitter className="w-5 h-5 text-white" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-lg border-b-2 border-blue-600 pb-2 inline-block">Servicios</h4>
              <ul className="space-y-3">
                <li><Link href="/vuelos" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Plane className="w-4 h-4" /> Vuelos</Link></li>
                <li><Link href="/hoteles" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Hotel className="w-4 h-4" /> Hoteles</Link></li>
                <li><Link href="/paquetes" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><MapPin className="w-4 h-4" /> Paquetes</Link></li>
                <li><Link href="/ofertas" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Percent className="w-4 h-4" /> Ofertas especiales</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-lg border-b-2 border-blue-600 pb-2 inline-block">Empresa</h4>
              <ul className="space-y-3">
                <li><Link href="/nosotros" className="hover:text-yellow-400 transition-colors">Sobre nosotros</Link></li>
                <li><Link href="/contacto" className="hover:text-yellow-400 transition-colors">Contacto</Link></li>
                <li><Link href="/terminos" className="hover:text-yellow-400 transition-colors">Términos y condiciones</Link></li>
                <li><Link href="/privacidad" className="hover:text-yellow-400 transition-colors">Política de privacidad</Link></li>
              </ul>
            </div>

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