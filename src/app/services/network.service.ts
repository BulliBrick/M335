// services/network.service.ts
import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkStatus = new BehaviorSubject<boolean>(true);
  private initialCheckDone = false;

  constructor(private platform: Platform) {
    this.initializeNetworkMonitoring();
  }

  private async initializeNetworkMonitoring() {
    // Wait for the platform to be ready
    await this.platform.ready();

    // Get initial network status
    const status = await Network.getStatus();
    this.networkStatus.next(status.connected);
    this.initialCheckDone = true;

    // Listen for network changes
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed:', status.connected);
      this.networkStatus.next(status.connected);
    });
  }

  // Public methods
  
  /**
   * Returns an Observable that emits the current network status
   * and continues to emit on any changes
   */
  public onNetworkChange(): Observable<boolean> {
    return this.networkStatus.asObservable();
  }

  /**
   * Returns the current network status
   */
  public async getCurrentNetworkStatus(): Promise<boolean> {
    if (!this.initialCheckDone) {
      const status = await Network.getStatus();
      return status.connected;
    }
    return this.networkStatus.getValue();
  }

  /**
   * Checks if the device is currently online
   */
  public async isOnline(): Promise<boolean> {
    return this.getCurrentNetworkStatus();
  }

  /**
   * Checks if the device is currently offline
   */
  public async isOffline(): Promise<boolean> {
    const status = await this.getCurrentNetworkStatus();
    return !status;
  }
}