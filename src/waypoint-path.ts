import { store } from './store';
import { Waypoint } from './types';
import { Map } from '@2gis/mapgl/types';

export function WaypointPath(map: Map, mapgl: any) {
    let lines: { [id: number]: mapgl.Polyline } = {};
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
        }
    })

    store.on('removeWaypoint', (wp: Waypoint) => {
        store.getItems().filter(el => el.type === 'waypoint').forEach(el => { lines[el.id] && lines[el.id].destroy() });
        lines[wp.id] && lines[wp.id].destroy()
        lines = {};
        let wpPrev;
        store.getItems().filter(el => el.type === 'waypoint').forEach((el, index) => {
            if (index > 0) {
                const line = new mapgl.Polyline(map, {
                    coordinates: [
                        wpPrev.center,
                        (el as Waypoint).center
                    ],
                    width: 2,
                    color: '#00b7ff',
                    dashLength: 3,
                    gapLength: 3,
                    gapColor: '#ffffff39',
                });
                lines[el.id] = line;
            }
            wpPrev = el;
        })

    })

    store.on('refreshWaypoint', () => {
        store.getItems().filter(el => el.type === 'waypoint').forEach(el => { lines[el.id] && lines[el.id].destroy() });
        lines = {};
        let wpPrev;
        store.getItems().filter(el => el.type === 'waypoint').forEach((el, index) => {
            if (index > 0) {
                const line = new mapgl.Polyline(map, {
                    coordinates: [
                        wpPrev.center,
                        (el as Waypoint).center
                    ],
                    width: 2,
                    color: '#00b7ff',
                    dashLength: 3,
                    gapLength: 3,
                    gapColor: '#ffffff39',
                });
                lines[el.id] = line;
            }
            wpPrev = el;
        })

    })
}