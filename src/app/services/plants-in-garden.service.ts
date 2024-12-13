import { PlantsInGarden } from '../data/plants_in_garden';
import { supabase } from './supabase.config';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlantsInGardenService {
  private readonly TABLE_NAME = 'Plants_in_Garden';

  async addPlantToGarden(plantInGarden: PlantsInGarden): Promise<PlantsInGarden | null> {
    const { plant_id, garden_id } = plantInGarden
    
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({plant_id,garden_id})
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPlantsInGarden(gardenId: number): Promise<PlantsInGarden[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*,Plants(*)')
      .eq('garden_id', gardenId);
    
    if (error) throw error;
    return data || [];
  }

  async removePlantFromGarden(id: number, gardenId: number): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}