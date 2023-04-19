<template>
  <view class="container" :fileList="fileList" :change:fileList="profile.uplaodingLileList" :prop="userInfo"
    :change:prop="profile.userInfoUpdate">
    <uni-nav-bar class="header-nav" :fixed="true" status-bar="true" :title="$t('my.myProfile')" background-color="#ffffff"
      @clickLeft="back">
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
      <block slot="right">
        <view class="right" @click="save">
          <image class="btn-save" src="/static/my/btn-small.png"> </image>
          <text>{{ $t("my.save") }}</text>
        </view>
      </block>
    </uni-nav-bar>
    <!-- <view class="top">
      <view class="avatar-box">
        <view class="user-name">{{ userInfo.userName }}</view>

        <view class="avatar-wrap">
          <image class="avatar" :src="file || avatarUrl" mode="aspectFill" />
          <image @click="choosePic" class="icon-edit" src="/static/my/icon-edit.png" />
        </view>
      </view>
    </view> -->
    <view class="info">

      <view class="info-item albums">
        <info-item-label :showArrow="false" :txt="$t('my.Albums')" />
        <view class="albums-list">
          <!-- upload -->
          <view class="albums-item" v-for="(item, index) in fileList" :key="index">
            <image class="close-btn" src="/static/my/icon-close-pink.png" mode="widthFix"
              @click="removeAlbum(item, index)">
            </image>
            <image class="img" :src="item.url" mode="aspectFit"> </image>
          </view>
          <view v-if="fileList.length < 6" class="albums-item" @click="chooseAlbumsPic">
            <image class="upload-btn" src="/static/my/icon-plus.png" mode="scaleToFill"> </image>
          </view>

        </view>
      </view>
      <view class="info-item bio">
        <info-item-label :showArrow="false" :txt="$t('my.bio')" />
        <!-- <textarea v-model="bio" :prop="bio" :change:prop="profile.bioUpdate" class="input"
          :placeholder="$t('my.bioTip')" /> -->
        <input v-model="bio" :prop="bio" :change:prop="profile.bioUpdate" class="input" :placeholder="$t('my.bioTip')" />
      </view>
      <view class="info-item name">
        <info-item-label :showArrow="false" :txt="$t('my.myName')" />
        <input v-model="userName" :prop="userName" :change:prop="profile.userNameUpdate" class="input" />
      </view>
      <view class="info-item gender" :prop="gender" :change:prop="profile.genderUpdate">
        <info-item-label :showArrow="false" :txt="$t('my.myGender')" :rightTxt="genderMap[gender].name" :showLeft="true"
          @click="showGender" />
        <gender-list v-if="showGenderList" :value="gender" @change="changeGender" />
      </view>
    </view>

    <!--  -->
    <!-- <w-popup-confirm ref="popup" :content="$t('my.saveModified') + '?'" :cancelText="$t('my.cancel')"
      :confirmText="$t('my.confirm')" @cancel="cancel" @confirm="profile.confirm" /> -->
    <uni-popup ref="popup" :mask-click="false" :is-mask-click="false" background-color="#fff"
      mask-background-color="rgba(0,0,0,0)" type="center">
      <view class="popup-content">
        <image class="dialog-bg" src="/static/login/dialog-bg.png" mode="">
          <text class="title">
            {{ $t("my.saveModified") }}
          </text>
          <view class="btns">
            <view class="btn btn-cancel" @click="cancel">
              {{ $t("my.cancel") }}
            </view>
            <view class="btn btn-confirm" @click="profile.confirm">
              {{ $t("my.confirm") }}
            </view>
          </view>
        </image>
      </view>
    </uni-popup>
  </view>
