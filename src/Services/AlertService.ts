import { http } from './http';
import { IAlertIdentity } from '../Interfaces/IAlertIdentity';
import { IAlertResponse } from '../Interfaces/IAlertResponse';
import { IAlert } from '../Interfaces/IAlert';
import { IApiResponse, SUCCESS } from '../Interfaces/IApiResponse';

export async function getAlerts(
  identity: IAlertIdentity,
  token: string,
): Promise<IAlertResponse> {
  const response = await http<IAlertResponse, IAlertIdentity>({
    path: '/Alert/Current',
    method: 'post', // should be get but fetch won't allow gets with bodies
    body: identity,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return { notices: [], alerts: [] };
}

export async function acknowledgeAlert(
  alert: IAlert,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Alert/Acknowledge/${alert.id}`,
    method: 'put',
    token: token,
  });
  if (response && response.body) {
    return response.body;
  }
  return SUCCESS;
}

export async function updateAlert(
  alert: IAlert,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse, IAlert>({
    path: '/Alert',
    method: 'put',
    body: alert,
    token: token,
  });
  if (response && response.body) {
    return response.body;
  }
  return SUCCESS;
}

export async function deleteAlert(
  alert: IAlert,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Alert/Delete/${alert.id}`,
    method: 'delete',
    token: token,
  });
  if (response && response.body) {
    return response.body;
  }
  return SUCCESS;
}

export async function deleteAllAlerts(
  identifier: string,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Alert/DeleteAll/${identifier}`,
    method: 'delete',
    token: token,
  });
  if (response && response.body) {
    return response.body;
  }
  return SUCCESS;
}
