import { WaypointCard } from './waypoint-card';
import { store } from './store';
import { Waypoint } from './types';

export function WaypointList (parent: HTMLElement) {
    store.on('waypointAdded', (wp: Waypoint) => {
        parent.appendChild(WaypointCard(wp))
    })
}