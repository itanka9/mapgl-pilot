import { store } from './store';
import { Waypoint } from './types';
import { Map } from '@2gis/mapgl/types';

export function WaypointPath(map: Map, mapgl: any) {
    const lines: { [id: number]: mapgl.Polyline } = {};
    store.on('waypointAdded', (wp: Waypoint) => {
        const wpPrev = store.getPrevWaypoint();
        if (wpPrev) {
            const line = new mapgl.Polyline(map, {
                coordinates: [
                    wpPrev.center,
                    wp.center
                ],
                width: 2,
                color: '#00b7ff',
                dashLength: 3,
                gapLength: 3,
                gapColor: '#ffffff39',
            });
            lines[wp.id] = line;
            // wpPrev.line=line;
            // wp.line=line;
        }
    })
}