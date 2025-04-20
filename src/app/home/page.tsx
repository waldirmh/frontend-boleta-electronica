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
        <div>
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
                <Link href="/ventas" className="card-home-link">
                    <div className="card-home">
                        <Image
                            className="img img-fluid custom-img-size"
                            src={imageVenta}
                            alt="venta"
                            width={170}
                            height={100}
                        />
                        <span>NUEVA VENTA</span>
                    </div>
                </Link>

                <Link href="/reportes" className="card-home-link">
                    <div className="card-home">
                        <Image
                            className="img img-fluid custom-img-size"
                            src={imageReporte}
                            alt="reportes"
                            width={170}
                            height={100}
                        />
                        <span>REPORTES</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
