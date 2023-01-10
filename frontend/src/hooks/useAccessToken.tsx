import { useState } from 'react';

const TOKEN_NAME = 'accessToken';

export const useAccessToken = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_NAME) || null);

    const setAccessToken = (authToken: string) => {
        setToken(authToken);
        localStorage.setItem(TOKEN_NAME, authToken);
    };

    const removeAccessToken = () => {
        setToken(null);
        localStorage.removeItem(TOKEN_NAME);
    };

    return { accessToken: token, setAccessToken, removeAccessToken };
};
