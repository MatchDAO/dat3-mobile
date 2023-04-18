<template>
    <view>
        <page-head :title="title"></page-head>
        <view class="uni-padding-wrap uni-common-mt">
            <button type="primary"> Normal</button>
            <button type="primary" :loading="loading"> Loading</button>
            <button type="primary" disabled="true"> Disabled</button>

            <button type="default"> Normal</button>
            <button type="default" disabled="true"> Disabled</button>

            <button type="warn"> Normal</button>
            <button type="warn" disabled="true"> Disabled</button>

            <view class="button-sp-area">
                <button type="primary" plain="true"></button>
                <button type="primary" disabled="true" plain="true"></button>

                <button type="default" plain="true"></button>
                <button type="default" disabled="true" plain="true"></button>

                <button class="mini-btn" type="primary" size="mini"></button>
                <button class="mini-btn" type="default" size="mini"></button>
                <button class="mini-btn" type="warn" size="mini"></button>
            </view>
            <!-- #ifdef MP-WEIXIN || MP-QQ -->
            <button open-type="launchApp" app-parameter="uni-app" @error="openTypeError">APP</button>
            <button open-type="feedback"></button>
            <!-- #endif -->
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                title: 'button',
                loading: false
            }
        },
        onLoad() {
            this._timer = null;
        },
        onShow() {
            this.clearTimer();
            this._timer = setTimeout(() => {
                this.loading = true;
            }, 300)
        },
        onUnload() {
            this.clearTimer();
            this.loading = false;
        },
        methods: {
            openTypeError(error) {
                console.error('open-type error:', error);
            },
            clearTimer() {
                if (this._timer != null) {
                    clearTimeout(this._timer);
                }
            }
        }
    }
</script>

<style>
    button {
        margin-top: 30rpx;
        margin-bottom: 30rpx;
    }

    .button-sp-area {
        margin: 0 auto;
        width: 60%;
    }

    .mini-btn {
        margin-right: 10rpx;
    }
</style>
