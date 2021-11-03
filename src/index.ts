import { load } from '@2gis/mapgl';
import { Map } from '@2gis/mapgl/types';
import { store } from './store';
import { Transition, Waypoint } from './types';
import { WaypointList } from './waypoint-list';
import { LngLat } from './datatypes/lnglat';
import { PlaybackControls } from './playback-controls';
import { WaypointMarker } from './waypoint-marker';
import { WaypointPath } from './waypoint-path';
import { ImportExport } from './import-export';
import { StepControls } from './step-controls';


export let map: Map;

async function start() {
    const mapgl = await load();

    map = (window as any).map = new mapgl.Map('map', {
        key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
        center: [55.31878, 25.23584],
        zoom: 13,
    });

    installMoveHandler(map);

    WaypointList(document.getElementById('steps'));

    WaypointMarker(map, mapgl);
    WaypointPath(map, mapgl);

    ImportExport(document.getElementById('import-export'));

    PlaybackControls(document.getElementById('playback-controls'));
    StepControls(document.getElementById('step-controls'));
    
    store.on('waypointAdded', saveStore);
    store.on('transitionAdded', saveStore);
    store.on('playbackState', state => {
        if (state === 'play') {
            playback(map);
        }
    })

    resetStore();
}

start();

function resetStore () {
    const serialized = localStorage.getItem('store');
    if (!serialized) {
        return
    }
    store.deserialize(JSON.parse(serialized));
}

function saveStore () {
    localStorage.setItem('store', JSON.stringify(store.serialize()));
}

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
        store.insertWaypoint({
            center: map.getCenter(),
            zoom: map.getZoom(),
            rotation: map.getRotation(),
            pitch: map.getPitch(),
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

function idlePromise(map: Map) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            if ((map as any)._impl.core.isIdle()) {
                resolve()
            } else {
                map.once('idle', () => resolve())
            }
        }, 100)
    })
}

export async function applyWaypoint(map: Map, wp: Waypoint, duration = 0) {
    const options = duration ? { duration } : undefined;
    map.setCenter(wp.center, options);
    map.setZoom(wp.zoom, options);
    map.setPitch(wp.pitch, options);
    map.setRotation(wp.rotation, options);
    return idlePromise(map);
}

export async function applyTransition(map: Map, t: Transition) {
    const wpFrom = store.getById(t.id - 1);
    const wpTo = store.getById(t.id + 1);
    if (wpFrom?.type !== 'waypoint' || wpTo?.type !== 'waypoint') {
        return
    }
    await applyWaypoint(map, wpFrom);
    await applyWaypoint(map, wpTo, t.duration);
}

export async function playback (map: Map) {
    for (const e of store.getItems()) {
        if (store.getPlaybackState() !== 'play') {
            return;
        }
        if (e.type === 'transition') {
            await applyTransition(map, e);
        }
    }
    store.setPlaybackState('stop')
}