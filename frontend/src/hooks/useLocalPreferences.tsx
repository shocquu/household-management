import { useState } from 'react';

type Preferences = {
    showCompletedTasks?: boolean;
};

const SETTINGS_NAME = 'preferences';

const useLocalPreferences = () => {
    const [localPreferences, setLocalPreferences] = useState<Preferences>(
        { ...JSON.parse(localStorage.getItem(SETTINGS_NAME)) } || {}
    );

    const setPreference = (preference: keyof Preferences, value: boolean) => {
        setLocalPreferences((prevState) => ({
            ...prevState,
            [preference]: value,
        }));
        localStorage.setItem(SETTINGS_NAME, JSON.stringify({ [preference]: value }));
    };

    const setPreferences = (preferences: Preferences) => {
        setLocalPreferences(preferences);
        localStorage.setItem(SETTINGS_NAME, JSON.stringify(preferences));
    };

    const clearPreferences = (preferences: Preferences) => {
        setLocalPreferences({});
        localStorage.removeItem(SETTINGS_NAME);
    };

    return { preferences: localPreferences, setPreference, setPreferences, clearPreferences };
};

export default useLocalPreferences;
