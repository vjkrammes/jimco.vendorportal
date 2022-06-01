import {
  FaUserCog,
  FaUserClock,
  FaUserSecret,
  FaStoreAlt,
} from 'react-icons/fa';
import { IApiResponse } from '../Interfaces/IApiResponse';
import { IAlert } from '../Interfaces/IAlert';
import { IUserModel } from '../Interfaces/IUserModel';

export function prettify(json: string, indent: number = 2): string {
  if (json) {
    const obj = JSON.parse(json);
    return JSON.stringify(obj, undefined, indent);
  }
  return '';
}

export function capitalize(value: string): string {
  if (!value || value.length === 0) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1, value.length);
}

export function toCurrency(value: number): string {
  return '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const Status = {
  PENDING: 1,
  OPEN: 2,
  CANCELED_CUSTOMER: 3,
  CANCELED_STORE: 4,
  INPROGRESS: 5,
  SHIPPED: 6,
  BACKORDERED: 7,
  OUTOFSTOCK: 8,
};

Object.freeze(Status);

export function statusDescription(
  status: number,
  capitalize: boolean = true,
): string {
  switch (status) {
    case Status.PENDING:
      return capitalize ? 'Pending' : 'pending';
    case Status.OPEN:
      return capitalize ? 'Open' : 'open';
    case Status.CANCELED_CUSTOMER:
      return capitalize ? 'Canceled by customer' : 'canceled by customer';
    case Status.CANCELED_STORE:
      return capitalize ? 'Canceled by store' : 'canceled by store';
    case Status.INPROGRESS:
      return capitalize ? 'In progress' : 'in progress';
    case Status.SHIPPED:
      return capitalize ? 'Shipped' : 'shipped';
    case Status.BACKORDERED:
      return capitalize ? 'Back ordered' : 'back ordered';
    case Status.OUTOFSTOCK:
      return capitalize ? 'Out of stock' : 'out of stock';
    default:
      return capitalize ? 'Unknown' : 'unknown';
  }
}

export function statuses(): Map<string, string> {
  const ret = new Map<string, string>();
  for (let i = 1; i <= 8; i++) {
    ret.set(i.toString(), statusDescription(i, true));
  }
  return ret;
}

export function isSuccessResult(response: IApiResponse): boolean {
  return (
    response.code === 0 &&
    response.message === '' &&
    (!response.messages || response.messages.length === 0)
  );
}

export function alertLevelFromValue(level: number): string {
  switch (level) {
    case 0:
      return 'Information';
    case 1:
      return 'Notice';
    case 2:
      return 'Critical';
    default:
      return 'Unknown';
  }
}

export function alertLevel(alert: IAlert): string {
  return alertLevelFromValue(alert.level);
}

export function alertIconFromValue(level: number): string {
  switch (level) {
    case 0:
      return '/images/info-32.png';
    case 1:
      return '/images/warning-32.png';
    case 2:
      return '/images/warning-red-32.png';
    default:
      return '';
  }
}

export function alertIcon(alert: IAlert): string {
  return alertIconFromValue(alert.level);
}

export function getAudience(
  v: boolean,
  e: boolean,
  m: boolean,
  a: boolean,
  prefix: string,
): JSX.Element {
  return (
    <div className={`${prefix}__audience`}>
      {v && (
        <span title="Vendors">
          <FaStoreAlt />
        </span>
      )}
      {!v && <span>&nbsp;</span>}
      {e && (
        <span title="Employees">
          <FaUserClock />
        </span>
      )}
      {!e && <span>&nbsp;</span>}
      {m && (
        <span title="Managers">
          <FaUserCog />
        </span>
      )}
      {!m && <span>&nbsp;</span>}
      {a && (
        <span title="Admins">
          <FaUserSecret />
        </span>
      )}
      {!a && <span>&nbsp;</span>}
    </div>
  );
}

export function userHasRole(user: IUserModel, role: string): boolean {
  const r = role.toLowerCase();
  const roles = user.jobTitles.toLowerCase();
  return roles.indexOf(r) >= 0;
}

export function userIsVendor(user: IUserModel): boolean {
  return userHasRole(user, 'vendor');
}

export function userIsEmployee(user: IUserModel): boolean {
  return userHasRole(user, 'employee');
}

export function userIsManager(user: IUserModel): boolean {
  return userHasRole(user, 'manager');
}

export function userIsAdmin(user: IUserModel): boolean {
  return userHasRole(user, 'admin');
}

export function userIsManagerPlus(user: IUserModel): boolean {
  return userIsManager(user) || userIsAdmin(user);
}

export function userIsJimCoEmployee(user: IUserModel): boolean {
  return userIsEmployee(user) || userIsManager(user) || userIsAdmin(user);
}
