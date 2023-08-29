// pages/music-player/music-player.js
const app = getApp();
import { getMusicDetail, getSongLyric } from "../../services/player";
import playStore from "../../store/playStore";
import throttle from "../../utils/throttle";
import parseLyric from "../../utils/parseLyric";
import playerStore from "../../store/playStore";

// 创建播放器
const audioContext = wx.createInnerAudioContext();
Page({
    data: {
        pageTitles: ["歌曲", "歌词"],
        currentPage: 0,
        contentHeight: 0,

        playSongList: [],
        playSongIndex: 0,
        isFirstPlay: true,

        id: 0,
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        sliderValue: 0,
        isWaiting: false,
        isSliderChanging: false,

        isPlaying: true,
        // 歌词部分
        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,
        lyricScrollTop: 0,
    },
    onLoad(options) {
        this.setData({
            contentHeight: app.globalData.contentHeight,
        });
        const { id } = options;
        this.setData({ id });
        // 共享数据
        playerStore.onStates(
            ["playSongList", "playSongIndex"],
            this.getPlaySongInfosHandler
        );

        //  发送网络请求
        this.setupPlaySong(id);
    },
    // 播放歌曲
    setupPlaySong(id) {
        this.data.isWaiting = true;
        setTimeout(() => {
            this.data.isWaiting = false;
        }, 1000);
        // 获取音乐信息
        getMusicDetail(id).then((res) => {
            this.setData({
                currentSong: res.songs[0],
                durationTime: res.songs[0].dt,
            });
        });
        // 获取歌词信息
        getSongLyric(id).then((res) => {
            const lryString = res.lrc.lyric;
            const lyricInfos = parseLyric(lryString);
            this.setData({ lyricInfos });
        });
        // 播放当前歌曲
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        audioContext.stop();
        audioContext.autoplay = true;

        audioContext.onTimeUpdate(() => {
            if (this.data.isSliderChanging || this.data.isWaiting) return;
            const sliderValue =
                (audioContext.currentTime * 100000) / this.data.durationTime;
            this.setData({
                currentTime: audioContext.currentTime * 1000,
                sliderValue,
            });
            // 先缓冲在播放，防止在滑动完滑块后进度条停止
            audioContext.onWaiting(() => {
                audioContext.pause();
            });
            audioContext.onCanplay(() => {
                audioContext.play();
            });
            // 匹配正确的歌词
            if (!this.data.lyricInfos.length) return;
            let index = this.data.lyricInfos.length - 1;
            for (let i = 0; i < this.data.lyricInfos.length; i++) {
                const info = this.data.lyricInfos[i];
                if (info.time > audioContext.currentTime * 1000) {
                    index = i - 1;
                    break;
                }
            }

            if (index === this.data.currentLyricIndex) return;

            const currentLyricText = this.data.lyricInfos[index].text;
            this.setData({
                currentLyricText,
                currentLyricIndex: index,
                lyricScrollTop: index * 35,
            });
        });
    },
    // 点击事件
    onNavBackTap() {
        wx.navigateBack();
    },
    onSwiperChange(event) {
        this.setData({ currentPage: event.detail.current });
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index;
        this.setData({ currentPage: index });
    },
    onPlayOrPauseTap() {
        if (!audioContext.paused) {
            audioContext.pause();
            this.setData({ isPlaying: false });
        } else {
            audioContext.play();
            this.setData({ isPlaying: true });
        }
    },
    onSliderChange(event) {
        this.data.isWaiting = true;
        setTimeout(() => {
            this.data.isWaiting = false;
        }, 100);
        const value = event.detail.value;
        const currentTime = (value / 100) * this.data.durationTime;

        audioContext.seek(currentTime / 1000);
        this.setData({ currentTime, isSliderChanging: false });
    },
    onSliderChanging: throttle(function (event) {
        this.setData({ isSliderChanging: true });
        const value = event.detail.value;

        // 2.根据当前的值, 计算出对应的时间
        const currentTime = (value / 100) * this.data.durationTime;
        this.setData({ currentTime });
    }, 100),
    onNextBtnTap() {
        this.changeNewSongs(false);
    },
    onPrevBtnTap() {
        this.changeNewSongs();
    },
    changeNewSongs(isNext = true) {
        const length = this.data.playSongList.length;
        let index = this.data.playSongIndex;

        index = isNext ? index + 1 : index - 1;
        if (index === length) index = 0;
        if (index === -1) index = length - 1;
        const newSongs = this.data.playSongList[index];
        this.setData({
            currentSong: {},
            sliderValue: 0,
            currentTime: 0,
            durationTime: 0,
            currentLyricText: "",
            lyricInfos: [],
        });
        this.setupPlaySong(newSongs.id);
        playerStore.setState("playSongIndex", index);
    },
    // 发送网络请求

    // store共享数据
    getPlaySongInfosHandler({ playSongList, playSongIndex }) {
        if (playSongList) {
            this.setData({ playSongList });
        }
        if (playSongIndex !== undefined) {
            this.setData({ playSongIndex });
        }
    },

    onUnload() {
        playerStore.offStates(
            ["playSongList", "playSongIndex"],
            this.getPlaySongInfosHandler
        );
    },
});
