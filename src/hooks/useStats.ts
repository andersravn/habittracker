import { formatDate } from "../utils/formatDate";
import { useLocalStorage } from "./useLocalStorage";

export function useStats() {
  const date = new Date(Date.now());
  const today = formatDate(date, ".");
  const [stats, setStats] = useLocalStorage("myStats", {
    [today]: {
      red: [],
      green: [],
    },
  });

  return {
    stats,
    setStats,
    today,
  };
}
