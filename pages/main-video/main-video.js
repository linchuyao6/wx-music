// pages/detail-video/detail-video.js
import { getTopMV } from "../../services/video";

Page({
    data: {
        videoList: [],
        pageOffset: 0,
        hasMore: true,
    },

    onLoad() {
        this.fetchTopMV();
    },

    async fetchTopMV() {
        const res = await getTopMV(this.data.pageOffset);
        const newDataList = [...this.data.videoList, ...res.data];
        this.setData({ videoList: newDataList });
        this.data.pageOffset = this.data.videoList.length;
        this.data.hasMore = res.hasMore;
    },

    onReachBottom() {
        if (!this.data.hasMore) {
            return;
        }
        this.fetchTopMV();
    },
    onPullDownRefresh() {
        this.data.videoList = [];
        this.data.hasMore = true;
        this.data.pageOffset = 0;
        this.fetchTopMV();
        wx.stopPullDownRefresh();
    },
});
