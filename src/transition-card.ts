import { applyTransition, map } from '.';
import { Transition } from './types';

export function TransitionCard(t: Transition) {
    const root = document.createElement('div');
    root.classList.add('transition');
    root.innerHTML = `
    <label>Длит.</label><input class="duration" size="6" value="${t.duration}">
    `;

    root.addEventListener('click', () => {
        applyTransition(map, t);
    });

    return root;
}