import { applyWaypoint, map } from '.';
import { angleToString } from './datatypes/angle';
import { LngLat } from './datatypes/lnglat';
import { Waypoint } from './types';

export function WaypointCard(wp: Waypoint) {
    const root = document.createElement('div');
    root.classList.add('checkpoint');
    const center = LngLat.fromArray(wp.center)
    root.innerHTML = `
        <label>Коорд.</label><input class="latng" size="20" value="${center.toString()}"> <br />
        <label>Зум</label><input class="zoom" size="6" value="${angleToString(wp.zoom)}">
        <label>Вр.</label><input class="rotation" size="6" value="${angleToString(wp.rotation)}">
        <label>Накл.</label><input class="pitch" size="6" value="${angleToString(wp.pitch)}">
    `;

    root.addEventListener('click', () => {
        applyWaypoint(map, wp);
    });

    return root;
}