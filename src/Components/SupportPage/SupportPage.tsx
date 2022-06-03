import { MdHome } from 'react-icons/md';
import { ImFeed } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import contactInfo from '../../static.json';
import './SupportPage.css';

export default function SupportPage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <div className="heading">Support and Contact Information</div>
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
      <div className="content">
        <div className="supp__container">
          <div className="supp__mapcontainer">
            <img
              src="/images/blurred-map.png"
              alt="location map"
              title="Map blurred intentionally. It's not a real place."
            />
          </div>
          <div className="supp__addresscontainer">
            <div className="supp__heading">Our Mailing Address</div>
            {contactInfo.address.map((x) => (
              <div className="supp__addressline" key={uuidv4()}>
                {x}
              </div>
            ))}
          </div>
          <div className="supp__emailcontainer">
            <div className="supp__heading">Contact via Email</div>
            {contactInfo.emailAddresses.map((x) => (
              <div className="supp__emailline" key={uuidv4()}>
                <div className="supp__emaildescription">{x.description}</div>
                <div className="supp__emailaddress">{x.address}</div>
              </div>
            ))}
          </div>
          <div className="supp__phonecontainer">
            <div className="supp__heading">Contact via Phone</div>
            {contactInfo.phoneNumbers.map((x) => (
              <div className="supp__phoneline" key={uuidv4()}>
                <div className="supp__phonedescription">{x.description}</div>
                <div className="supp__phonenumber">{x.number}</div>
              </div>
            ))}
          </div>
          <div className="supp__subscribecontainer">
            <div className="supp__heading">
              <ImFeed />
              &nbsp;Subscribe to our Vendor Feed!&nbsp;
              <ImFeed />
            </div>
            <div className="supp__subscribe">
              Send an email to{' '}
              <span className="supp__feedaddress">vendorfeed@jimco.online</span>{' '}
              with the word <span className="supp__emphasized">SUBSCRIBE</span>{' '}
              in the subject line. Receive weekly updates from our vendor
              support team. Unsubscribe at any time by sending an email to that
              same address with the word{' '}
              <span className="supp__emphasized">UNSUBSCRIBE</span> in the
              subject.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
