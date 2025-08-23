import { useEffect, useState, useCallback } from 'react';
import { useStorage } from './useStorage';
import { ErrorType } from '../types/errorType';
import { User } from '../types/user';

export type AuthResult = {
  success: boolean;
  error?: ErrorType;
  user?: User | null;
};

export function useAuth() {
  const { getUser, addUser, getCurrentUser, setCurrentUser, updateUser } = useStorage();
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  // Load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getCurrentUser();
      setCurrentUserState(storedUser);
    };
    loadUser();
  }, []);

  const handleUserLogin = async (user: User) => {
    await setCurrentUser(user);
    setCurrentUserState(user);
  };
  
  /**
   * Register a new user
   */
  const registerUser = async (user: Omit<User, 'favorites'>): Promise<AuthResult> => {    
    const newUser: User = { ...user, favorites: [] };
    const result = await addUser(newUser);
    if (!result.success) {
      return { success: false, error: result.error || ErrorType.unknown };
    }
    await handleUserLogin(newUser);
    return { success: true, user: newUser };
  };

  /**
   * Login with username + password
   */
  const login = async (username: string, password: string): Promise<AuthResult> => {
    const user = await getUser(username);
    if (!user || user.password !== password) {
      return { success: false, error: ErrorType.invalidCredentials };
    }

    await handleUserLogin(user);
    return { success: true, user };
  };

  /**
   * Login as guest
   */
  const loginAsGuest = async (): Promise<AuthResult> => {
    const guestUser: User = {
      username: 'guest',
      email: '',
      password: '',
      favorites: [],
    };

    await handleUserLogin(guestUser)  ;
    return { success: true, user: guestUser };
  };

  /**
   * Logout (clear session)
   */
  const logout = async (): Promise<void> => {
    await setCurrentUser({} as User);
    setCurrentUserState(null);
  };

  const toggleFavoriteInAuth = useCallback(async (eventId: string) => {
    if (!currentUser || currentUser.username === 'guest') return;

    const isFavorite = currentUser.favorites.includes(eventId);
    const updatedFavorites = isFavorite
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

  const refreshCurrentUser = useCallback(async () => {
    const storedUser = await getCurrentUser();
    setCurrentUserState(storedUser);
  }, [getCurrentUser]);

  return {
    currentUser,
    registerUser,
    login,
    loginAsGuest,
    logout,
    toggleFavoriteInAuth,
    refreshCurrentUser
  };
}
