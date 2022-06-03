import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import './HomePage.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth0();
  const { isValid, isVendor } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (isValid && isAuthenticated) {
      if (isVendor) {
        navigate('/Main');
        return;
      }
      if (!isVendor) {
        navigate('/NonVendor');
        return;
      }
    }
  }, [isAuthenticated, navigate, isVendor, isValid]);
  if (!isAuthenticated) {
    return (
      <div className="hp__container">
        <img src="/images/logo500.png" alt="JimCo Logo" />
        <div className="hp__message">Please Sign In</div>
      </div>
    );
  } else {
    return <></>;
  }
}
