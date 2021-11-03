import { Evented } from './evented';
import { Waypoint, Transition } from './types';

interface StoreEvents {
    'waypointAdded': Waypoint,
    'transitionAdded': Transition
}

type Element = Waypoint | Transition;

// TODO: waypoints -> elements
class Store extends Evented<StoreEvents> {

    private waypoints: Element[];

    constructor() {
        super();
        this.waypoints = [];
    }

    getPrevWaypoint(): Waypoint | undefined {
        const waypoints = this.waypoints.filter(el => el.type === 'waypoint')
        return waypoints[waypoints.length - 2] as Waypoint
    }

    addWaypoint(wp: Omit<Waypoint, 'id' | 'type'>): number {
        const newWp: Waypoint = {
            type: 'waypoint',
            id: this.waypoints.length,
            ...wp
        };
        if (this.waypoints.length > 0) {
            const newT: Transition = {
                type: 'transition',
                id: newWp.id + 1,
                duration: 5000
            }
            this.waypoints.push(newT);
            this.emit('transitionAdded', newT);
        }
        this.waypoints.push(newWp);
        this.emit('waypointAdded', newWp);
        return newWp.id;
    }
}

export const store = new Store();