import { Waypoint } from "../types";

const BOUND = 6

function thres (n: number) {
    return Math.round(n * 10**BOUND) / 10**BOUND;
}

type WaypointPos = Omit<Waypoint, 'id' | 'type' | ''>

export function waypointEqual(x: WaypointPos, y: WaypointPos) {
    return thres(x.center[0]) === thres(y.center[0])
      && thres(x.center[1]) === thres(y.center[1])
      && thres(x.zoom) === thres(y.zoom)
      && thres(x.rotation) === thres(y.rotation)
      && thres(x.pitch) === thres(y.pitch)
}