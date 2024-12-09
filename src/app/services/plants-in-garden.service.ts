import { PlantsInGarden } from '../data/plants_in_garden';
import { supabase } from './supabase.config';

export class PlantsInGardenService {
  private readonly TABLE_NAME = 'plants_in_garden';

  async addPlantToGarden(plantInGarden: Omit<PlantsInGarden, 'id'>): Promise<PlantsInGarden | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(plantInGarden)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPlantsInGarden(gardenId: number): Promise<PlantsInGarden[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*, plants(*)')
      .eq('garden_id', gardenId);
    
    if (error) throw error;
    return data || [];
  }

  async removePlantFromGarden(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}