import { createContext, ReactNode, useContext, useState } from 'react';
import { AlertStatus } from '../types';

interface AlertContextType {
    status: AlertStatus;
    message: string;
    success: (message: string) => void;
    error: (message: string) => void;
    clear: () => void;
}

export const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState(AlertStatus.None);
    const [message, setMessage] = useState('');

    return (
        <AlertContext.Provider
            value={{
                status,
                message,
                success: (message: string) => {
                    setStatus(AlertStatus.Success);
                    setMessage(message);
                },
                error: (message: string) => {
                    setStatus(AlertStatus.Error);
                    setMessage(message);
                },
                clear: () => setStatus(AlertStatus.None),
            }}>
            {children}
        </AlertContext.Provider>
    );
};

const useAlert = () => useContext(AlertContext);

export default useAlert;
