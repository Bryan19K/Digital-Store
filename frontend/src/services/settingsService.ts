import api from '../config/axios';

export interface Settings {
    _id?: string;
    storeName: string;
    heroImage: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getSettings = async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
};

export const updateSettings = async (formData: FormData): Promise<Settings> => {
    const response = await api.put('/settings', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.settings;
};
