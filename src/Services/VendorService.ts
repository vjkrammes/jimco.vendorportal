import { http, HttpResponse } from './http';
import { IVendor } from '../Interfaces/IVendor';
import { IApiResponse } from '../Interfaces/IApiResponse';

export async function getVendors(): Promise<IVendor[]> {
  const response = await http<IVendor[]>({
    path: '/Vendor',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function getVendorById(id: string): Promise<IVendor | null> {
  if (id) {
    const response = await http<IVendor | null>({
      path: `/Vendor/ById/${id}`,
    });
    if (response && response.ok && response.body) {
      return response.body;
    }
  }
  return null;
}

export async function getVendorByName(name: string): Promise<IVendor | null> {
  if (name) {
    const response = await http<IVendor | null>({
      path: `/Vendor/ByName/${name}`,
    });
    if (response && response.ok && response.body) {
      return response.body;
    }
  }
  return null;
}

export async function getVendorByEmail(email: string): Promise<IVendor | null> {
  if (email) {
    const response = await http<IVendor | null>({
      path: `/Vendor/ByEmail/${email}`,
    });
    if (response && response.ok && response.body) {
      return response.body;
    }
  }
  return null;
}

export async function updateVendor(
  model: IVendor,
  token: string,
): Promise<HttpResponse<IVendor | IApiResponse>> {
  const response = await http<IVendor | IApiResponse, IVendor>({
    path: '/Vendor/Update/false',
    method: 'put',
    body: model,
    token: token,
  });
  return response;
}
