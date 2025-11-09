
import type { User } from '../types';

const TOKEN_KEY = 'soulspark_token';
const USERS_KEY = 'soulspark_users';

// --- Mock Database ---
const getMockUsers = (): Record<string, any> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (e) {
    return {};
  }
};

const saveMockUsers = (users: Record<string, any>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// --- Mock JWT Handling ---
// In a real app, this would be a real JWT library (e.g., jsonwebtoken)
// and the secret would be on the server.
const createMockToken = (payload: object): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  // A real signature would be a crypto hash. We'll fake it.
  const signature = 'mock_signature';
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const decodeMockToken = (token: string): any => {
  try {
    const [_header, payload, _signature] = token.split('.');
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};


// --- Service Functions ---
export const register = async (username: string, email: string, password: string): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getMockUsers();
      if (Object.values(users).some((u: any) => u.email === email)) {
        return reject(new Error('An account with this email already exists.'));
      }

      const id = new Date().toISOString();
      // In a real app, you MUST hash passwords. We'll store it plain for this mock.
      const newUser = { id, username, email, password };
      users[id] = newUser;
      saveMockUsers(users);

      const userPayload: User = { id, username, email };
      const token = createMockToken({ ...userPayload, exp: Date.now() + 3600 * 1000 });
      localStorage.setItem(TOKEN_KEY, token);

      resolve({ token, user: userPayload });
    }, 500);
  });
};

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getMockUsers();
      const userRecord = Object.values(users).find((u: any) => u.email === email);

      if (!userRecord || userRecord.password !== password) {
        return reject(new Error('Invalid email or password.'));
      }

      const userPayload: User = { id: userRecord.id, username: userRecord.username, email: userRecord.email };
      const token = createMockToken({ ...userPayload, exp: Date.now() + 3600 * 1000 });
      localStorage.setItem(TOKEN_KEY, token);

      resolve({ token, user: userPayload });
    }, 500);
  });
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUserFromToken = (token: string): User | null => {
  const payload = decodeMockToken(token);
  if (!payload || payload.exp < Date.now()) {
    return null;
  }
  return {
    id: payload.id,
    username: payload.username,
    email: payload.email,
  };
};
