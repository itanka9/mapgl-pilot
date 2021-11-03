import { WaypointCard } from './waypoint-card';
import { store } from './store';
import { Transition, Waypoint } from './types';
import { TransitionCard } from './transition-card';

export function WaypointList(parent: HTMLElement) {
    store.on('waypointAdded', (wp: Waypoint) => {
        parent.appendChild(WaypointCard(wp))
    })

    store.on('transitionAdded', (t: Transition) => {
        parent.appendChild(TransitionCard(t))
    })

    store.on('removeWaypoint', (wp: Waypoint) => {
        parent.innerHTML = '';
        store.getItems().forEach(el => {
            el.type === 'waypoint' ? parent.appendChild(WaypointCard(el)) : parent.appendChild(TransitionCard(el))
        })
    })
}