// pages/detail-music/detail-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music";
import querySelect from "../../utils/query-select";
import recommendSongs from "../../store/recommendStore";
import rankingStore from "../../store/rankingStore";
import throttle from "../../utils/throttle";
import recommendStore from "../../store/recommendStore";

const querySelectThrottle = throttle(querySelect, 1000);
Page({
    // pages/detail-music/detail-music.js
    data: {
        banner: [],
        bannerHeight: 0,
        recommendSongs: [],
        screenWidth: 375,

        // 歌单数据
        hotMenuList: [],
        recMenuList: [],

        // 巅峰榜数据
        isRankingData: false,
        rankingInfos: {},
    },
    onLoad() {
        this.fetchMusicBanner();
        this.fetchSongMenuList();
        recommendSongs.onState("recommendSongInfo", this.handleRecommendSongs);
        recommendSongs.dispatch("fetchRecommendSongsAction");
        rankingStore.dispatch("fetchRankingDataAction");
        rankingStore.onState("upRanking", this.getRankingInfos("upRanking"));

        rankingStore.onState(
            "originRanking",
            this.getRankingInfos("originRanking")
        );
        rankingStore.onState("newRanking", this.getRankingInfos("newRanking"));
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
    onRecommendMoreClick() {
        wx.navigateTo({
            url: "/pages/detail-music/detail-music?type=recommend",
        });
    },

    // 从store中获取数据
    handleRecommendSongs(value) {
        if (!value.tracks) return;
        this.setData({ recommendSongs: value.tracks.slice(0, 6) });
    },
    // 获取飙升榜
    // handleNewRanking(value) {
    //     if (!value.name) return;
    //     const newRankingInfo = { ...this.data.rankingInfos, newRanking: value };
    //     this.setData({ rankingInfos: newRankingInfo });
    //     console.log(this.data.rankingInfos);
    // },
    // // 获取原创榜
    // handleOriginRanking(value) {
    //     if (!value.name) return;
    //     const newRankingInfo = {
    //         ...this.data.rankingInfos,
    //         originRanking: value,
    //     };
    //     this.setData({ rankingInfos: newRankingInfo });
    // },
    // // 获取新歌榜
    // handleUpRanking(value) {
    //     if (!value.name) return;
    //     const newRankingInfo = {
    //         ...this.data.rankingInfos,
    //         upRanking: value,
    //     };
    //     this.setData({ rankingInfos: newRankingInfo });
    // },
    // 获取榜单数据
    getRankingInfos(ranking) {
        return (value) => {
            if (!value.name) return;
            const newRankingInfo = {
                ...this.data.rankingInfos,
                [ranking]: value,
            };

            this.setData({ rankingInfos: newRankingInfo, isRankingData: true });
        };
    },

    onUnload() {
        recommendStore.offState("recommendSongInfo", this.handleRecommendSongs);
        rankingStore.offState("upRanking", this.getRankingInfos("upRanking"));
    },
});
