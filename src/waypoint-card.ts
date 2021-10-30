import { applyWaypoint, map } from '.';
import { Waypoint } from './types';

export function WaypointCard(wp: Waypoint) {
    const root = document.createElement('div');
    root.style.fontSize = '12px';
    root.style.fontFamily = 'Helvetica, sans-serif';
    root.style.padding = '3px';
    root.style.borderBottom = 'solid 1px grey';
    root.style.cursor = 'pointer';
    root.innerHTML = `
        <span>${wp.center.join(', ')}</span>
        <span>${wp.zoom}</span>
        <span>${wp.rotation}</span>
        <span>${wp.pitch}</span>
        `

    root.addEventListener('click', () => {
        applyWaypoint(map, wp);
    })
    return root;
}