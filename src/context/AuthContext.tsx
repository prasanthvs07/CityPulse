import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { useStorage } from '../hooks/useStorage';
import { ErrorType } from '../types/errorType';
import { User } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  registerUser: (user: Omit<User, 'favorites'>) => Promise<{ success: boolean; error?: ErrorType; user?: User | null }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: ErrorType; user?: User | null }>;
  loginAsGuest: () => Promise<{ success: boolean; user?: User | null }>;
  logout: () => Promise<void>;
  toggleFavoriteInAuth: (eventId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getUser, addUser, getCurrentUser, setCurrentUser, updateUser } = useStorage();
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getCurrentUser();
      setCurrentUserState(storedUser);
    };
    loadUser();
  }, [getCurrentUser]);

  const handleUserLogin = async (user: User) => {
    await setCurrentUser(user);
    setCurrentUserState(user);
  };

  const registerUser = async (user: Omit<User, 'favorites'>) => {
    const newUser: User = { ...user, favorites: [] };
    const result = await addUser(newUser);
    if (!result.success) {
      return { success: false, error: result.error || ErrorType.unknown };
    }
    await handleUserLogin(newUser);
    return { success: true, user: newUser };
  };

  const login = async (username: string, password: string) => {
    const user = await getUser(username);
    if (!user || user.password !== password) {
      return { success: false, error: ErrorType.invalidCredentials };
    }
    await handleUserLogin(user);
    return { success: true, user };
  };

  const loginAsGuest = async () => {
    const guestUser: User = { username: 'guest', email: '', password: '', favorites: [] };
    await handleUserLogin(guestUser);
    return { success: true, user: guestUser };
  };

  const logout = async () => {
    await setCurrentUser({} as User);
    setCurrentUserState(null);
  };

  const toggleFavoriteInAuth = useCallback(async (eventId: string) => {
    if (!currentUser || currentUser.username === 'guest') return;

    const isFav = currentUser.favorites.includes(eventId);
    const updatedFavorites = isFav
      ? currentUser.favorites.filter(id => id !== eventId)
      : [...currentUser.favorites, eventId];

    const updatedUser = { ...currentUser, favorites: updatedFavorites };
    
    setCurrentUserState(updatedUser);
    
    try {
      await updateUser(updatedUser);
    } catch (err) {
      setCurrentUserState(currentUser);
    }
  }, [currentUser, updateUser]);

  const value = {
    currentUser,
    registerUser,
    login,
    loginAsGuest,
    logout,
    toggleFavoriteInAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
