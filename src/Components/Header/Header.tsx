import { Link, useNavigate } from 'react-router-dom';
import { MdLogin, MdLogout, MdHelp } from 'react-icons/md';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { IUserModel } from '../../Interfaces/IUserModel';
import { IVendor } from '../../Interfaces/IVendor';
import RoleBadge from '../../Widgets/Badges/RoleBadge';
import Spinner from '../../Widgets/Spinner/Spinner';
import './Header.css';

function composeName(user: IUserModel | null, vendor: IVendor | null): string {
  return `${user?.displayName || 'No Name'} (${vendor?.name || 'No Vendor'})`;
}

export default function Header() {
  const { isValid, user, vendor } = useUser();
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  return (
    <div className="h__container">
      <Link to="/" className="h__logo">
        <img
          className="h__logoimage"
          src="/images/logo64.png"
          alt="JimCo Logo"
        />
      </Link>
      <div className="h__welcome">Welcome to the JimCo Vendor Portal</div>
      <div className="h__linkcontainer">
        {isLoading && (
          <span>
            <Spinner /> Loading...
          </span>
        )}
        {!isLoading && isAuthenticated && !isValid && (
          <span>
            <Spinner /> Loading&nbsp;User...
          </span>
        )}
        {!isLoading &&
          (isValid && isAuthenticated ? (
            <div className="h__buttoncontainer">
              <RoleBadge />
              <div className="h__name" title={composeName(user, vendor)}>
                {composeName(user, vendor)}
              </div>
              <button
                className="headerfooterbutton"
                type="button"
                onClick={() => navigate('/Support')}
              >
                <span>
                  <MdHelp /> Support{' '}
                </span>
              </button>
              <button
                className="headerfooterbutton"
                type="button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                <span>
                  <MdLogout /> Sign&nbsp;Out
                </span>
              </button>
            </div>
          ) : (
            <div className="h__buttoncontainer">
              <button
                className="headerfooterbutton"
                type="button"
                onClick={loginWithRedirect}
              >
                <span>
                  <MdLogin /> Sign&nbsp;In
                </span>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
