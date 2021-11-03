import { Map } from '@2gis/mapgl/types';
import { Command, Transition, Waypoint } from "../types";

type Item = Omit<Waypoint, 'id'> | Omit<Transition, 'id'>

export function toSequence(items: Array<Item>) {
    let t = 0;
    const commands: Command[] = [];
    let lastDuration: number = 0;
    for (const item of items) {
        switch(item.type) {
            case 'waypoint':
                const duration = lastDuration;
                commands.push({
                    type: 'center',
                    args: [item.center],
                    start: t,
                    duration
                });
                commands.push({
                    type: 'zoom',
                    args: [item.zoom],
                    start: t,
                    duration
                });
                commands.push({
                    type: 'rotation',
                    args: [item.rotation],
                    start: t,
                    duration
                });
                commands.push({
                    type: 'pitch',
                    args: [item.pitch],
                    start: t,
                    duration
                });
                t += duration;
                break;
            case 'transition':
                lastDuration = item.duration;
                break;
        }
    }
    return commands
}

export function fromSequence(sequence: Command[]): Array<Item> {
    const timeline: Array<number | Command[]> = [];
    const startPoints = {};
    const items: Array<Item> = [];
    for (const cmd of sequence) {
        if (!startPoints[cmd.start]) {
            startPoints[cmd.start] = []
        }
        startPoints[cmd.start].push(cmd);
    }
    const ts = Object.keys(startPoints).map(Number);
    ts.sort();
    let lastT = 0;
    for (const t of ts) {
        if (t > 0) {
            timeline.push(t);
            lastT = t;
        }
        timeline.push(startPoints[t]);
    }
    let lastParams = [];
    for (const item of timeline) {
        if (typeof item === 'number') {
            items.push({
                type: 'transition',
                duration: item
            })
        } else if (item instanceof Array) {
            for (const cmd of item) {
                lastParams[cmd.type] = cmd.args[0];
            }
            items.push({
                type: 'waypoint',
                center: lastParams['center'],
                zoom: lastParams['zoom'],
                rotation: lastParams['rotation'],
                pitch: lastParams['pitch']
            })

        }
    }
    return items;
}

export async function playSequence(map: Map, sequence: Command[]) {
    const timeline: Array<number | Command[]> = [];
    const startPoints = {};
    for (const cmd of sequence) {
        let start = cmd.start;
        if (start === 0 && cmd.duration === 0) {
            start = -1;
        }
        if (!startPoints[start]) {
            startPoints[start] = []
        }
        startPoints[start].push(cmd);
    }
    const ts = Object.keys(startPoints).map(Number);
    ts.sort((x, y) => x - y);
    let lastT = 0;
    for (const t of ts) {
        if (t > 0) {
            timeline.push(t - lastT);
            lastT = t;
        }
        timeline.push(startPoints[t]);
    }

    const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (const item of timeline) {
        if (typeof item === 'number') {
            await pause(item);
        } else if (item instanceof Array) {
            for (const cmd of item) {
                switch (cmd.type) {
                    case 'center':
                        map.setCenter(cmd.args[0], { duration: cmd.duration });
                        break;
                    case 'zoom':
                        map.setZoom(cmd.args[0], { duration: cmd.duration });
                        break;
                    case 'rotation':
                        map.setRotation(cmd.args[0], { duration: cmd.duration });
                        break;
                    case 'pitch':
                        map.setPitch(cmd.args[0], { duration: cmd.duration });
                        break;                        
                }
            }
        }
    }
}