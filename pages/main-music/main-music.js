// pages/detail-music/detail-music.js
import { getMusicBanner, getPlayList } from "../../services/music";
import querySelect from "../../utils/query-select";
// import _ from "underscore";
import throttle from "../../utils/throttle";

const querySelectThrottle = throttle(querySelect, 1000);
Page({
    // pages/detail-music/detail-music.js
    data: {
        banner: [],
        bannerHeight: 1000,
        recommendSongs: [],
    },
    onLoad() {
        this.fetchMusicBanner();
        this.fetchRecommedList();
    },

    // 发送网络请求
    async fetchMusicBanner() {
        const res = await getMusicBanner();
        this.setData({ banner: res.banners });
    },
    async fetchRecommedList() {
        const res = await getPlayList();
        const playList = res.playlist;
        console.log(playList);
        const recommendSongs = playList.tracks.slice(0, 6);
        this.setData({ recommendSongs });
    },
    // 事件监听方法
    onSearchClick() {
        wx.navigateTo({
            url: "/pages/detail-music/detail-music",
        });
    },
    onBannerImageLoad() {
        querySelectThrottle(".bannerImage").then((res) => {
            this.setData({ bannerHeight: res[0].height });
        });
    },
    onRecommendMoreClick() {},
});
