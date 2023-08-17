// pages/music-player/music-player.js
import { getMusicDetail, getSongLyric } from "../../services/player";
Page({
    data: {
				id: 0,
				currentSong:{}
    },
    onLoad(options) {
        const { id } = options;
        this.setData({ id });

        //  发送网络请求
       this.fetchMusicDetail(id)
    },


    // 发送网络请求
    fetchMusicDetail(id){
        getMusicDetail(id).then(res=>{
           this.setData({currentSong:res.songs[0]})
        })
    }
});
