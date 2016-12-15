import { SHOWMODAL, SEARCHIDC, SEARCHPRODUCT, SEARCHDEPARTMENT, SETTABLE, SETSWITCH, SEARCHCENTER } from '../constants'

// 初始化state数据
const initialState = {
    visible: false,
    roomLists: [],
    productLists: [],
    /*departmentLists: [],*/
    centerLists: [],
    tableData: [],
    chartData: null,
    checked: false,
    tableLoading: true
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
        /*case SEARCHDEPARTMENT:
            return Object.assign({}, state, { departmentLists: action.departmentLists })
            break*/
        case SEARCHCENTER:
            return Object.assign({}, state, { centerLists: action.centerLists })
            break
        case SETTABLE:
            return Object.assign({}, state, { tableData: action.tableData, chartData: action.chartData, tableLoading: action.tableLoading })
            break
        case SETSWITCH:
            return Object.assign({}, state, { checked: action.checked })
            break
        default:
            return state
    }
}