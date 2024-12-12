import { Injectable } from '@angular/core';
import { Task } from '../data/tasks';
import { supabase } from './supabase.config';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly TASKS_KEY = 'garden_tasks';

  constructor() {}

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }
}