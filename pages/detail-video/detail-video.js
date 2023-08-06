// pages/detail-video/detail-video.js
import { getMVDetail, getMVURL, getTopMV } from "../../services/video";

Page({
    data: {
        id: 0,
        mvUrl: "",
        mvInfo: "",
        mvReleted: [],
    },
    onLoad(options) {
        const id = options.id;
        this.setData({ id });

        this.fetchMVURL();
        this.fetchMVDetail();
        this.fetchMVReleted();
    },

    async fetchMVURL() {
        const res = await getMVURL(this.data.id);
        this.setData({ mvUrl: res.data.url });
    },
    async fetchMVDetail() {
        const res = await getMVDetail(this.data.id);
        this.setData({ mvInfo: res.data });
    },
    async fetchMVReleted() {
        const res = await getTopMV();
        this.setData({ mvReleted: res.data });
    },
});
