import { useNavigate } from 'react-router-dom';
import { MdHome } from 'react-icons/md';
import './NoticePage.css';

export default function NoticePage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <div className="heading">Manage your Notices and Alerts</div>
        <button
          className="primarybutton headerbutton-left"
          type="button"
          onClick={() => navigate('/Home')}
        >
          <span>
            <MdHome /> Home
          </span>
        </button>
      </div>
    </div>
  );
}
