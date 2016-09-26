import { SHOWMODAL, SEARCHIDC, SEARCHPRODUCT } from '../constants' 

// 打开弹框
export const setModal = isShow => {
    return {
        type: SHOWMODAL,
        visible: isShow,
    }
}

// 获取查询列表
export const setIDC = (roomLists) => {
    return {
        type: SEARCHIDC,
        roomLists: roomLists
    }
}

export const setProduct = (productLists) => {
    return {
        type: SEARCHPRODUCT,
        productLists: productLists
    }
}

// 获取IDC下拉框数据
export function getIDC() {
    return (dispatch, getState) => {
        return dispatch(fetchIDC())
    }
}

function fetchIDC() {
    return dispatch => {
        return fetch("/get_idcs/", {
                method: "GET",
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setIDC(data))
            })
    }
}

// 获取产品下拉框数据
export function getProduct() {
    return (dispatch, getState) => {
        return dispatch(fetchProduct())
    }
}

function fetchProduct() {
    return dispatch => {
        return fetch("/get_all_products/", {
                method: "GET",
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setProduct(data))
            })
    }
}