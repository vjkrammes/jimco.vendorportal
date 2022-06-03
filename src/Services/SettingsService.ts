import { http } from './http';
import { ISettingsModel } from '../Interfaces/ISettingsModel';

export async function getSettings(): Promise<ISettingsModel> {
  const response = await http<ISettingsModel>({
    path: '/System/Settings',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return {
    id: '',
    systemId: '',
    inceptionDate: '',
    banner: '',
    canDelete: false,
  };
}
