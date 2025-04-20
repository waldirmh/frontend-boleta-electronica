'use client'
import Link from 'next/link';
import Image from 'next/image';
import './Home.css';
import imageVenta from '@/assets/img/payment.png';
import imageReporte from '@/assets/img/clock.png';
import { useAuth } from "@/context/authContext";

export default function Home() {


    const { logout, errors } = useAuth();

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className='container col-12 col-sm-12 col-md-12 col-lg-12'>
            <div
                className="d-flex justify-content-start align-items-center mt-2"
            >
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger"
                >
                    SALIR
                </button>

            </div>

            <div className="container-home">
                <Link href="/home/ventas" className="card-home-link">
                    <div className="card-home">
                        <Image
                            className="img img-fluid custom-img-size img-ventas"
                            src={imageVenta}
                            alt="venta"
                            width={170}
                            height={100}
                        />
                        <span className='p-md-2 t1' >NUEVA VENTA</span>
                    </div>
                </Link>

                <Link href="/home/reportes" className="card-home-link">
                    <div className="card-home">
                        <Image
                            className="img img-fluid custom-img-size img-reportes"
                            src={imageReporte}
                            alt="reportes"
                            width={170}
                            height={100}
                        />
                        <span className='p-md-2 t1'>REPORTES</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
