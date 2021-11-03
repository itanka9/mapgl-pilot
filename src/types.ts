/**
 * Опорная точка
 */
export interface Waypoint {
    type: 'waypoint',
    id: number,
    center: number[],
    zoom: number,
    pitch: number,
    rotation: number,
}

/**
 * Переход между опорными точками
 */
export interface Transition {
    type: 'transition',
    id: number,
    duration: number
}

type CommandType = 'center' | 'zoom' | 'rotation' | 'pitch';

export interface Command {
    type: CommandType,
    args: Array<any>,
    start: number,
    duration: number
}