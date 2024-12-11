import { createContext, useState, useContext } from 'react';

// Create a Context for totalListeningTime
const TotalListeningTimeContext = createContext();

// Custom hook to use the context
export const useTotalListeningTime = () => {
    return useContext(TotalListeningTimeContext);
};

// Context Provider component
export const TotalListeningTimeProvider = ({ children }) => {
    const [totalListeningTime, setTotalListeningTime] = useState(0);

    return (
        <TotalListeningTimeContext.Provider value={{ totalListeningTime, setTotalListeningTime }}>
            {children}
        </TotalListeningTimeContext.Provider>
    );
};
