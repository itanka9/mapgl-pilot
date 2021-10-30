import { Evented } from './evented';
import { Waypoint } from './types';

interface StoreEvents  {
    'waypointAdded': Waypoint
}

class Store extends Evented<StoreEvents> {
    
    private waypoints: Waypoint[];

    constructor () {
        super();
        this.waypoints = [];
    }

    addWaypoint (wp: Omit<Waypoint, 'id'>): number {
        const newWp = {
            id: this.waypoints.length,
            ...wp
        };
        this.waypoints.push(newWp);
        this.emit('waypointAdded', newWp);
        return newWp.id;
    }
}

export const store = new Store();