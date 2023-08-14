// components/ranking-item/ranking-item.js
Component({
    properties: {
        itemData: {
            type: Object,
            value: {},
        },
        key: {
            type: String,
            value: "newRanking",
        },
    },
    methods: {
        onRankingItemTap() {
            const key = this.properties.key;
            wx.navigateTo({
                url: `/pages/detail-music/detail-music?type=ranking&key=${key}`,
            });
        },
    },
});
