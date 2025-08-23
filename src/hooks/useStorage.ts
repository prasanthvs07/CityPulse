// File: src/hooks/useStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorType } from '../types/errorType';
import { User } from '../types/user';

export type StorageResult = {
  success: boolean;
  error?: ErrorType;
};

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';

/**
 * Get all registered users
 */
const getAllUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching users from storage:', error);
    return [];
  }
};

/**
 * Save all users
 */
const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

/**
 * Find a user by username
 */
const getUser = async (username: string): Promise<User | null> => {
  const users = await getAllUsers();
  return users.find((u) => u.username === username) || null;
};

/**
 * Add a new user (username & email must be unique)
 */
const addUser = async (newUser: Omit<User, 'favorites'>): Promise<StorageResult> => {
  const users = await getAllUsers();

  if (users.some(u => u.username === newUser.username)) {
    return { success: false, error: ErrorType.usernameAlreadyTaken };
  } else if (users.some(u => u.email === newUser.email)) {
    return { success: false, error: ErrorType.emailAlreadyInUse };
  }

  users.push({ ...newUser, favorites: [] });
  await saveUsers(users);
  return {success: true };
};

/**
 * Update an existing user
 */
const updateUser = async (updatedUser: User): Promise<void> => {
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.username === updatedUser.username);

  if (index !== -1) {
    users[index] = updatedUser;
    await saveUsers(users);
  }
};

/**
 * Manage current logged in user
 */
const setCurrentUser = async (user: User): Promise<void> => {
  if (user.username) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, user.username);
  } else {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
};

const getCurrentUser = async (): Promise<User | null> => {
  const username = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!username) return null;

  return getUser(username);
};

const deleteUser = async (username: string): Promise<boolean> => {
  try {
    const users = await getAllUsers();
    const updatedUsers = users.filter(user => user.username !== username);

    if (updatedUsers.length < users.length) {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const useStorage = () => {
  return {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    getCurrentUser,
    setCurrentUser,
    deleteUser
  };
};
