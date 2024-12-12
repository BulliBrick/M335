// services/gardens.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NetworkService } from './network.service';
import { Garden } from '../data/gardens';
import { supabase } from './supabase.config';


@Injectable({
  providedIn: 'root'
})
export class GardensService {
  private storage: Storage | null = null;
  private STORAGE_KEY = 'gardens';

  constructor(
    private ionicStorage: Storage,
    private networkService: NetworkService
  ) {
    this.initStorage();
    
  }

  private async initStorage() {
    this.storage = await this.ionicStorage.create();
  }

  async getGardens(): Promise<Garden[]> {
    if (!this.storage) await this.initStorage();
    return await this.storage?.get(this.STORAGE_KEY) || [];
  }

  public async addGarden(garden: Garden): Promise<void> {
    const gardens = await this.getGardens();
    gardens.push(garden);
    await this.storage?.set(this.STORAGE_KEY, gardens);
    
    if (await this.networkService.isOnline()) {
      await this.syncGarden(garden);
    }
  }

  async updateGarden(garden: Garden): Promise<void> {
    const gardens = await this.getGardens();
    const index = gardens.findIndex(g => g.id === garden.id);
    if (index !== -1) {
      gardens[index] = garden;
      await this.storage?.set(this.STORAGE_KEY, gardens);
      
      if (await this.networkService.isOnline()) {
        await this.syncGarden(garden);
      }
    }
  }

  async deleteGarden(gardenId: number): Promise<void> {
    const gardens = await this.getGardens();
    const filteredGardens = gardens.filter(g => g.id !== gardenId);
    await this.storage?.set(this.STORAGE_KEY, filteredGardens);
    
    if (await this.networkService.isOnline()) {
      await supabase
        .from('gardens')
        .delete()
        .match({ id: gardenId });
    }
  }

  async syncGardens(): Promise<void> {
    if (!await this.networkService.isOnline()) return;

    try {
      // Get local gardens
      const localGardens = await this.getGardens();
      
      // Get remote gardens
      const { data: remoteGardens, error } = await supabase
        .from('gardens')
        .select('*');

      if (error) throw error;

      // Merge gardens (prefer remote versions if conflict)
      const mergedGardens = this.mergeGardens(localGardens, remoteGardens);

      // Update local storage
      await this.storage?.set(this.STORAGE_KEY, mergedGardens);

      // Update remote storage
      await this.syncLocalToRemote(mergedGardens);

    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  private async syncGarden(garden: Garden): Promise<void> {
    try {
      const { error } = await supabase
        .from('gardens')
        .upsert({
          id: garden.id,
          name: garden.name,
          location: garden.location,
          size: garden.size,
          creation_date: garden.created_at
        });

      if (error) throw error;
    } catch (error) {
      console.error('Garden sync failed:', error);
      throw error;
    }
  }

  private async syncLocalToRemote(gardens: Garden[]): Promise<void> {
    const { error } = await supabase
      .from('gardens')
      .upsert(gardens.map(garden => ({
        id: garden.id,
        name: garden.name,
        location: garden.location,
        size: garden.size,
        creation_date: garden.created_at
      })));

    if (error) throw error;
  }

  private mergeGardens(local: Garden[], remote: Garden[]): Garden[] {
    const mergedMap = new Map<number, Garden>();
    
    // Add remote gardens (they take precedence)
    remote.forEach(garden => mergedMap.set(garden.id, garden));
    
    // Add local gardens if they don't exist remotely
    local.forEach(garden => {
      if (!mergedMap.has(garden.id)) {
        mergedMap.set(garden.id, garden);
      }
    });
    
    return Array.from(mergedMap.values());
  }
}