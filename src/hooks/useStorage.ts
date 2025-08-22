import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from 'react';

const USERS_KEY = 'all_users';

export const useStorage = () => {
    const [allUsers, setAllUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const data = await AsyncStorage.getItem(USERS_KEY);
            const users = data ? JSON.parse(data) : [];
            setAllUsers(users);
            return users;
        } catch (error) {
            return [];
        }
    };

    const getUserData = async (username) => {
        try {
            const users = await getAllUsers();
            const user = users.find(u => u.username === username);
            return user;
        } catch (error) {
            return null;
        }
    };

    const saveAllUsers = async (users) => {
        try {
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (error) {
        }
    };

    const registerUser = async (newUser) => {
        const users = await getAllUsers();

        if (users.some(user => user.username === newUser.username)) {
            return { success: false, key: 'usernameAlreadyTaken' };
        }
        if (users.some(user => user.email === newUser.email)) {
            return { success: false, key: 'emailAlreadyInUse' };
        }

        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const userToSave = { ...newUser, id: newId, favorites: [] };
        const updatedUsers = [...users, userToSave];

        await saveAllUsers(updatedUsers);
        setAllUsers(updatedUsers);
        return { success: true, key: 'registrationSuccess', user: userToSave };
    };

    const authenticateUser = async (username, password) => {
        const users = await getAllUsers();

        const user = users.find(u =>
            (u.username.toLowerCase() === username.toLowerCase()) &&
            u.password === password
        );

        if (user) {
            return { success: true, key: 'loginSuccess', user };
        } else {
            return { success: false, key: 'invalidCredentials' };
        }
    };

    const updateUserData = async (username, updatedFields) => {
        try {
            const users = await getAllUsers();

            const userIndex = users.findIndex(u => u.username === username);

            if (userIndex !== -1) {
                const updatedUsers = [...users];
                updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updatedFields };

                await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
                setAllUsers(updatedUsers);
            }
        } catch (error) {
        }
    };

    const deleteUser = useCallback(async (username) => {
        try {
            const users = await getAllUsers();

            const updatedUsers = users.filter(user => user.username !== username);

            if (updatedUsers.length < users.length) {
                await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
                setAllUsers(updatedUsers);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }, []);

    return {
        allUsers,
        registerUser,
        authenticateUser,
        getAllUsers,
        getUserData,
        updateUserData,
        deleteUser
    };
};
