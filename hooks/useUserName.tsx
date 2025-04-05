import { useState, useEffect } from 'react';
import { getUserName } from '../utils/secureStore';

export const useUserName = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await getUserName();
      setUserName(name);
    };
    fetchUserName();
  }, []);

  return userName;
};
