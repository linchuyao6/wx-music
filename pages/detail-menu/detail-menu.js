// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music";
Page({
    data: {
        songMenus: [],
    },
    onLoad() {
        this.fetchAllMenuList();
    },

    async fetchAllMenuList() {
        const tagRes = await getSongMenuTag();
        const tags = tagRes.tags;

        const allPromise = [];
        for (const tag of tags) {
            const promise = await getSongMenuList(tag.name);
            allPromise.push(promise);
        }
        Promise.all(allPromise).then((res) => {
            this.setData({ songMenus: res });
        });
    },
});
