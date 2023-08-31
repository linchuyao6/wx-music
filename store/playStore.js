import { HYEventStore } from "hy-event-store";
import { getMusicDetail, getSongLyric } from "../services/player";
import parseLyric from "../utils/parseLyric";

export const audioContext = wx.createInnerAudioContext();
const playerStore = new HYEventStore({
    state: {
        playSongList: [],
        playSongIndex: 0,

        id: 0,
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        sliderValue: 0,
        isWaiting: false,
        isSliderChanging: false,
        playModeIndex: 0,

        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,

        isPlaying: false,
    },
    actions: {
        playMusicWithSongIdAction(ctx, id) {
            ctx.isSliderChanging = false;
            ctx.currentSong = {};
            ctx.currentTime = 0;
            ctx.durationTime = 0;
            ctx.sliderValue = 0;
            ctx.lyricInfos = [];
            ctx.currentLyricText = "";
            ctx.currentLyricIndex = "";

            ctx.id = id;
            ctx.isPlaying = true;
            // 获取音乐信息
            getMusicDetail(id).then((res) => {
                ctx.currentSong = res.songs[0];
                ctx.durationTime = res.songs[0].dt;
            });

            // 获取歌词信息
            getSongLyric(id).then((res) => {
                const lryString = res.lrc.lyric;
                const lyricInfos = parseLyric(lryString);
                ctx.lyricInfos = lyricInfos;
            });
            // 播放当前歌曲
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
            audioContext.stop();
            audioContext.autoplay = true;

            // 先缓冲在播放，防止在滑动完滑块后进度条停止
            audioContext.onWaiting(() => {
                audioContext.pause();
            });
            audioContext.onCanplay(() => {
                audioContext.play();
            });
            audioContext.onEnded(() => {
                if (audioContext.loop) return;
                this.dispatch();
            });
            audioContext.onTimeUpdate(() => {
                if (ctx.isSliderChanging || ctx.isWaiting) return;
                const sliderValue =
                    (audioContext.currentTime * 100000) / ctx.durationTime;
                (ctx.currentTime = audioContext.currentTime * 1000),
                    (ctx.sliderValue = sliderValue);

                // 匹配正确的歌词
                if (!ctx.lyricInfos.length) return;
                let index = ctx.lyricInfos.length - 1;
                for (let i = 0; i < ctx.lyricInfos.length; i++) {
                    const info = ctx.lyricInfos[i];
                    if (info.time > audioContext.currentTime * 1000) {
                        index = i - 1;
                        break;
                    }
                }

                if (index === ctx.currentLyricIndex) return;

                const currentLyricText = ctx.lyricInfos[index].text;

                ctx.currentLyricText = currentLyricText;
                ctx.currentLyricIndex = index;
                ctx.lyricScrollTop = index * 35;
            });
        },

        changeMusicStatusAction(ctx) {
            if (!audioContext.paused) {
                audioContext.pause();
                ctx.isPlaying = false;
            } else {
                audioContext.play();
                ctx.isPlaying = true;
            }
        },
        changePlayModeAction(ctx) {
            let modeIndex = ctx.playModeIndex;
            modeIndex = modeIndex + 1;
            if (modeIndex === 3) modeIndex = 0;

            if (modeIndex === 1) {
                audioContext.loop = true;
            } else {
                audioContext.loop = false;
            }
            ctx.playModeIndex = modeIndex;
        },
        playNewMusicAction(ctx, isNext = true) {
            const length = ctx.playSongList.length;
            let index = ctx.playSongIndex;
            switch (ctx.playModeIndex) {
                case 1:
                case 0: //顺序播放
                    index = isNext ? index + 1 : index - 1;
                    if (index === length) index = 0;
                    if (index === -1) index = length - 1;
                    break;
                case 2: //随机播放
                    index = Math.floor(Math.random() * length);
                    break;
            }

            const newSong = ctx.playSongList[index];

            this.dispatch("playMusicWithSongIdAction", newSong.id);

            ctx.playSongIndex = index;
        },
    },
});

export default playerStore;
