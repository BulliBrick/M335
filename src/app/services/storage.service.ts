import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getProjects() {
    try {
      const projects = await this._storage?.get('projects') || [];
      return projects;
    } catch (error) {
      console.error('Error getting projects from storage:', error);
      return [];
    }
  }

  async saveProjects(projects: any[]) {
    try {
      await this._storage?.set('projects', projects);
    } catch (error) {
      console.error('Error saving projects to storage:', error);
    }
  }
}