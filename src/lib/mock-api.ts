/**
 * Mock API for QR-based authentication system
 * Simulates backend API endpoints using localStorage
 */

export interface User {
  key: string
  name: string
  createdAt: string
}

// In-memory storage (simulating database)
const STORAGE_KEY = 'qr_auth_users'

/**
 * Get all users from mock database
 */
const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to parse users from localStorage:', error)
    // Reset corrupted storage to prevent persistent errors
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

/**
 * Save users to mock database
 */
const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

/**
 * Simulate API delay for realistic behavior
 */
const delay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock API: Register a new user
 */
export const registerUser = async (
  key: string,
  name: string
): Promise<User> => {
  await delay()

  const trimmedKey = key.trim()
  const trimmedName = name.trim()
  if (!trimmedKey) {
    throw new Error('Key is required')
  }
  if (!trimmedName) {
    throw new Error('Name is required')
  }

  const users = getUsers()

  // Check if user already exists
  const existingUser = users.find((u) => u.key === trimmedKey)
  if (existingUser) {
    throw new Error('User with this key already exists')
  }

  // Create new user
  const newUser: User = {
    key: trimmedKey,
    name: trimmedName,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return newUser
}

/**
 * Mock API: Get user by key
 */
export const getUserByKey = async (key: string): Promise<User | null> => {
  await delay()

  const users = getUsers()
  const user = users.find((u) => u.key === key)

  return user || null
}

/**
 * Mock API: Get all users (for admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
  await delay()
  return getUsers()
}

/**
 * Mock API: Delete user by key (for admin)
 */
export const deleteUser = async (key: string): Promise<void> => {
  await delay()

  const users = getUsers()
  const filteredUsers = users.filter((u) => u.key !== key)
  saveUsers(filteredUsers)
}

/**
 * Mock API: Update user name
 */
export const updateUserName = async (
  key: string,
  newName: string
): Promise<User> => {
  await delay()

  const users = getUsers()
  const userIndex = users.findIndex((u) => u.key === key)

  if (userIndex === -1) {
    throw new Error('User not found')
  }

  const user = users[userIndex]
  if (!user) {
    throw new Error('User not found')
  }

  user.name = newName
  saveUsers(users)

  return user
}
