<template>
    <view>
        <page-head :title="title"></page-head>
        <view class="ad-view">
            <ad adpid="1111111111" :unit-id="unitId" type="feed" @load="adload" @error="aderror"></ad>
            <!-- #ifdef APP-PLUS -->
            <view class="ad-tips" v-if="!isLoad">
                <text>{{adMessage}}</text>
            </view>
            <!-- #endif -->
            <!-- #ifndef APP-PLUS -->
            <view class="ad-tips">
                <text>ID</text>
            </view>
            <!-- #endif -->
        </view>
        <view class="tips">
            <text class="tips-text">ad</text><text class="tips-hl" @click="gotoapi">API</text><text class="tips-text"></text>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                title: 'AD',
                unitId: '',
                isLoad: false,
                adMessage: "..."
            }
        },
        onLoad() {
            // #ifdef MP-WEIXIN
            this.unitId = '';
            // #endif
            // #ifdef MP-TOUTIAO
            this.unitId = ''
            // #endif
            // #ifdef MP-QQ
            this.unitId = ''
            // #endif
        },
        methods: {
            adload() {
                this.isLoad = true;
            },
            aderror(e) {
                this.adMessage = e.detail.errMsg;
            },
            gotoapi() {
                uni.navigateTo({
                    url: "/pages/API/rewarded-video-ad/rewarded-video-ad"
                })
            }
        }
    }
</script>

<style>
    .content {
        background-color: #DBDBDB;
        padding: 10px;
    }

    .ad-view {
        background-color: #FFFFFF;
        margin-bottom: 10px;
    }

    .ad-tips {
        color: #999;
        padding: 30px 0;
        text-align: center;
    }

    .tips {
        margin-top: 30px;
        text-align: center;
        line-height: 42px;
    }

    .tips-text {
        color: #444;
    }

    .tips-hl {
        color: #007AFF;
        margin-left: 1px;
    }
</style>
