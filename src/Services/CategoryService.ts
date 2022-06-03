import { http } from './http';
import { ICategory } from '../Interfaces/ICategory';

export async function getCategories(): Promise<ICategory[]> {
  const response = await http<ICategory[]>({
    path: '/Category',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function readCategory(id: string): Promise<ICategory | null> {
  const response = await http<ICategory | null>({
    path: `/Category/ById/${id}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return null;
}
