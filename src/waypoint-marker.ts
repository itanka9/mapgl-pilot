import { store } from './store';
import { Waypoint } from './types';
import { Map } from '@2gis/mapgl/types';
import cameraPoint from './dot.svg';

export function WaypointMarker(map: Map, mapgl: any) {
    store.on('waypointAdded', (wp: Waypoint) => {
        const marker = new mapgl.Marker(map, {
            icon: cameraPoint,
            size: [32, 32],
            anchor: [16,16],
            coordinates: map.getCenter()
        });
        wp.marker=marker;
    })
}