import { createContext, useContext, useState, type ReactNode } from 'react';

interface balanceContextProps{
    balance: number;
    setBalance: (balance: number)=> void;
    username: string;
    setUsername: (name: string)=> void;
    level: number;
    setLevel: (level: number)=> void;
}

export const BalanceContext = createContext<balanceContextProps | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(1000)
  const [username, setUsername] = useState("")
  const [level, setLevel] = useState<number>(0)


  return (
    <BalanceContext.Provider value={{ balance, setBalance, username, setUsername, level, setLevel }}>
      {children}
    </BalanceContext.Provider>
  );
}

export const useBalance = () => {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error("UseContext must be used within BalancePrivider");
    }
    return context;
}