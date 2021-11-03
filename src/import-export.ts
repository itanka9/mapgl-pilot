import { PopupTextareaDialog } from "./popup-dialog";
import { store } from "./store";
import { haiku } from "./utils/haiku";

export function ImportExport(root: HTMLElement) {
    root.innerHTML = `
        <input id="title" placeholder="Название" size=45>
                
        <button id="import">Импорт</button>
        <button id="export">Экспорт</button>
    `

    const importBtn = root.querySelector('#import');
    const exportBtn = root.querySelector('#export');
    const titleInput = root.querySelector('#title');

    titleInput.addEventListener('change', (ev) => {
        store.setTitle(ev.target.value);
    });

    store.on('titleChanged', newTitle => {
        titleInput.value = newTitle;
    });

    if (!store.getTitle()) {
        store.setTitle(haiku());
    }

    exportBtn.addEventListener('click', () => {
        PopupTextareaDialog('Экспорт', 'Запись пролета в JSON', JSON.stringify(store.serialize(), null, 4));
    })

    importBtn.addEventListener('click', () => {
        PopupTextareaDialog('Импорт', 'Вставьте сюда запись пролета в виде JSON', '')
            .then(str => {
                store.deserialize(JSON.parse(str));
            });
    })

}
