import { SHOWMODAL, SEARCHIDC, SEARCHPRODUCT, SEARCHDEPARTMENT, SETTABLE, SETSWITCH, SEARCHCENTER } from '../constants' 

// 打开弹框
export const setModal = isShow => {
    return {
        type: SHOWMODAL,
        visible: isShow
    }
}

// 图表切换
export const setSwitch = isSwitch => {
    return {
        type: SETSWITCH,
        checked: isSwitch
    }
}

// 设置查询列表
export const setIDC = roomLists => {
    return {
        type: SEARCHIDC,
        roomLists: roomLists
    }
}

export const setProduct = productLists => {
    return {
        type: SEARCHPRODUCT,
        productLists: productLists
    }
}

/*export const setDepartment = departmentLists => {
    return {
        type: SEARCHDEPARTMENT,
        departmentLists: departmentLists
    }
}*/

export const setCenter = centerLists => {
    return {
        type: SEARCHCENTER,
        centerLists: centerLists
    }
}

// 设置表格数据
export const setTable = data => {
    return {
        type: SETTABLE,
        tableData: data.table,
        chartData: data.chart,
        tableLoading: data.loading
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

// 获取中心下拉框数据
export function getCenter() {
    return (dispatch, getState) => {
        return dispatch(fetchCenter())
    }
}

function fetchCenter() {
    return dispatch => {
        return fetch("/get_centers/", {
                method: "GET",
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setCenter(data))
            })
    }
}

// 获取部门下拉框数据
/*export function getDepartment() {
    return (dispatch, getState) => {
        return dispatch(fetchDepartment())
    }
}

function fetchDepartment() {
    return dispatch => {
        return fetch("/get_departments/", {
                method: "GET",
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setDepartment(data))
            })
    }
}*/

// 获取弹框表格数据
export function getTable(param, type) {
    return (dispatch, getState) => {
        dispatch(setTable({table: [], loading: true}))
        dispatch(setSwitch(false))
        dispatch(setModal(true))

        return dispatch(fetchTable(param, type))
    }
}

function fetchTable(param, type) {
    return dispatch => {
        let url

        switch (type) {
            case 'idc':
                url = '/chart/idc_info/'
                break
            case 'onoff':
                url = '/chart/onoff_info/'
                break
            case 'product':
                url = '/chart/product_info/'
                break
            case 'department':
                url = '/chart/department_info/'
                break
        }

        return fetch(url, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(param)
            })
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setTable({table: data.devices, chart: data.chart, loading: false}))
            })
    }
}