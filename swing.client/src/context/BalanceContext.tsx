import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface BalanceContextProps {
  balance: number;
  setBalance: (balance: number) => void;
  username: string;
  setUsername: (name: string) => void;
  userId: number | null;
  setUserId: (id: number | null) => void;
  unlockedGames: number[];
  setUnlockedGames: (games: number[]) => void;
  gameCosts: number[];
  winReward: number;
  fetchUser: () => Promise<void>;
  fetchCosts: () => Promise<void>;
  updateUser: (money: number, games: number[]) => Promise<void>;
  logout: () => void;
}

export const BalanceContext = createContext<BalanceContextProps | undefined>(
  undefined,
);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem("swing_user_id");
    return stored ? Number(stored) : null;
  });
  const [unlockedGames, setUnlockedGames] = useState<number[]>([]);
  const [gameCosts, setGameCosts] = useState<number[]>([0, 0, 0, 0]);
  const [winReward, setWinReward] = useState<number>(0);

  const fetchUser = useCallback(async () => {
    if (userId === null) return;
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        setBalance(data.money);
        setUnlockedGames(data.unlockedGames ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  }, [userId]);

  const fetchCosts = useCallback(async () => {
    try {
      const res = await fetch("/api/games/cost");
      if (res.ok) {
        const data: number[] = await res.json();
        // data = [game1Price, game2Price, game3Price, winReward]
        setGameCosts(data.slice(0, data.length - 1));
        setWinReward(data[data.length - 1]);
      }
    } catch (error) {
      console.error("Failed to fetch game costs", error);
    }
  }, []);

  const updateUser = useCallback(
    async (money: number, games: number[]) => {
      if (userId === null) return;
      try {
        await fetch(`/api/user/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ money, unlockedGames: games }),
        });
        setBalance(money);
        setUnlockedGames(games);
      } catch (error) {
        console.error("Failed to update user", error);
      }
    },
    [userId],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("swing_user_id");
    setUserId(null);
    setUsername("");
    setBalance(0);
    setUnlockedGames([]);
  }, []);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance,
        username,
        setUsername,
        userId,
        setUserId,
        unlockedGames,
        setUnlockedGames,
        gameCosts,
        winReward,
        fetchUser,
        fetchCosts,
        updateUser,
        logout,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("UseContext must be used within BalanceProvider");
  }
  return context;
};
