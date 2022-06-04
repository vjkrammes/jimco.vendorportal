import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import { MdCheck, MdHome } from 'react-icons/md';
import {
  acknowledgeAlert,
  getAlerts,
  deleteAlert,
} from '../../Services/AlertService';
import { IAlert } from '../../Interfaces/IAlert';
import { IAlertIdentity } from '../../Interfaces/IAlertIdentity';
import { isSuccessResult } from '../../Services/tools';
import HideWidget from '../../Widgets/Hide/HideWidget';
import AlertListItem from '../../Widgets/Alert/AlertListItem';
import AlertDetails from '../../Widgets/Alert/AlertDetails';
import './NoticePage.css';

export default function NoticePage() {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [notices, setNotices] = useState<IAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { isValid, isVendor } = useUser();
  const { setAlert } = useAlert();
  const modal = document.getElementById('np__modal');
  const navigate = useNavigate();
  const doLoadAlerts = useCallback(async () => {
    if (user && isValid) {
      const id: IAlertIdentity = {
        identifier: user.sub!,
        roles: ['Vendor'],
      };
      const result = await getAlerts(id, await getAccessTokenSilently());
      if (result) {
        setAlerts(result.alerts);
        setNotices(result.notices);
      } else {
        setAlerts([]);
        setNotices([]);
      }
    }
  }, [user, isValid, getAccessTokenSilently]);
  useEffect(() => {
    if (!isAuthenticated || (isValid && !isVendor)) {
      navigate('/NonVendor');
    }
  }, [isAuthenticated, isValid, isVendor, navigate]);
  useEffect(() => {
    if (isValid) {
      doLoadAlerts();
    }
  }, [doLoadAlerts, isValid]);
  function pluralize(count: number, item: string): string {
    if (count === 1) {
      return item;
    }
    return item + 's';
  }
  function doShowDetails(alert: IAlert) {
    if (alert) {
      setSelectedAlert(alert);
      // @ts-ignore
      modal.showModal();
    }
  }
  async function doAcknowledge(alert: IAlert) {
    if (!alert.requiresAcknowledgement) {
      setAlert('Alert does not require Acknowledgement', 'info', 5000);
      return;
    }
    if (alert.acknowledged) {
      setAlert(
        `Alert was acknowledged on ${new Date(
          alert.acknowledgedOn,
        ).toLocaleDateString()}`,
        'info',
        5000,
      );
      return;
    }
    const result = await acknowledgeAlert(
      alert,
      await getAccessTokenSilently(),
    );
    if (isSuccessResult(result)) {
      setSelectedAlert(null);
      await doLoadAlerts();
      // @ts-ignore
      modal.close();
      setAlert('Alert acknowledged successfully', 'info');
    } else {
      setAlert(result.message, 'error', 5000);
    }
  }
  async function doDelete(alert: IAlert) {
    if (alert) {
      if (alert.requiresAcknowledgement && !alert.acknowledged) {
        setAlert(
          'Alert cannot be deleted until it is acknowledged',
          'error',
          5000,
        );
        return;
      }
      const result = await deleteAlert(alert, await getAccessTokenSilently());
      if (isSuccessResult(result)) {
        await doLoadAlerts();
        setSelectedAlert(null);
        setAlert('Alert deleted successfully', 'info');
        return;
      }
      setAlert(result.message, 'error', 5000);
    }
  }
  function doCloseModal() {
    setSelectedAlert(null);
    // @ts-ignore
    modal.close();
  }
  return (
    <div className="container">
      <dialog className="modal np__modal" id="np__modal">
        <div className="np__ad__container">
          <AlertDetails alert={selectedAlert!} onAcknowledge={doAcknowledge} />
          <div className="buttoncontainer np__ad__buttoncontainer">
            <button
              className="primarybutton"
              type="button"
              onClick={doCloseModal}
            >
              <span>
                <MdCheck /> OK
              </span>
            </button>
          </div>
        </div>
      </dialog>
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
      <div className="content">
        <HideWidget
          label="Alerts"
          content={`${alerts?.length || 0} ${pluralize(
            alerts?.length || 0,
            'Alert',
          )}`}
        >
          <div className="np__alertcontainer">
            {(!alerts || alerts.length === 0) && (
              <div className="np__noalerts">No Alerts</div>
            )}
            {alerts &&
              alerts.length > 0 &&
              alerts.map((x) => (
                <div className="np__alertitem" key={x.id}>
                  <AlertListItem
                    alert={x}
                    onClick={() => doShowDetails(x)}
                    onDelete={() => doDelete(x)}
                  />
                </div>
              ))}
          </div>
        </HideWidget>
        <HideWidget
          label="Notices"
          content={`${notices?.length || 0} ${pluralize(
            notices?.length || 0,
            'Notice',
          )}`}
        >
          <div className="np__noticecontainer">
            {(!notices || notices.length === 0) && (
              <div className="np__noalerts">No Notices</div>
            )}
            {notices &&
              notices.length > 0 &&
              notices.map((x) => (
                <div className="np__noticeitem" key={x.id}>
                  <AlertListItem alert={x} onClick={() => doShowDetails(x)} />
                </div>
              ))}
          </div>
        </HideWidget>
      </div>
    </div>
  );
}
