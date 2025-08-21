export type Preset = 'today' | '7d' | '30d';

function startOfDay(d: Date) {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
}

export function getPresetRange(preset: Preset) {
    const now = new Date();
    const to = now;
    let from = new Date(now);
    if (preset === 'today') {
        from = startOfDay(now);
    }
    if (preset === '7d') {
        from.setDate(now.getDate() - 7);
    }
    if (preset === '30d') {
        from.setDate(now.getDate() - 30);
    }
    return { from, to };
}
