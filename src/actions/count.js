import { SHOWMODAL} from '../constants' 

// 获取产品列表
export const setModal = isShow => {
    return {
        type: SHOWMODAL,
        visible: isShow,
    }
}