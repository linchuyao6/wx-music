import { myRequset } from "./index";

export function getTopMV(offset = 0, limit = 20) {
    return myRequset.get({
        url: "/top/mv",
        data: {
            limit,
            offset,
        },
    });
}

export function getMVDetail(mvid) {
    return myRequset.get({
        url: "/mv/detail",
        data: {
            mvid,
        },
    });
}

export function getMVURL(id) {
    return myRequset.get({
        url: "/mv/url",
        data: {
            id,
        },
    });
}

export function getMVRelated(id) {
    return myRequset.get({
        url: "/related/allvideo",
        data: {
            id,
        },
    });
}
