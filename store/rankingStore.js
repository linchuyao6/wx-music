import { HYEventStore } from "hy-event-store";
import { getPlayList } from "../services/music";

const rankingMap = {
    newRanking: 3779629,
    originRanking: 2884035,
    upRanking: 19723756,
};

const rankingStore = new HYEventStore({
    state: {
        newRanking: {},
        originRanking: {},
        upRanking: {},
    },
    actions: {
        fetchRankingDataAction(ctx) {
            for (const key of rankingMap) {
                const id = rankingMap[key];
                getPlayList(id).then((res) => {
                    ctx[key] = res.playlist;
                });
            }
        },
    },
});
