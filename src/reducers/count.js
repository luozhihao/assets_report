import { SHOWMODAL } from '../constants'

// 初始化state数据
const initialState = {
    visible: false
}

export default function update(state = initialState, action) {
    switch(action.type) {
        case SHOWMODAL:
            return Object.assign({}, state, { visible: action.visible })
            break
        default:
            return state
    }
}