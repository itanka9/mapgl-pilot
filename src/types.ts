import { LngLat } from "./datatypes/lnglat";

export interface Waypoint {
    type: 'waypoint',
    id: number,
    center: LngLat,
    zoom: number,
    pitch: number,
    rotation: number,
    duration: number
}

export interface Transition {
    type: 'transition',
    id: number,
    duration: number
}