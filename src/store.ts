import { toSequence } from './datatypes/sequence';
import { waypointEqual } from './datatypes/waypoint';
import { Evented } from './evented';
import { Waypoint, Transition, Command } from './types';

interface StoreEvents {
    'waypointAdded': Waypoint,
    'transitionAdded': Transition,
    'transitionChanged': Transition,
    'playbackState': PlaybackState,
    'titleChanged': string,
    'removeWaypoint': Element,
}

type Element = Waypoint | Transition;

type PlaybackState = 'rec' | 'play' | 'stop';

// TODO: waypoints -> elements
class Store extends Evented<StoreEvents> {

    private waypoints: Element[];
    private playbackState: PlaybackState;
    private title: string;

    constructor() {
        super();
        this.waypoints = [];
        this.playbackState = 'stop';
        this.title = '';
    }

    insertWaypoint(wp: Omit<Waypoint, 'id' | 'type'>) {
        const lastWp = this.waypoints[this.waypoints.length - 1];
        if (lastWp && lastWp.type === 'waypoint' && waypointEqual(lastWp, wp)) {
            return;
        }
        if (this.waypoints.length !== 0) {
            this.addTransition({ duration: 5000 })
        }
        this.addWaypoint(wp);
    }

    getById(id: number) {
        return this.waypoints[id];
    }

    getItems() {
        return this.waypoints;
    }

    setTitle(newTitle: string) {
        if (newTitle === this.title) {
            return;
        }
        this.title = newTitle;
        this.emit('titleChanged', this.title);
    }

    remove(element: Element) {
        this.waypoints = this.waypoints.filter(waypoint => waypoint.id !== element.id);
        this.emit('removeWaypoint', element);
        console.log(this.waypoints)
    }

    getTitle() {
        return this.title;
    }

    serialize(): object {
        return {
            title: this.title,
            waypoints: JSON.parse(JSON.stringify(this.waypoints)))
        }
    }

    deserialize(serialized: any) {
        this.waypoints = [];
        this.title = '';
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
        this.setTitle(serialized.title);
    }

    setPlaybackState(state: PlaybackState) {
        if (this.playbackState === state) {
            return;
        }
        this.playbackState = state;
        this.emit('playbackState', state);
    }

    getPlaybackState() {
        return this.playbackState;
    }

    getSequence (): Command[] {
        return toSequence(this.waypoints);
    }

    getPrevWaypoint(): Waypoint | undefined {
        const waypoints = this.waypoints.filter(el => el.type === 'waypoint')
        return waypoints[waypoints.length - 2] as Waypoint
    }

    updateTransition (id: number, duration: number) {
        const item = this.waypoints[id];
        if (item.type !== 'transition') {
            console.log('not transition', item);
            return;
        }
        item.duration = duration;
        this.emit('transitionChanged', item);
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