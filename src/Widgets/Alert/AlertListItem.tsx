import { MouseEventHandler, useState, useEffect } from 'react';
import { IAlert } from '../../Interfaces/IAlert';
import { alertIcon, alertLevel } from '../../Services/tools';
import { getNameFromEmail } from '../../Services/UserService';
import { useAuth0 } from '@auth0/auth0-react';
import './AlertListItem.css';
import { MdDelete } from 'react-icons/md';

type Props = {
  alert: IAlert;
  onClick: MouseEventHandler<HTMLDivElement>;
  onDelete?: (alert: IAlert) => void;
};

export default function AlertListItem({ alert, onClick, onDelete }: Props) {
  const [name, setName] = useState<string>('');
  const { isLoading, getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    async function getName() {
      if (!isLoading && alert) {
        const n = await getNameFromEmail(
          alert.creator,
          await getAccessTokenSilently(),
        );
        setName(n);
      }
    }
    getName();
  }, [alert, isLoading, getAccessTokenSilently]);
  useEffect(() => {
    // there is a clickable button in a clickable div, needs some special handling
    const button = document.getElementById('ali__deletebutton' + alert.id);
    if (button) {
      button.addEventListener('click', noPropagate);
    }
    return () => button?.removeEventListener('click', noPropagate);
  });
  function noPropagate(e: Event) {
    e.stopPropagation();
    if (onDelete !== null && onDelete !== undefined) {
      onDelete(alert);
    }
  }
  return (
    <div className="ali__container" onClick={onClick}>
      <div className="ali__icon">
        <img src={alertIcon(alert)} alt="" title={alertLevel(alert)} />
      </div>
      <div className="ali__date">
        {new Date(alert.createDate).toLocaleDateString()}
      </div>
      <div className="ali__creator">{name}</div>
      <div className="ali__title">{alert.title}</div>
      {onDelete !== null && onDelete !== undefined && (
        <div className="ali__buttoncontainer">
          <button
            className="squarebutton dangerbutton"
            id={`ali__deletebutton${alert.id}`}
            type="button"
            onClick={() => onDelete(alert)}
            title={`Delete this ${alert.identifier ? 'Alert' : 'Notice'}`}
            disabled={alert.requiresAcknowledgement && !alert.acknowledged}
          >
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
}
