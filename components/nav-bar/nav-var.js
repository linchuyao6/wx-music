// components/nav-bar/nav-var.js
const app = getApp();

Component({
    options: {
        multipleSlots: true,
    },
    properties: {
        title: {
            type: String,
            value: "导航标题",
        },
    },
    data: {
        statusheight: 20,
    },
    lifetimes: {
        attached() {
            this.setData({ statusheight: app.globalData.statusheight });
        },
    },
    methods: {
        onLeftClick() {
            this.triggerEvent("leftclick");
        },
    },
});
