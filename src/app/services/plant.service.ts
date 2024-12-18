import { Plant } from '../data/plants';
import { supabase } from './supabase.config';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlantService {
  private readonly TABLE_NAME = 'Plants';

  async createPlant(plant: Plant): Promise<Plant | null> {
    const {id, ...obj} = plant
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(obj)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPlants(): Promise<Plant[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*');
    
    if (error) throw error;
    return data || []; 
  }

  async getPlantById(id: number): Promise<Plant | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePlant(id: number, plant: Partial<Plant>): Promise<Plant | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(plant)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePlant(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}