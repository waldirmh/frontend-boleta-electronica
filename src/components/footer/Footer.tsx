import Image from 'next/image';
import './Footer.css';

import imageFord from '@/assets/img/ford.png';
import imageNissan from '@/assets/img/nissan.png';
import imageHyundai from '@/assets/img/hyundai.png';
import imageVolckswagen from '@/assets/img/volkswagen.png';
import imageToyota from '@/assets/img/toyota.png';
import imageSusuki from '@/assets/img/susuki.png';
import imageMitsubishi from '@/assets/img/mitsubishi.png';
import imageKia from '@/assets/img/kia.png';
import imageIsuzu from '@/assets/img/isuzu.png';

export default function Footer() {
  return (
    <footer className="footer mt-auto mb-3">
      <div className="container d-flex justify-content align-items-center border-top pt-3">
        <ul className="list-group list-group-horizontal ms-auto align-items-center">
          <li className="list-group me-3 d-flex align-items-center">
            <Image className="img img-fluid custom-img-size" src={imageFord} alt="logo ford" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageNissan} alt="logo nissan" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageHyundai} alt="logo hyundai" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageVolckswagen} alt="logo volkswagen" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageToyota} alt="logo toyota" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageSusuki} alt="logo susuki" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageMitsubishi} alt="logo mitsubishi" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageKia} alt="logo kia" width={50} height={50} />
          </li>
          <li className="list-group me-3">
            <Image className="img img-fluid custom-img-size" src={imageIsuzu} alt="logo isuzu" width={50} height={50} />
          </li>
        </ul>
        <p className="text-end text-light w-100 txt">
          2025 &copy; Todos los Derechos Reservados
        </p>
      </div>
    </footer>
  );
}
