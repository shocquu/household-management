const TOKEN_NAME = 'accessToken';

export const useAccessToken = () => {
    const accessToken = localStorage.getItem(TOKEN_NAME) || null;

    const setAccessToken = (authToken: string) => {
        localStorage.setItem(TOKEN_NAME, authToken);
    };

    const removeAccessToken = () => localStorage.removeItem(TOKEN_NAME);

    return { accessToken, setAccessToken, removeAccessToken };
};
