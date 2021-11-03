import { store } from './store';
import { Waypoint } from './types';
import { Map } from '@2gis/mapgl/types';
import cameraPoint from './dot.svg';
import cameraPointSelected from './dotSelected.svg';

export function WaypointMarker(map: Map, mapgl: any) {
    const markers: { [id: number]: mapgl.Marker } = {}
    store.on('waypointAdded', (wp: Waypoint) => {
        const marker = new mapgl.Marker(map, {
            icon: cameraPoint,
            size: [32, 32],
            anchor: [16, 16],
            coordinates: wp.center
        });
        marker.on('click', (e) => {
            if (!store.moving) {
                store.moving = marker;
                marker.setIcon({ icon: cameraPointSelected, size: [32, 32], anchor: [16, 16] });
                map.setCenter(marker.getCoordinates());
                store.movingWp = wp;

            } else {
                store.moving = undefined;
                store.movingWp = undefined;
                marker.setIcon({ icon: cameraPoint, size: [32, 32], anchor: [16, 16] })
            }
        });


        markers[wp.id] = marker;
    })

    store.on('removeWaypoint', (wp: Waypoint) => {
        markers[wp.id] && markers[wp.id].destroy();
        delete markers[wp.id];

    })
}