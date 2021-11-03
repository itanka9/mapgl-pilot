import { map } from ".";
import { store } from "./store";

export function StepControls(root: HTMLElement) {
    root.innerHTML = `<button id="add-step">Добавить шаг</button>`;
    root.querySelector('#add-step').addEventListener('click', () => {
        store.insertWaypoint({
            center: map.getCenter(),
            zoom: map.getZoom(),
            rotation: map.getRotation(),
            pitch: map.getPitch(),
        })
    })
}