import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Warning: Supabase credentials are not fully configured in your environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface UserSchema {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  google_id?: string;
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

export const db = {
  // Users lookup and register
  async getUserById(id: number): Promise<UserSchema | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return data as UserSchema;
  },

  async getUserByUsername(username: string): Promise<UserSchema | undefined> {
    const normalized = username.trim().toLowerCase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', normalized)
      .single();
    if (error || !data) return undefined;
    return data as UserSchema;
  },

  async getUserByGoogleId(googleId: string): Promise<UserSchema | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single();
    if (error || !data) return undefined;
    return data as UserSchema;
  },

  async getUserByEmail(email: string): Promise<UserSchema | undefined> {
    const normalized = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', normalized)
      .single();
    if (error || !data) return undefined;
    return data as UserSchema;
  },

  async addUser(username: string, passwordHash: string): Promise<UserSchema> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: username.trim(),
        password_hash: passwordHash,
      })
      .select()
      .single();
    if (error || !data) {
      console.error('Supabase addUser error:', error);
      throw error || new Error('Failed to insert user');
    }
    return data as UserSchema;
  },

  async addGoogleUser(username: string, email: string, googleId: string): Promise<UserSchema> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: username.trim(),
        email: email.trim(),
        google_id: googleId,
        password_hash: '', // Google-authenticated users don't have local password hashes
      })
      .select()
      .single();
    if (error || !data) {
      console.error('Supabase addGoogleUser error:', error);
      throw error || new Error('Failed to insert Google user');
    }
    return data as UserSchema;
  },

  // Executions (History & Analytics)
  async getExecutions(userId: number): Promise<ExecutionSchema[]> {
    const { data, error } = await supabase
      .from('execution_history')
      .select('*')
      .eq('user_id', userId);
    if (error || !data) return [];
    return data as ExecutionSchema[];
  },

  async addExecution(
    userId: number,
    code: string,
    success: boolean,
    executionTimeMs: number,
    output: string | null,
    errorMessage: string | null
  ): Promise<ExecutionSchema> {
    const { data, error } = await supabase
      .from('execution_history')
      .insert({
        user_id: userId,
        code,
        success,
        execution_time_ms: Math.round(executionTimeMs),
        output,
        error_message: errorMessage,
      })
      .select()
      .single();
    if (error || !data) {
      console.error('Supabase addExecution error:', error);
      throw error || new Error('Failed to insert execution record');
    }
    return data as ExecutionSchema;
  },

  // Share system
  async getShare(id: string): Promise<SharedSchema | undefined> {
    const { data, error } = await supabase
      .from('shared_code')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return data as SharedSchema;
  },

  async addShare(code: string, userId: number | null): Promise<SharedSchema> {
    const { data, error } = await supabase
      .from('shared_code')
      .insert({
        user_id: userId,
        code,
      })
      .select()
      .single();
    if (error || !data) {
      console.error('Supabase addShare error:', error);
      throw error || new Error('Failed to insert shared code');
    }
    return data as SharedSchema;
  },
};
