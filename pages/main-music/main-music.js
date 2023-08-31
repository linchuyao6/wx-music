// pages/detail-music/detail-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music";
import querySelect from "../../utils/query-select";
import recommendSongs from "../../store/recommendStore";
import rankingStore from "../../store/rankingStore";
import playerStore from "../../store/playStore";
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
        // 当前正在播放的歌曲信息
        currentSong: {},
        isPlaying: false,
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
        playerStore.onStates(["currentSong", "isPlaying"], this.hanlePlayInfos);
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
    onSongItemTap(event) {
        const index = event.currentTarget.dataset.index;
        playerStore.setState("playSongList", this.data.recommendSongs);
        playerStore.setState("playSongIndex", index);
    },
    onPlayOrPauseBtnTap() {
        playerStore.dispatch("changeMusicStatusAction");
    },
    onPlayBarAlbumTap() {
        wx.navigateTo({
            url: "/pages/music-player/music-player",
        });
    },

    // 从store中获取数据
    handleRecommendSongs(value) {
        if (!value.tracks) return;
        this.setData({ recommendSongs: value.tracks.slice(0, 6) });
    },
    hanlePlayInfos({ currentSong, isPlaying }) {
        if (currentSong) {
            this.setData({ currentSong });
        }
        if (isPlaying !== undefined) {
            this.setData({ isPlaying });
        }
    },
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
