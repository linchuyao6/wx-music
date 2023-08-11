import { HYEventStore } from "hy-event-store";
import { getPlayList } from "../services/music";

const recommendStore = new HYEventStore({
    state: {
        recommendSongInfo: {},
    },
    actions: {
        fetchRecommendSongsAction(ctx) {
            getPlayList(3778678).then((res) => {
                ctx.recommendSongInfo = res.playlist;
            });
        },
    },
});

export default recommendStore;
