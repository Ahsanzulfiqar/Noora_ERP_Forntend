import logoSm from '@/assets/images/logo-sm.png';
import { Link } from 'react-router-dom';
const LogoBox = () => {
  return <div className="logo-box">
      <Link to="/" className="logo-dark text-decoration-none">
        <img src={logoSm} width={28} height={26} className="logo-sm" alt="logo sm" />
        <span className="logo-lg fw-bold fs-22 text-dark ms-1 align-middle">Noora</span>
      </Link>
      <Link to="/" className="logo-light text-decoration-none">
        <img src={logoSm} width={28} height={26} className="logo-sm" alt="logo sm" />
        <span className="logo-lg fw-bold fs-22 text-white ms-1 align-middle">Noora</span>
      </Link>
    </div>;
};
export default LogoBox;