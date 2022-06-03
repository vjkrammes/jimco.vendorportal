import { http, HttpResponse } from './http';
import { IProduct } from '../Interfaces/IProduct';
import { IVendorProductUpdate } from '../Interfaces/IVendorProductUpdate';
import { IApiResponse, SUCCESS } from '../Interfaces/IApiResponse';

export async function getProductById(id: string): Promise<IProduct | null> {
  if (id) {
    const response = await http<IProduct | null>({
      path: `/Product/ById/${id}`,
    });
    if (response && response.ok && response.body) {
      return response.body;
    }
  }
  return null;
}

export async function getProducts(vendorId?: string): Promise<IProduct[]> {
  const uri = vendorId ? `/Product/ForVendor/${vendorId}` : '/Product';
  const response = await http<IProduct[]>({
    path: uri,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function searchProduct(
  categoryId: string,
  searchText: string,
): Promise<IProduct[]> {
  let response: HttpResponse<IProduct[]>;
  if (!categoryId || categoryId === '0') {
    response = await http<IProduct[]>({
      path: `/Product/Search/${searchText}`,
    });
  } else {
    response = await http<IProduct[]>({
      path: `/Product/Search/${categoryId}/${searchText}`,
    });
  }
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function discontinueProduct(
  email: string,
  productId: string,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Product/Discontinue/${email}/${productId}`,
    method: 'put',
    token: token,
  });
  if (response && !response.ok) {
    if (response.body) {
      return response.body;
    } else {
      return {
        code: 1,
        message: `An unexpected error occurred (${response.code})`,
        messages: [],
      };
    }
  }
  return SUCCESS;
}

export async function updateProduct(
  update: IVendorProductUpdate,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse, IVendorProductUpdate>({
    path: '/Product/Update/Vendor',
    method: 'put',
    body: update,
    token: token,
  });
  if (response && response.ok) {
    return SUCCESS;
  }
  if (response && !response.ok && response.body) {
    return response.body;
  }
  return {
    code: 1,
    message: `An unexpected error occurred (${response.code})`,
    messages: [],
  };
}
