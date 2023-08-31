// pages/music-player/music-player.js
const app = getApp();
import playStore, { audioContext } from "../../store/playStore";
import throttle from "../../utils/throttle";
import playerStore from "../../store/playStore";

// 创建播放器

const modeNames = ["order", "repeat", "random"];
Page({
    data: {
        stateKeys: [
            "id",
            "currentSong",
            "durationTime",
            "currentTime",
            "lyricInfos",
            "currentLyricText",
            "currentLyricIndex",
            "isPlaying",
            "playModeIndex",
        ],
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

        playModeIndex: 0, //0:顺序播放 1:单曲循环 2:随机播放
        playModeName: "order",
    },
    onLoad(options) {
        this.setData({
            contentHeight: app.globalData.contentHeight,
            contentHeight: app.globalData.contentHeight,
        });
        const { id } = options;
        if (id) {
            playStore.dispatch("playMusicWithSongIdAction", id);
        }
        // 共享数据
        playerStore.onStates(
            ["playSongList", "playSongIndex"],
            this.getPlaySongInfosHandler
        );
        playStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler);
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
    onSliderChange(event) {
        this.data.isWaiting = true;
        setTimeout(() => {
            this.data.isWaiting = false;
        }, 100);
        const value = event.detail.value;
        const currentTime = (value / 100) * this.data.durationTime;

        audioContext.seek(currentTime / 1000);
        this.setData({
            currentTime,
            isSliderChanging: false,
            sliderValue: value,
        });
    },
    onSliderChanging: throttle(function (event) {
        this.setData({ isSliderChanging: true });
        const value = event.detail.value;

        // 2.根据当前的值, 计算出对应的时间
        const currentTime = (value / 100) * this.data.durationTime;
        this.setData({ currentTime });
    }, 100),
    onPlayOrPauseTap() {
        playerStore.dispatch("changeMusicStatusAction");
    },
    onNextBtnTap() {
        playStore.dispatch("playNewMusicAction");
    },
    onPrevBtnTap() {
        playStore.dispatch("playNewMusicAction", false);
    },
    onModelBtnTap() {
        playStore.dispatch("changePlayModeAction");
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
    getPlayerInfosHandler({
        id,
        currentSong,
        durationTime,
        currentTime,
        lyricInfos,
        currentLyricText,
        currentLyricIndex,
        isPlaying,
        playModeIndex,
    }) {
        if (id !== undefined) {
            this.setData({ id });
        }
        if (currentSong) {
            this.setData({ currentSong });
        }
        if (durationTime !== undefined) {
            this.setData({ durationTime });
        }
        if (currentTime !== undefined) {
            if (this.data.isSliderChanging) return;
            // 1.记录当前的时间 2.修改sliderValue
            const sliderValue = (currentTime / this.data.durationTime) * 100;
            this.setData({ currentTime, sliderValue });
        }
        if (lyricInfos !== undefined) {
            this.setData({ lyricInfos });
        }
        if (currentLyricText !== undefined) {
            this.setData({ currentLyricText });
        }
        if (currentLyricIndex !== undefined) {
            // 修改lyricScrollTop
            this.setData({
                currentLyricIndex,
                lyricScrollTop: currentLyricIndex * 35,
            });
        }
        if (isPlaying !== undefined) {
            this.setData({ isPlaying });
        }
        if (playModeIndex !== undefined) {
            this.setData({ playModeName: modeNames[playModeIndex] });
        }
    },
    onUnload() {
        playerStore.offStates(
            ["playSongList", "playSongIndex"],
            this.getPlaySongInfosHandler
        );
        playStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler);
    },
});
