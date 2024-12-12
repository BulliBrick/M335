// services/gardens.service.ts
import { Injectable } from '@angular/core';
import { Garden } from '../data/gardens';
import { supabase } from './supabase.config';

@Injectable({
  providedIn: 'root'
})
export class GardensService {
  private readonly STORAGE_KEY = 'gardens';
  private readonly TABLE_NAME = 'Gardens';

  constructor() {}

  async getGardens(): Promise<Garden[]> {
    try {
      // Try to get from Supabase first
      const { data: remoteGardens, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*');

      if (error) throw error;

      if (remoteGardens) {
        // Update local storage with remote data
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remoteGardens));
        return remoteGardens;
      }
    } catch (error) {
      console.error('Failed to fetch from Supabase:', error);
    }

    // Fallback to local storage
    const localData = localStorage.getItem(this.STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  }

  async addGarden(garden: Garden): Promise<void> {
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(garden)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Update local storage
        const gardens = await this.getLocalGardens();
        gardens.push(data);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gardens));
      }
    } catch (error) {
      console.error('Failed to add garden:', error);
      // Fallback to local only
      const gardens = await this.getLocalGardens();
      gardens.push(garden);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gardens));
    }
  }

  async updateGarden(garden: Garden): Promise<void> {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .update(garden)
        .eq('id', garden.id);

      if (error) throw error;

      // Update local storage
      const gardens = await this.getLocalGardens();
      const index = gardens.findIndex(g => g.id === garden.id);
      if (index !== -1) {
        gardens[index] = garden;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gardens));
      }
    } catch (error) {
      console.error('Failed to update garden:', error);
      // Fallback to local update
      const gardens = await this.getLocalGardens();
      const index = gardens.findIndex(g => g.id === garden.id);
      if (index !== -1) {
        gardens[index] = garden;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gardens));
      }
    }
  }

  async deleteGarden(gardenId: number): Promise<void> {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', gardenId);

      if (error) throw error;

      // Update local storage
      const gardens = await this.getLocalGardens();
      const filteredGardens = gardens.filter(g => g.id !== gardenId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredGardens));
    } catch (error) {
      console.error('Failed to delete garden:', error);
      // Fallback to local delete
      const gardens = await this.getLocalGardens();
      const filteredGardens = gardens.filter(g => g.id !== gardenId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredGardens));
    }
  }

  private async getLocalGardens(): Promise<Garden[]> {
    const gardensJson = localStorage.getItem(this.STORAGE_KEY);
    return gardensJson ? JSON.parse(gardensJson) : [];
  }

  async syncGardens(): Promise<void> {
    try {
      const { data: remoteGardens, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*');

      if (error) throw error;

      if (remoteGardens) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remoteGardens));
      }
    } catch (error) {
      console.error('Failed to sync gardens:', error);
    }
  }
}