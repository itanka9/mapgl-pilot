import { load } from '@2gis/mapgl';
import { Map } from '@2gis/mapgl/types';
import { store } from './store';
import { Waypoint } from './types';
import { WaypointList } from './waypoint-list';
import { LngLat } from './datatypes/lnglat';

export let map: Map;

async function start() {
    const mapgl = await load();

    map = window.map = new mapgl.Map('map', {
        key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
        center: [55.31878, 25.23584],
        zoom: 13,
    });

    installMoveHandler(map);
    WaypointList(document.getElementById('steps'));
}

start();

const pressedKeys = {};

function installMoveHandler (map) {
    document.addEventListener('keydown', function (ev) {
        if (pressedKeys[ev.code]) {
            return;
        }
        pressedKeys[ev.code] = {
            pressStart: now()
        }
    })
    document.addEventListener('keyup', function (ev) {
        console.log('keyup', ev.code)
        delete pressedKeys[ev.code];
        appKeyHandler(map, ev.code);
    })
    setInterval(() => processPressedKeys(map), 150);
}

function now() {
    return new Date().getTime()
}

function getThrust(dt, target) {
    switch (target) {
        case 'movement':
            return 0.05 * Math.min(20, (dt / 1000) ** 1.5);
        case 'turn':
            return 4 * Math.min(5, (dt / 1000) ** 2.5);
        case 'attack':
            return 4 * Math.min(5, (dt / 1000) ** 2.5);
    
    }
}

function appKeyHandler (map: Map, key: string) {
    if (key === 'Space') {
        store.addWaypoint({
            center: LngLat.fromArray(map.getCenter()),
            zoom: map.getZoom(),
            rotation: map.getRotation(),
            pitch: map.getPitch(),
            duration: 8000
        })
    }
}

function processPressedKeys (map) {
    const duration = 200;
    for (const key in pressedKeys) {
        const { pressStart } = pressedKeys[key]
        const dt = Math.min(5000, now() - pressStart)
        if (key === 'ArrowUp') {
            map.setZoom(map.getZoom() + getThrust(dt, 'movement'), { duration });
        }
        if (key === 'ArrowDown') {
            map.setZoom(map.getZoom() - getThrust(dt, 'movement')), { duration };
        }
        if (key === 'ArrowLeft') {
            map.setRotation(map.getRotation() - getThrust(dt, 'turn'), { duration });
        }
        if (key === 'ArrowRight') {
            map.setRotation(map.getRotation() + getThrust(dt, 'turn'), { duration });
        }
        if (key === 'KeyR') {
            map.setPitch(map.getPitch() + getThrust(dt, 'attack'), { duration });
        }
        if (key === 'KeyF') {
            map.setPitch(map.getPitch() - getThrust(dt, 'attack'), { duration });
        }    
    }
}

export function applyWaypoint(map: Map, wp: Waypoint) {
    map.setCenter(wp.center.toArray());
    map.setZoom(wp.zoom);
    map.setPitch(wp.pitch);
    map.setRotation(wp.rotation);
}

export function moveToWaypoint(map: Map, prev: Waypoint, wp: Waypoint) {
    const { duration } = wp;
    map.setCenter(wp.center.toArray(), { duration });
    map.setZoom(wp.zoom, { duration });
    map.setRotation(wp.rotation, { duration });
    map.setPitch(wp.pitch, { duration });
}