</template>
<script module="profile" lang="renderjs">
import config,{BASE_PATH} from '@/config/config';
// import { setUserInfo } from "@/config/auth";
// import { editUserInfo } from "@/api/user";
import axios from "axios"
let domainPath = config.domainPath;
	export default {
    data(){
      return {
        // userInfo:{}
        userName:null,
        gender:null,
        bio:null
      }
    },
		mounted() {
			// ...
      this.initData()
		},
		methods: {
      userInfoUpdate (newValue, oldValue, ownerInstance, instance) {
				//  service 
        console.log('renderjs:userInfoUpdate',newValue,oldValue)
        this.userInfo = newValue
			},
      userNameUpdate (newValue, oldValue, ownerInstance, instance) {
        console.log('renderjs:userNameUpdate',newValue,oldValue)
        this.userName = newValue
      },
      genderUpdate (newValue, oldValue, ownerInstance, instance) {
        console.log('renderjs:genderUpdate',newValue,oldValue)
        this.gender = newValue
      },
      changeGender(gender){
        console.log('renderjs:changeGender')
        this.gender = gender
      },
      bioUpdate (newValue, oldValue, ownerInstance, instance) {
        console.log('renderjs:bioUpdate',newValue,oldValue)
        this.bio = newValue
      },
      uplaodingLileList(newValue, oldValue, ownerInstance, instance) {
        console.log('renderjs:uplaodingUpdate',newValue,oldValue,this.files)
        this.fileList = newValue
      },
      async initData(){
      },
      confirm(event,ownerInstance) {
        if(this.fileList.length === 0){
          ownerInstance.callMethod('showRequireToast')
          return;
        }
          // console.log('renderjs:confirm',JSON.stringify(this.userInfo) )
        let userCode = this.userInfo.userCode
        let userName = this.userName
        let gender = this.gender
        let bio = this.bio
        console.log("gender", gender);
        let formData = new FormData();
        formData.append("userCode", userCode);
        formData.append("userName", userName);
        formData.append("gender", gender);
        formData.append("bio", bio);
        let url = domainPath + `${BASE_PATH}/user/modify`
          console.log('renderjs:formData',userCode,userName,gender,bio )
        axios.post(url, formData, {
          //
          headers: { 
            "Content-Type": "multipart/form-data",
            token: this.userInfo.token ,
            lang:this.lang
          }
        }).then(res=>{
          let response = res.data
          console.log(res)
          if (response.code === 200) {
            ownerInstance.callMethod('success', response)
          }else  if (response.code === 401) {
            ownerInstance.callMethod('back', response)
          }
        })
      }
    }
	}
</script>
<script>
import { setUserInfo,getToken } from "@/config/auth";
import { 
  editUserInfo,
  editUserPortrait,
  getFiles,
modifyFiles ,
uploadUserFiles
} from "@/api/user";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
let app = getApp();

export default {
  data() {
    return {
      userInfo: app.globalData.userInfo,
      avatarUrl: null,
      file: null,
      userName: null,
      gender:null,
      bio: null,
      token:getToken(),
      lang: uni.getStorageSync("lang"),
      genderList: [
        {
          name: this.$t("Boy"),
          value: 1,
        },
        {
          name: this.$t("Girl"),
          value: 2,
        },
        {
          name: this.$t("non-binary"),
          value: 3,
        },
        {
          name: this.$t("non-disclosure"),
          value: 0,
        },
      ],
      showGenderList: false,
      fileList: [],
      uplaoding:false,
      files:[]
    };
  },
  computed: {
    genderMap(){
      let map = {}
      for (let item of this.genderList) {
        map[item.value] = item
      }
      return map
    }
  },
  onLoad() {
    let { portrait, userName, gender, bio } = this.userInfo;
    this.avatarUrl = portrait === "default" ? null : portrait;
    this.userName = userName;
    this.gender = gender;
    this.bio = bio;
    // init albums
    this.getAlbums()

  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    showGender(){
      this.showGenderList = !this.showGenderList
    },
    changeGender(gender){
        console.log('changeGender')
        this.gender = gender
      },
    // confirm(){
    //   this.profile.confirm()
    // },
    choosePic() {
      uni.chooseImage({
        sizeType:['compressed'],
        count: 1,
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.file = tempFilePaths[0];
          let fileParam = {
                filePath: this.file,
              };
          editUserPortrait(
            {
              userCode: this.userInfo.userCode,
            },
            { ...fileParam }
          ).then((res) => {
            let userInfo = res.data || {};
            setUserInfo({...this.userInfo,...userInfo});
            if (WebIM.conn.isOpened()) {
              WebIM.conn.updateUserInfo({
                nickname: userInfo.userName,
                avatarurl: userInfo.portrait
              }); 
            }
            uni.showToast({
              title: this.$t("my.saveTip"),
              icon: "none",
              success() {
              },
            });
          });
        },
      });
    },
    save() {
      this.$refs.popup.open();
    },
    cancel() {
      uni.showToast({
        icon: "none",
        title: this.$t("my.cancel"),
        duration: 1000,
      });
      this.$refs.popup.close();
    },
    showRequireToast(){
      uni.showToast({
        title: this.$t("my.saveRequireTip"),
        icon: "none",
      });
    },
    success(response){
      if (WebIM.conn.isOpened()) {
        let userInfo = response.data || {};
        WebIM.conn.updateUserInfo({
          nickname: userInfo.userName,
          avatarurl: userInfo.portrait
        });
      }
      this.$refs.popup.close();
      uni.showToast({
        title: this.$t("my.saveTip"),
        icon: "none",
        success:()=> {
          setTimeout(()=>{
            this.back()
          },500)
        },
      });
    },
    getAlbums(){
      getFiles({
        userCode: this.userInfo.userCode,
      }).then(res=>{
        this.fileList = res.data||[]
        console.log("🚀 ~ file: profile.vue:328 ~ getAlbums ~ res.data:", res.data)
      })
    },
    removeAlbum(item,index){
      modifyFiles({
        userCode: this.userInfo.userCode,
        data:[{
          delFlag:'1',
          id:item.id,
          sort:item.sort
        }]
      }).then(res=>{
        this.fileList.splice(index,1)
        this.showSuccess()
        this.getAlbums()
      })
    },
     chooseAlbumsPic(){
      let count = 6 - this.fileList.length
      uni.chooseImage({
        sizeType:['compressed'],
        count,
        success: async(chooseImageRes) => {
          let files = chooseImageRes.tempFilePaths;
          this.files  =  files 
          // let tempFilePath = tempFilePaths[0];
          // uploadUserFiles({
          //   userCode: this.userInfo.userCode,
          //   files:files.map(item=>{
          //     return {
          //       name:'files',
          //       uri:item
          //     }
          //   })
          // }).then(res=>{
          //   this.showSuccess()
          //   this.getAlbums()
          // })
          // this.uplaoding = true
          uni.showLoading({ mask: true })
          for (const item of files) {
              try {
                uni.showLoading({ mask: true })
                await uploadUserFiles({
                  userCode: this.userInfo.userCode,
                  files:[{
                    name:'files',
                    uri:item
                  }]
                })
              } catch (error) {
                console.log("🚀 ~ file: profile.vue:380 ~ chooseAlbumsPic ~ error:", error)
              }
            }
            uni.hideLoading()

            this.showSuccess()
            this.getAlbums()
            // this.uplaoding = true
        },
      });
    },
    showSuccess(){
      uni.showToast({
        icon: "none",
        title: this.$t("common.success"),
        duration: 1000,
      });
    }
    
  },
};
</script>

