"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `relative hover:text-gray-300 transition ${
      pathname === path ? "text-blue-400 font-semibold" : ""
    }`;

  const indicatorStyle = (path: string) =>
    `absolute -bottom-2 left-0 h-[2px] bg-blue-400 rounded-full transition-all duration-300 ${
      pathname === path ? "w-full opacity-100" : "w-0 opacity-0"
    }`;

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-black/80 text-white px-6 py-4 flex justify-between items-center border-b border-white/10">
      
      <Link href="/" className="text-xl font-bold">
        MODO AVIÓN ✈️
      </Link>

      <div className="space-x-8 text-sm">

        <Link href="/vuelos" className={linkStyle("/vuelos")}>
          Vuelos
          <span className={indicatorStyle("/vuelos")} />
        </Link>

        <Link href="/hoteles" className={linkStyle("/hoteles")}>
          Hoteles
          <span className={indicatorStyle("/hoteles")} />
        </Link>

        <Link href="/mi-viaje" className={linkStyle("/mi-viaje")}>
          Mi Viaje
          <span className={indicatorStyle("/mi-viaje")} />
        </Link>

      </div>
    </nav>
  );
}