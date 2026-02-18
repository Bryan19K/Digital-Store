import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getSettings as fetchSettingsApi, updateSettings as updateSettingsApi, Settings } from '../services/settingsService';

interface SettingsContextType {
    settings: Settings;
    loading: boolean;
    updateSettingsContext: (formData: FormData) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
    storeName: 'Digital Store',
    heroImage: '/uploads/default-hero.jpg'
};

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    loading: true,
    updateSettingsContext: async () => { },
    refreshSettings: async () => { },
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const data = await fetchSettingsApi();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    const updateSettingsContext = async (formData: FormData) => {
        try {
            const updatedSettings = await updateSettingsApi(formData);
            setSettings(updatedSettings);
        } catch (error) {
            console.error('Error updating settings in context:', error);
            throw error;
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettingsContext, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
