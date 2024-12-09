import { Plant } from './plants';
import { Garden } from './gardens';

export interface PlantsInGarden {
    id: number;
    plant_id: Plant["id"];
    garden_id: Garden["id"];
}