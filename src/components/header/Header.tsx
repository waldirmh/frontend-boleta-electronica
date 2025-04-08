
import styles from './Header.module.css'
export default function Header() {
    return (
      <header className="container text-light mt-3 border-bottom">
        <div className="row align-items-start">
          <div className="col-md-2">
            <span>
              Asc. Wari Sur Mz "F" Lt.9 San Juan Bautista - Huamanga - Ayacucho
            </span>
          </div>
        
          <div className="col-md-8 header-main mt-1">
            <div className="row">
              <div className="col-md-2 text-center pt-2">
                <img src="/img/LOGOPRO.png" alt="Logo" className="mx-auto logo" />
              </div>
              <div className="col-md-8 mt-0 p-0">
                <h1 className="text-center">
                  Multiservicios Automotriz <br />
                  "Cars Center"
                </h1>
              </div>
            </div>
  
            <div className="row">
              <div className="col-md-12 mt-1">
                <p className="text-center">
                  Venta de repuestos, autopartes, accesorios y suministros para
                  todo tipo de vehículos automotores. Mantenimiento y reparación
                  de vehículos automotores NCP
                </p>
              </div>
            </div>
          </div>
  
          <div className="col-md-2">
            <div className="text-end">RUC: 10707965075</div>
            <div className="text-end">Henry Paqui Tineo</div>
            <div className="text-end">Cel : 921606968</div>
          </div>
        </div>
      </header>
    );
  }
  