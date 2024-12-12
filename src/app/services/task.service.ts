import { Task } from '../data/tasks';
import { supabase } from './supabase.config';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly TABLE_NAME = 'tasks';

  async createTask(task: Omit<Task, 'id'>): Promise<Task | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTasks(gardenId: number): Promise<Task[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('garden_id', gardenId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(task)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTask(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}