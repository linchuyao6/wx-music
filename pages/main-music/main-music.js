// pages/detail-music/detail-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music";
import querySelect from "../../utils/query-select";
import recommendSongs from "../../store/recommendStore";
import rankingStore from "../../store/rankingStore";
import throttle from "../../utils/throttle";

const querySelectThrottle = throttle(querySelect, 1000);
Page({
    // pages/detail-music/detail-music.js
    data: {
        banner: [],
        bannerHeight: 1000,
        recommendSongs: [],

        // 歌单数据
        hotMenuList: [],
        recMenuList: [],
    },
    onLoad() {
        this.fetchMusicBanner();
        this.fetchSongMenuList();
        recommendSongs.onState("recommendSongInfo", this.handleRecommendSongs);
        recommendSongs.dispatch("fetchRecommendSongsAction");
        // rankingStore.onState("newRanking", this.handleNewRanking);
        // rankingStore.onState("originRanking", this.handleOriginRanking);
        // rankingStore.onState("upRanking", this.handleUpRanking);
        // rankingStore.dispatch("fetchRankingDataAction");
    },

    // 发送网络请求
    async fetchMusicBanner() {
        const res = await getMusicBanner();
        this.setData({ banner: res.banners });
    },
    async fetchSongMenuList() {
        getSongMenuList().then((res) => {
            this.setData({ hotMenuList: res.playlists });
        });
        getSongMenuList("流行").then((res) => {
            this.setData({ recMenuList: res.playlists });
        });
    },
    // async fetchRecommedList() {
    //     const res = await getPlayList();
    //     const playList = res.playlist;
    //     console.log(playList);
    //     const recommendSongs = playList.tracks.slice(0, 6);
    //     this.setData({ recommendSongs });
    // },
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

    // 从store中获取数据
    handleRecommendSongs(value) {
        if (!value.tracks) return;
        this.setData({ recommendSongs: value.tracks.slice(0, 6) });
    },
    // 获取热门歌单
    handleNewRanking(value) {
        if (!value.tracks) return;
        this.setData({ hotMenuList: value.track.slice(0, 6) });
    },
});
