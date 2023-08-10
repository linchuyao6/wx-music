import { myRequset } from "./index";

export function getMusicBanner(type = 1) {
    return myRequset.get({
        url: "/banner",
        data: {
            type,
        },
    });
}

export function getPlayList(id = 3779629) {
    return myRequset.get({
        url: "/playlist/detail",
        data: {
            id,
        },
    });
}

export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
    return myRequset.get({
        url: "/top/playlist",
        data: {
            cat,
            limit,
            offset,
        },
    });
}

export function getSongMenuTag() {
    return myRequset.get({
        url: "/playlist/hot`",
    });
}
