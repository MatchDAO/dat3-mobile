<template>
	<view>
		<page-head title="form"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<view class="title"></view>
					<input class="uni-input" name="nickname" placeholder="" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title"></view>
					<radio-group name="gender">
						<label>
							<radio value="" /><text></text>
						</label>
						<label>
							<radio value="" /><text></text>
						</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title"></view>
					<checkbox-group name="loves">
						<label>
							<checkbox value="" /><text></text>
						</label>
						<label>
							<checkbox value="" /><text></text>
						</label>
					</checkbox-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title"></view>
					<slider value="20" name="age" show-value></slider>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title"></view>
					<view>
						<switch name="switch" />
					</view>
				</view>
				<view class="uni-btn-v">
					<button form-type="submit">Submit</button>
					<button type="default" form-type="reset">Reset</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	var  graceChecker = require("../../../common/graceChecker.js");
	export default {
		data() {
			return {
			}
		},
		methods: {
			formSubmit: function(e) {
				console.log('formsubmit' + JSON.stringify(e.detail.value))
                //
                var rule = [
                    {name:"nickname", checkType : "string", checkRule:"1,3",  errorMsg:"1-3"},
                    {name:"gender", checkType : "in", checkRule:",",  errorMsg:""},
                    {name:"loves", checkType : "notnull", checkRule:"",  errorMsg:""}
                ];
                //
                var formData = e.detail.value;
                var checkRes = graceChecker.check(formData, rule);
                if(checkRes){
                    uni.showToast({title:"!", icon:"none"});
                }else{
                    uni.showToast({ title: graceChecker.error, icon: "none" });
                }
			},
			formReset: function(e) {
				console.log('')
			}
		}
	}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>
