"use client"
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import "./Header.css"
import logoImage from "@/assets/img/LOGOPRO.png"
import { useAuth } from "@/context/authContext";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/register";

  return (
    <header className="container text-light mt-2 mt-md-3 border-bottom">
      {isAuthenticated && !isAuthPage && (
        <div className="row mb-1">
          <div className="col-12">
            <nav className="nav-bar d-flex align-items-center gap-3 flex-wrap" aria-label="Navegación principal">
              <Link href="/home" className={`nav-link-custom ${pathname === "/home" ? "active" : ""}`}>
                <i className="bi bi-house-fill me-1"></i>INICIO
              </Link>
              <Link href="/home/ventas" className={`nav-link-custom ${pathname === "/home/ventas" ? "active" : ""}`}>
                <i className="bi bi-cart-plus me-1"></i>NUEVA VENTA
              </Link>
              <Link href="/home/reportes" className={`nav-link-custom ${pathname === "/home/reportes" ? "active" : ""}`}>
                <i className="bi bi-file-earmark-bar-graph me-1"></i>REPORTES
              </Link>
              <button onClick={logout} className="btn btn-red btn-sm ms-auto btn-logout-nav" aria-label="Cerrar sesión">
                <i className="bi bi-box-arrow-right me-1"></i>SALIR
              </button>
            </nav>
          </div>
        </div>
      )}
      <div className="row align-items-start">
        <div className="col-12 col-md-2 text-center  text-md-start mb-1 mb-md-2 mb-md-0">
          <span>
            Asc. Wari Sur Mz "F" Lt.9 San Juan Bautista - Huamanga - Ayacucho
          </span>
        </div>
        <div className="col-12 col-md-8 header-main mt-1">
          <div className="row align-items-center">
            <div className="col-12 col-md-3 col-lg-3 text-center mb-2 mb-md-0">
              <Image
                src={logoImage}
                alt="Logo de la empresa"
                width={90}
                height={70}
              />
            </div>
            <div className="col-12 col-md-9 col-lg-9 text-center text-md-start">
              <h1 className="text-center title">
                Multiservicios Automotriz
                <span className="line-break d-none d-md-inline"><br /></span>
                "Cars Center"
              </h1>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-12 mt-1">
              <p className="text-center text-md-start mb-2 p-0 p1">
                Venta de repuestos, autopartes, accesorios y suministros para
                todo tipo de vehículos automotores. Mantenimiento y reparación
                de vehículos automotores NCP
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-2 text-center text-md-end mt-md-0 info">
          <div className="text-end txt-info">RUC: 10707965075</div>
          <div className="text-end txt-info">Henry Paqui Tineo</div>
          <div className="text-end txt-info">Cel : 921606968</div>
        </div>
      </div>
    </header>
  );
}
