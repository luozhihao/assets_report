import { SHOWMODAL, SEARCHIDC, SEARCHPRODUCT } from '../constants'

// 初始化state数据
const initialState = {
    visible: false,
    roomLists: [],
    productLists: []
}

export default function update(state = initialState, action) {
    switch(action.type) {
        case SHOWMODAL:
            return Object.assign({}, state, { visible: action.visible })
            break
        case SEARCHIDC:
            return Object.assign({}, state, { roomLists: action.roomLists })
            break
        case SEARCHPRODUCT:
            return Object.assign({}, state, { productLists: action.productLists })
            break
        default:
            return state
    }
}