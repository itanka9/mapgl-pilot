import { applyTransition, map } from '.';
import { Transition } from './types';
import { store } from './store';

export function TransitionCard(t: Transition) {
    const root = document.createElement('div');
    root.classList.add('transition');
    root.innerHTML = `
    <label>Длит.</label><input class="duration" size="6" value="${t.duration}">
    `;
    const removeButton = document.createElement('button');
    const remove = (t) => {
        store.remove(t);
    }
    root.addEventListener('click', () => {
        applyTransition(map, t);
    });
    removeButton.innerText ='Х';
    removeButton.addEventListener('click', () => {
        remove(t);
    });
    root.appendChild(removeButton)
    return root;
}