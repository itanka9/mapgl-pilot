

let dialog?: HTMLElement;
let overlay?: HTMLElement;
let resolver;
let rejector;

export function PopupTextareaDialog(title: string, description: string, content: string) {
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.id = 'popup-textarea-dialog';

        overlay = document.createElement('div');
        overlay.id = 'popup-dialog-overlay';

        document.body.appendChild(dialog);
        document.body.appendChild(overlay);
    }
    
    dialog.innerHTML = `
        <div class="dialog-head">
            <div class="dialog-caption">
                <h3>${title}</h3>
                <div>${description}</div>
            </div>
            <div class="spread"></div>
            <span class="button close material-icons-outlined">close</span>
        </div>

        
        <textarea class="dialog-content">${content}</textarea>

        <div class="dialog-foot">
            <div class="spread"></div>
            <span class="button submit material-icons-outlined">done</span>
        </div>

    `;

    dialog.querySelector('.close').addEventListener('click', () => {
        dialog.classList.remove('dialog-visible');
        overlay.classList.remove('dialog-visible');
        if (rejector) {
            rejector();
        }
    });
    dialog.querySelector('.submit').addEventListener('click', () => {
        dialog.classList.remove('dialog-visible');
        overlay.classList.remove('dialog-visible');
        if (resolver) {
            resolver(dialog.querySelector('.dialog-content').value);
        }
    });

    dialog.classList.add('dialog-visible');
    overlay.classList.add('dialog-visible');

    if (rejector) {
        rejector();
    }
    return new Promise((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    })
}