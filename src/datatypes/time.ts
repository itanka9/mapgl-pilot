function pad(v: number, n: number) {
    let result = '';
    for (let i = String(v).length; i < n; i++) {
        result += '0';
    }
    return result + v;
}

export function timeDiffToString(t1: number, t2: number) {
    const dt = t1 - t2;
    const ss = Math.trunc(dt / 10) % 100;
    const s = Math.trunc(dt / 1000) % 60;
    const m = Math.trunc(dt / 60000) % 60;
    const h = Math.trunc(dt / (3600 * 1000));

    return `${h ? h + ':' : '' }${pad(m, 2)}:${pad(s, 2)}.${pad(ss, 2)}`;
}