const TOKEN_NAME = 'accessToken';

export const useAccessToken = () => {
    let accessToken = localStorage.getItem(TOKEN_NAME) || null;

    const setAccessToken = (authToken: string) => {
        localStorage.setItem(TOKEN_NAME, authToken);
    };

    const removeAccessToken = () => {
        accessToken = undefined;
        localStorage.removeItem(TOKEN_NAME);
    };

    return { accessToken, setAccessToken, removeAccessToken };
};
