import Link from 'next/link';
import Image from 'next/image';
import './Home.css';

import imageVenta from '@/assets/img/payment.png';
import imageReporte from '@/assets/img/clock.png';

export default function Home() {
    return (
        <div>
            <div
                className="exit d-flex justify-content-center align-items-center mt-2"
                style={{ width: '80px', height: '40px', border: '1px solid red' }}
            >
                <Link href="/" className="text-decoration-none text-danger" style={{ display: 'block' }}>
                    SALIR
                </Link>
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
