import { applyWaypoint, map } from '.';
import { angleToString } from './datatypes/angle';
import { Waypoint } from './types';

export function WaypointCard(wp: Waypoint) {
    const root = document.createElement('div');
    root.classList.add('checkpoint');
    root.innerHTML = `
        <label>Lnglat</label><input class="latng" size="12" value="${wp.center.toString()}">
        <label>Rot</label><input class="rotation" size="4" value="${angleToString(wp.rotation)}">
        <label>Pitch</label><input class="pitch" size="4" value="${angleToString(wp.pitch)}">
    `;

    root.addEventListener('click', () => {
        applyWaypoint(map, wp);
    });

    return root;
}