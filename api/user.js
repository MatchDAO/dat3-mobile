import { request, requestFormData, requestAxios } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 
{ "userCode
email
wallet
}

 */
export function getUserInfo(data = {}) {
    return request({
        method: 'POST',
        data,
        url: `${BASE_PATH}/user/info`
    })
}
export function getUserRewards(data = {}) {
    return request({
        method: 'GET',
        data,
        url: `${BASE_PATH}/assetActivity/chat/rewards`
    })
}
export function getGradeList(data = {}) {
    return request({
        method: 'GET',
        data,
        url: `${BASE_PATH}/metadata/grade`
    })
}
export function getAppVerify(data = {}) {
    return request({
        method: 'GET',
        data,
        url: `${BASE_PATH}/metadata/base`
    })
}
export function getUserGrade(data = {}) {
    return request({
        method: 'GET',
        data,
        url: `${BASE_PATH}/rtc/grade/${data.userCode}`
    })
}
export function setUserGrade(data = {}) {
    return request({
        method: 'GET',
        data,
        url: `${BASE_PATH}/rtc/newGrade/${data.id}`
    })
}
/**
 *   axios
{ 
    "userCode":"test@dvsd.com", 
    userName
    bio
}
 */
export function editUserInfo(data = {}, fileParams = {}) {
    const { filePath = undefined, name = 'file' } = fileParams
    return requestFormData({
        method: 'POST',
        data,
        url: `${BASE_PATH}/user/modify`,
        showLoading: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        filePath,
        name
    })
}
export function editUserPortrait(data = {}, fileParams = {}) {
    const { filePath = undefined, name = 'file' } = fileParams
    return requestFormData({
        method: 'POST',
        data,
        url: `${BASE_PATH}/user/${data.userCode}/portrait`,
        showLoading: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        filePath,
        name
    })
}
/**
 * 
 * 
    {
        "profession": "["123","1234"]",
        "userName": "s",
        "current": 1,
        "size": 10
    }
 */
export function getPopularUserList(data = {}) {
    return request({
        method: 'POST',
        data,
        url: `${BASE_PATH}/popular`,
        showLoading: true,
    })
}
/**
 * 
 */
export function reportUser(data = {}) {
    return request({
        method: 'POST',
        data,
        url: `${BASE_PATH}/report`,
        showLoading: true,
    })
}

/**
 * 
 */
export function updateAddress(data = {}) {
    return request({
        method: 'POST',
        data,
        url: `${BASE_PATH}/user/updateAddress`,
        showLoading: true,
    })
}

export function getInviteUsers(fid) {
    return request({
        method: 'GET',
        data: {},
        url: `${BASE_PATH}/inviteUsers/${fid}`
    })
}

// get album
export function getFiles({ userCode }) {
    return request({
        method: 'GET',
        data: {},
        url: `${BASE_PATH}/resources/getFiles/${userCode}`
    })
}
// add album ----> use uni.uplaod api
// export function uploadFiles(userCode) {
//     return request({
//         method: 'GET',
//         data: {},
//         url:`${BASE_PATH}/resources/uploadFiles/${userCode}`
//     })
// }
export function uploadUserFiles(data = {}) {
    console.log("🚀 ~ file: user.js:157 ~ uploadUserFiles ~ data:", data)
    const { userCode, files } = data
    return requestFormData({
        method: 'POST',
        url: `${BASE_PATH}/resources/uploadFiles/${userCode}`,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        files, // files <filePath>
    })
}
// modify album
export function modifyFiles(data) {
    let { userCode } = data
    return request({
        method: 'POST',
        data: data.data,
        url: `${BASE_PATH}/resources/modify/${userCode}`,
        showLoading: true,
    })
}
