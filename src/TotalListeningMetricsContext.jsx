import { createContext, useState, useContext } from 'react';

// // Create a Context for totalListeningTime
// const TotalListeningTimeContext = createContext();

// // Custom hook to use the context
// export const useTotalListeningTime = () => {
//     return useContext(TotalListeningTimeContext);
// };

// // Context Provider component
// export const TotalListeningTimeProvider = ({ children }) => {
//     const [totalListeningTime, setTotalListeningTime] = useState(0);

//     return (
//         <TotalListeningTimeContext.Provider value={{ totalListeningTime, setTotalListeningTime }}>
//             {children}
//         </TotalListeningTimeContext.Provider>
//     );
// };

//create context for listening metrics
const MetricsContext = createContext();

//Custom hook to use the context
export const useMetrics = () => {
    return useContext(MetricsContext);
};

//Context Provider component
export const MetricsProvider = ({ children }) => {
    const [totalListeningTime, setTotalListeningTime] = useState(0);
    const [totalGenres, setTotalGenres] = useState(0); 

    return (
        <MetricsContext.Provider value={{ 
            totalListeningTime, 
            setTotalListeningTime, 
            totalGenres, 
            setTotalGenres 
        }}>
            {children}
        </MetricsContext.Provider>
    );
};