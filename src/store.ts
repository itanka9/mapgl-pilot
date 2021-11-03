import { Evented } from './evented';
import { Waypoint, Transition } from './types';

interface StoreEvents {
    'waypointAdded': Waypoint,
    'transitionAdded': Transition,
    'playbackState': PlaybackState
}

type Element = Waypoint | Transition;

type PlaybackState = 'rec' | 'play' | 'stop';

// TODO: waypoints -> elements
class Store extends Evented<StoreEvents> {

    private waypoints: Element[];
    private playbackState: PlaybackState;

    constructor() {
        super();
        this.waypoints = [];
        this.playbackState = 'stop';
    }

    insertWaypoint (wp: Omit<Waypoint, 'id' | 'type'>) {
        if (this.waypoints.length !== 0) {
            this.addTransition({ duration: 5000 })
        }
        this.addWaypoint(wp);
    }

    getById (id: number) {
        return this.waypoints[id];
    }

    getItems() {
        return this.waypoints;
    }

    serialize (): object {
        return {
            waypoints: JSON.parse(JSON.stringify(this.waypoints))
        }
    }

    deserialize (serialized: any) {
        for (const e of serialized.waypoints) {
            switch (e.type) {
                case 'waypoint':
                    this.addWaypoint(e);
                    break;
                case 'transition':
                    this.addTransition(e);
                    break;
            }
        }
        console.log(this.waypoints)
    }

    setPlaybackState (state: PlaybackState) {
        if (this.playbackState === state) {
            return;
        }
        this.playbackState = state;
        this.emit('playbackState', state);
    }

    getPlaybackState () {
        return this.playbackState;
    }

    getPrevWaypoint(): Waypoint | undefined {
        const waypoints = this.waypoints.filter(el => el.type === 'waypoint')
        return waypoints[waypoints.length - 2] as Waypoint
    }

    private addWaypoint (wp: Omit<Waypoint, 'id' | 'type'>) {
        const newWp: Waypoint = {
            type: 'waypoint',
            id: this.waypoints.length,
            ...wp
        };
        this.waypoints.push(newWp);
        this.emit('waypointAdded', newWp);
    }

    private addTransition(t: Omit<Transition, 'id' | 'type'>) {
        const newT: Transition = {
            type: 'transition',
            id: this.waypoints.length,
            ...t
        }
        this.waypoints.push(newT);
        this.emit('transitionAdded', newT);
    }
}

export const store = new Store();