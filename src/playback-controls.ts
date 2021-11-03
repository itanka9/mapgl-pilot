import { timeDiffToString } from "./datatypes/time";
import { store } from "./store";

export function PlaybackControls(root: HTMLElement) {
    const timeReseted = '--:--.--';
    root.innerHTML = `
        <span id="rec" class="button material-icons-outlined">fiber_manual_record</span>
        <span id="play" class="button material-icons-outlined">play_arrow</span>
        <span id="stop" class="button disabled material-icons-outlined">stop</span>

        <span id="time">${timeReseted}</span>
    `;

    const recButton = root.querySelector('#rec');
    const playButton = root.querySelector('#play');
    const stopButton = root.querySelector('#stop');

    const timeTable = root.querySelector('#time');

    let ticker = null;
    let t = 0;

    store.on('playbackState', state => {
        if (state === 'play' || state === 'rec') {
            playButton.classList.add('disabled');
            recButton.classList.add('disabled');
            stopButton.classList.remove('disabled');
            t = new Date().getTime();
            ticker = setInterval(() => {
                timeTable.innerText = timeDiffToString(new Date().getTime(), t);
            }, 10);
        } else if (state === 'stop') {
            playButton.classList.remove('disabled');
            recButton.classList.remove('disabled');
            stopButton.classList.add('disabled');
            clearInterval(ticker);
            timeTable.innerText = timeReseted;
        }
    })

    recButton.addEventListener('click', () => store.setPlaybackState('rec'));
    playButton.addEventListener('click', () => store.setPlaybackState('play'));
    stopButton.addEventListener('click', () => store.setPlaybackState('stop'));

    return root;
}