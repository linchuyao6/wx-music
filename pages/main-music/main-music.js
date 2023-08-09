// pages/detail-music/detail-music.js
import { getMusicBanner } from "../../services/music";
import querySelect from "../../utils/query-select";
// import _ from "underscore";
import throttle from "../../utils/throttle";

const querySelectThrottle = throttle(querySelect, 1000);
Page({
    // pages/detail-music/detail-music.js
    data: {
        banner: [],
        bannerHeight: 1000,
    },
    onLoad() {
        this.fetchMusicBanner();
    },

    // 发送网络请求
    async fetchMusicBanner() {
        const res = await getMusicBanner();
        this.setData({ banner: res.banners });
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
