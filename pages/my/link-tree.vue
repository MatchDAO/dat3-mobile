<!--
 * @Descripttion: 
 * @version: 
 * @Author: senlin
 * @Date: 2023-04-08 14:32:49
 * @LastEditors: senlin
 * @LastEditTime: 2023-04-10 14:23:17
-->
<template>
    <view class="container">
        <uni-nav-bar class="header-nav" :fixed="true" status-bar="true" @clickLeft="back">
            <block slot="left">
                <view class="left">
                    <image class="back-icon" src="/static/icon-back.png"></image>
                </view>
            </block>
        </uni-nav-bar>
        <view class="list">
            <view class="item" @click="goLink(1)">
                <image class="item-left" src="/static/my/icon-twitter.png" mode="widthFix" lazy-load="false" binderror=""
                    bindload="">
                </image>
                <text class="" selectable="false" space="false" decode="false">
                    {{ $t('my.Twitter') }}
                </text>
            </view>
            <view class="item" @click="goLink(2)">
                <image class="item-left" src="/static/my/icon-discord.png" mode="widthFix" lazy-load="false" binderror=""
                    bindload="">
                </image>
                <text class="" selectable="false" space="false" decode="false">
                    {{ $t('my.Discord') }}
                </text>
            </view>
            <view class="item">
                <image class="item-left" src="/static/my/icon-gmail.png" mode="widthFix" lazy-load="false" binderror=""
                    bindload="">
                </image>
                <text class="" selectable="false" space="false" decode="false">
                    <a :href="`mailto:${gmail}`">{{gmail}}</a>
                </text>
            </view>

        </view>
    </view>
</template>
<script>
import { getAppVerify } from '@/api/user';
import config from "@/config/config.js";
const { twitterUrl, discordUrl,gmail } = config;
export default {
    data() {
        return {
            twitterUrl, discordUrl ,gmail
        }
    },
    onLoad() {
        this.initData()
    },
    methods: {
        back() {
            uni.navigateBack({
                delta: 1,
            });
        },
        initData(){
            getAppVerify().then(res => {
                const { twitterUrl, discordUrl ,email:gmail} = res.data || {};
                this.twitterUrl = twitterUrl 
                this.discordUrl = discordUrl 
                this.gmail = gmail 
            })
        },
        goLink(type) {
            let url = null;
            // twitter
            if (type === 1) {
                url = this.twitterUrl;
            }
            // discord
            if (type === 2) {
                url = this.discordUrl;
            }
            // #ifdef APP-PLUS
            plus.runtime.openURL(url);
            // #endif
            // #ifdef H5
            window.open(url);
            // #endif
        }
    }
}
</script>
<style scoped lang="scss">
.list {
    padding-top: 50rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .item {
        margin-bottom: 40rpx;
        display: flex;
        align-items: center;
        background: url('/static/my/icon-border.png') no-repeat;
        background-size: 684rpx 106rpx;
        width: 684rpx;
        height: 106rpx;

        .item-left {
            margin-left: 48rpx;
            width: 38rpx;
        }
        text{
            margin-left: 48rpx;
            font-family: 'IPix';
            font-style: normal;
            font-weight: 400;
            font-size: 24rpx;
            line-height: 44rpx;
        }
    }
}
</style>