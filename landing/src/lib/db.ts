import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '../instance');
const DB_PATH = path.join(DB_DIR, 'database.json');

export interface UserSchema {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface ExecutionSchema {
  id: number;
  user_id: number;
  code: string;
  success: boolean;
  execution_time_ms: number;
  output: string | null;
  error_message: string | null;
  created_at: string;
}

export interface SharedSchema {
  id: string;
  user_id: number | null;
  code: string;
  created_at: string;
}

interface DatabaseSchema {
  users: UserSchema[];
  execution_history: ExecutionSchema[];
  shared_code: SharedSchema[];
}

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], execution_history: [], shared_code: [] }, null, 2));
  }
}

function readDb(): DatabaseSchema {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB, fallback to empty:', err);
    return { users: [], execution_history: [], shared_code: [] };
  }
}

function writeDb(db: DatabaseSchema) {
  initDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export const db = {
  // Users
  getUsers(): UserSchema[] {
    return readDb().users;
  },

  getUserById(id: number): UserSchema | undefined {
    return readDb().users.find((u) => u.id === id);
  },

  getUserByUsername(username: string): UserSchema | undefined {
    const normalized = username.trim().toLowerCase();
    return readDb().users.find((u) => u.username.toLowerCase() === normalized);
  },

  addUser(username: string, passwordHash: string): UserSchema {
    const database = readDb();
    const id = database.users.length > 0 ? Math.max(...database.users.map((u) => u.id)) + 1 : 1;
    const newUser: UserSchema = {
      id,
      username: username.trim(),
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    };
    database.users.push(newUser);
    writeDb(database);
    return newUser;
  },

  // Executions
  getExecutions(userId: number): ExecutionSchema[] {
    return readDb().execution_history.filter((e) => e.user_id === userId);
  },

  addExecution(
    userId: number,
    code: string,
    success: boolean,
    executionTimeMs: number,
    output: string | null,
    errorMessage: string | null
  ): ExecutionSchema {
    const database = readDb();
    const id = database.execution_history.length > 0 ? Math.max(...database.execution_history.map((e) => e.id)) + 1 : 1;
    const newExec: ExecutionSchema = {
      id,
      user_id: userId,
      code,
      success,
      execution_time_ms: executionTimeMs,
      output,
      error_message: errorMessage,
      created_at: new Date().toISOString(),
    };
    database.execution_history.push(newExec);
    writeDb(database);
    return newExec;
  },

  // Shares
  getShare(id: string): SharedSchema | undefined {
    return readDb().shared_code.find((s) => s.id === id);
  },

  addShare(code: string, userId: number | null): SharedSchema {
    const database = readDb();
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newShare: SharedSchema = {
      id,
      user_id: userId,
      code,
      created_at: new Date().toISOString(),
    };
    database.shared_code.push(newShare);
    writeDb(database);
    return newShare;
  },
};