<style lang="scss" scoped>
$color: #d7ceff;

.header-nav {
  // .back-icon{

  // }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .btn-save {
      width: 141rpx;
      height: 49rpx;
      position: relative;
      z-index: 2;
    }

    text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 9;
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.container {
  padding: 0 52rpx 100rpx;
  font-family: IPix;

  .top {
    height: 415rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar-box {
      margin-bottom: 90rpx;

      .avatar-wrap {
        width: 224rpx;
        height: 224rpx;
        border-radius: 100%;
        background: #d7ceff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        .avatar {
          width: 206rpx;
          height: 206rpx;
          border-radius: 100%;
          background: gray;
        }

        .icon-edit {
          position: absolute;
          bottom: 10rpx;
          right: 10rpx;
          width: 54rpx;
          height: 53rpx;
          z-index: 2;
        }
      }

      .user-name {
        margin: 40rpx 0 16rpx;
        text-align: center;
        font-weight: bold;
      }
    }
  }

  .info {
    .info-item {
      .input {
        box-sizing: border-box;
        background: #f1eeff;
        border-radius: 7px;
        line-height: 31rpx;

        font-size: 26rpx;
        color: #0e0e0e;
      }

      &.name {
        .input {
          padding: 27rpx;
          background: url('/static/my/icon-border.png') no-repeat;
          background-size: 645rpx 91rpx;
          width: 645rpx;
          height: 91rpx;
        }
      }

      &.bio {
        .input {
          padding: 27rpx;
          background: url('/static/my/icon-border.png') no-repeat;
          background-size: 645rpx 91rpx;
          width: 645rpx;
          height: 91rpx;

          // padding: 27rpx;
          // height: 260rpx;
          // width: 638rpx;
        }
      }

      &.albums {
        .albums-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;

          .albums-item {
            margin: 17rpx 17rpx 0 0;
            width: 200rpx;
            height: 272rpx;
            border-radius: 27rpx;
            background: #E5DCF3;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            &:nth-of-type(3),  &:nth-of-type(6) {
              margin-right: 0;
            }

            image.upload-btn {
              width: 52rpx;
              height: 52rpx;
            }

            image.close-btn {
              width: 54rpx;
              height: 54rpx;
              position: absolute;
              top: -20rpx;
              right: -20rpx;
              z-index: 2;
            }
            .img{
              width: 200rpx;
              height: 272rpx;
              position: relative;
              z-index: 1;
            }
          }
        }
      }
    }
  }
}

// 
.popup-content {
  position: relative;

  .dialog-bg {
    width: 560rpx;
    height: 384rpx;
    position: relative;
  }

  .title {
    font-size: 36rpx;
    color: #000000;
    line-height: 51rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100%);
  }

  .btns {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 560rpx;
    display: flex;

    .btn {
      flex: 1;
      text-align: center;
      line-height: 124rpx;
      font-size: 33rpx;

      &.btn-cancel {
        color: #d841ff;
      }

      &.btn-confirm {
        color: #fff;
      }
    }
  }
}
</style>
