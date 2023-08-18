// pages/music-player/music-player.js
const app = getApp();
import { getMusicDetail, getSongLyric } from "../../services/player";
Page({
    data: {
        pageTitles: ["歌曲", "歌词"],
        currentPage: 0,
        contentHeight: 0,

        id: 0,
        currentSong: {},
    },
    onLoad(options) {
        this.setData({ contentHeight: app.globalData.contentHeight });
        const { id } = options;
        this.setData({ id });

        //  发送网络请求
        this.fetchMusicDetail(id);
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

    // 发送网络请求
    fetchMusicDetail(id) {
        getMusicDetail(id).then((res) => {
            this.setData({ currentSong: res.songs[0] });
        });
    },
});
