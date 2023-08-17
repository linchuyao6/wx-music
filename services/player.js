import { myRequset } from "./index";


export function getMusicDetail(ids){
  return myRequset.get({
    url:"/song/detail",
    data:{
      ids
    }
  })
}

export function getSongLyric(id){
  return myRequset.get({
    url:'/lyric',
    data:{
      id
    }
  })
}