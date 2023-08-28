const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export default function parseLyric(lyrString) {
    const lyricInfos = [];
    const lyricLines = lyrString.split("\n");
    for (const item of lyricLines) {
        const result = timeReg.exec(item);
        if (!result) continue;
        const minute = result[1] * 60 * 1000;
        const second = result[2] * 1000;
        const mSecond = result[3].length === 2 ? result[3] * 10 : result[3] * 1;
        const time = minute + second + mSecond;
        const text = item.replace(timeReg, "");
        lyricInfos.push({ time, text });
    }
    return lyricInfos;
}
