import { store } from './store';
import { Waypoint } from './types';
import { Map } from '@2gis/mapgl/types';


export function WaypointPatch(map: Map, mapgl: any) {
    store.on('waypointAdded', (wp: Waypoint) => {
        const wpPrev = store.getPrevWaypoint();
        console.log('ap',wpPrev)
        if (wpPrev) {
            const line = new mapgl.Polyline(map, {
                coordinates: [
                    wpPrev.center.toArray(),
                    wp.center.toArray()
                ],
                width: 2,
                color: '#00b7ff',
                dashLength: 3,
                gapLength: 3,
                gapColor: '#ffffff39',
            });
            wpPrev.line=line;
            wp.line=line;
        }
    })
}