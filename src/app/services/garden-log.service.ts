import { GardenLog } from '../data/garden_logs';
import { supabase } from './supabase.config';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GardenLogService {
  private readonly TABLE_NAME = 'garden_logs';

  async createLog(log: Omit<GardenLog, 'id'>): Promise<GardenLog | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getLogs(gardenId: number): Promise<GardenLog[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('garden_id', gardenId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateLog(id: number, log: Partial<GardenLog>): Promise<GardenLog | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(log)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteLog(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}