<template>
	<view class="uni-file-picker">
		<view v-if="title" class="uni-file-picker__header">
			<text class="file-title">{{ title }}</text>
			<text class="file-count">{{ filesList.length }}/{{ limitLength }}</text>
		</view>
		<upload-image v-if="fileMediatype === 'image' && showType === 'grid'" :readonly="readonly" :image-styles="imageStyles" :files-list="filesList" :limit="limitLength" :disablePreview="disablePreview" :delIcon="delIcon" @uploadFiles="uploadFiles" @choose="choose" @delFile="delFile">
			<slot>
				<view class="is-add">
					<view class="icon-add"></view>
					<view class="icon-add rotate"></view>
				</view>
			</slot>
		</upload-image>
		<upload-file v-if="fileMediatype !== 'image' || showType !== 'grid'" :readonly="readonly" :list-styles="listStyles" :files-list="filesList" :showType="showType" :delIcon="delIcon" @uploadFiles="uploadFiles" @choose="choose" @delFile="delFile">
			<slot><button type="primary" size="mini"></button></slot>
		</upload-file>
	</view>
</template>

<script>
	/**
	 * FilePicker
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=-1
	 * @property {Object|Array}	value	 ,return-type
	 * @property {Boolean}	disabled=[true|false]	
	 * 	@value true 	
	 * 	@value false 	
	 * @property {Boolean}	readonly=[true|false]	
	 * 	@value true 	
	 * 	@value false 	
	 * @property {String}	return-type=[array|object]	 value  object  
	 * 	@value array	 value 
	 * 	@value object	 value 
	 * @property {Boolean}	disable-preview=[true|false]	 mode:grid 
	 * 	@value true 	
	 * 	@value false 	
	 * @property {Boolean}	del-icon=[true|false]	
	 * 	@value true 	
	 * 	@value false 	
	 * @property {Boolean}	auto-upload=[true|false]	true@select,
	 * 	@value true 	
	 * 	@value false 	
	 * @property {Number|String}	limit	 h5 
	 * @property {String}	title	
	 * @property {String}	mode=[list|grid]	
	 * 	@value list 	
	 * 	@value grid 	
	 * @property {String}	file-mediatype=[image|video|all]	
	 * 	@value image	
	 * 	@value video	
	 * 	@value all		
	 * @property {Array}	file-extname	 file-mediatype 
	 * @property {Object}	list-style	mode:list 
	 * @property {Object}	image-styles	 file-mediatype 
	 * @event {Function} select 	
	 * @event {Function} progress 
	 * @event {Function} success 	
	 * @event {Function} fail 		
	 * @event {Function} delete 	
	 */

	import {
		chooseAndUploadFile
	} from './choose-and-upload-file.js'
	import uploadImage from './upload-image.vue'
	import uploadFile from './upload-file.vue'
	let fileInput = null
	export default {
		name: 'uniFilePicker',
		components: {
			uploadImage,
			uploadFile
		},
		props: {
			value: {
				type: [Array, Object],
				default () {
					return []
				}
			},
			disabled: {
				type: Boolean,
				default: false
			},
			disablePreview: {
				type: Boolean,
				default: false
			},
			delIcon: {
				type: Boolean,
				default: true
			},
			// 
			autoUpload: {
				type: Boolean,
				default: true
			},
			//  h5
			limit: {
				type: [Number, String],
				default: 9
			},
			//  grid | list | list-card
			mode: {
				type: String,
				default: 'grid'
			},
			// inputUrl: {
			// 	type: Boolean,
			// 	default: false
			// },
			//   image/video/all
			fileMediatype: {
				type: String,
				default: 'image'
			},
			// 
			fileExtname: {
				type: [Array, String],
				default () {
					return []
				}
			},
			title: {
				type: String,
				default: ''
			},
			listStyles: {
				type: Object,
				default () {
					return {
						// 
						border: true,
						// 
						dividline: true,
						// 
						borderStyle: {}
					}
				}
			},
			imageStyles: {
				type: Object,
				default () {
					return {
						width: 'auto',
						height: 'auto'
					}
				}
			},
			readonly: {
				type: Boolean,
				default: false
			},
			returnType: {
				type: String,
				default: 'array'
			}
		},
		watch: {
			value: {
				handler(newVal) {
					let newFils = []
					let newData = [].concat(newVal || [])
					newData.forEach(v => {
						const files = this.files.find(i => i.url === v.url)
						const reg = /cloud:\/\/([\w.]+\/?)\S*/
						if (!v.path) {
							v.path = v.url
						}
						if (reg.test(v.url)) {
							this.getTempFileURL(v, v.url)
						}
						newFils.push(files ? files : v)
					})
					this.files = newFils
				},
				immediate: true
			}
		},
		data() {
			return {
				files: [],
			}
		},
		computed: {
			filesList() {
				let files = []
				this.files.forEach(v => {
					files.push(v)
				})
				return files
			},
			showType() {
				if (this.fileMediatype === 'image') {
					return this.mode
				}
				return 'list'
			},
			limitLength() {
				if (this.returnType === 'object') {
					return 1
				}
				if (!this.limit) {
					return 1
				}
				if (this.limit >= 9) {
					return 9
				}
				return this.limit
			},
			extname() {
				if (!Array.isArray(this.fileExtname)) {
					let extname = this.fileExtname.replace(/(\[|\])/g, '')
					return extname.split(',')
				} else {
					return this.fileExtname
				}
				return []
			}
		},
		created() {
			// this.files = Object.assign([], this.value)
			this.tempData = {}

		},
		methods: {
			/**
			 * 
			 */
			upload() {
				// TODO  
				// if (this.$uploadFiles) {
				// 	this.$uploadFiles()
				// } else {
				// 	uni.showToast({
				// 		title: '',
				// 		icon: 'none'
				// 	})
				// }
				let files = []
				this.files.forEach((v, index) => {
					if (v.status === 'ready' || v.status === 'error') {
						files.push(Object.assign({}, v))
					}
				})

				this.uploadFiles(files)
			},
			/**
			 * 
			 */
			choose() {
				if (this.disabled) return
				if (this.files.length >= Number(this.limitLength) && this.showType !== 'grid' && this.returnType === 'array') {
					uni.showToast({
						title: ` ${this.limitLength} `,
						icon: 'none'
					})
					return
				}
				// uni.showActionSheet({
				// 	itemList: [' url ', ''],
				// 	success: (res) => {
				// 		if (res.tapIndex === 1) {
				// 			this.chooseFiles()
				// 		}
				// 	},
				// 	fail: function(res) {}
				// });
				this.chooseFiles()
			},

			/**
			 * 
			 */
			chooseFiles() {
				// API API
				if (!uniCloud.chooseAndUploadFile) {
					uniCloud.chooseAndUploadFile = chooseAndUploadFile
				}

				uniCloud
					.chooseAndUploadFile({
						type: this.fileMediatype,
						compressed: false,
						// TODO video 
						extension: this.extname.length > 0 ? this.extname : undefined,
						count: this.limitLength - this.files.length, //9
						onChooseFile: async res => {
							if ((Number(this.limitLength) === 1 && this.disablePreview && !this.disabled) || this.returnType === 'object') {
								this.files = []
							}
							let filePaths = []
							let files = []
							if (this.extname && this.extname.length > 0) {
								res.tempFiles.forEach(v => {
									let fileFullName = this.getFileExt(v.name)
									const extname = fileFullName.ext.toLowerCase()
									if (this.extname.indexOf(extname) !== -1) {
										files.push(v)
										filePaths.push(v.path)
									}
								})
								if (files.length !== res.tempFiles.length) {
									uni.showToast({
										title: `${res.tempFiles.length} ${res.tempFiles.length - files.length} `,
										icon: 'none',
										duration: 5000
									})
								}
							} else {
								filePaths = res.tempFilePaths
								files = res.tempFiles
							}

							let currentData = []
							for (let i = 0; i < files.length; i++) {
								if (this.limitLength - this.files.length <= 0) break
								files[i].uuid = Date.now()
								let filedata = await this.getFileData(files[i], this.fileMediatype)
								filedata.progress = 0
								filedata.status = 'ready'
								this.files.push(filedata)
								currentData.push(filedata)
							}
							this.$emit('select', {
								tempFiles: currentData,
								tempFilePaths: filePaths
							})
							res.tempFiles = files
							// 
							if (!this.autoUpload) {
								res.tempFiles = []
								// TODO  
								// return new Promise((resolve) => {
								// 	this.$uploadFiles = () => {
								// 		// this._is_uploading = true
								// 		resolve(res)
								// 	}
								// })
							}
						},
						onUploadProgress: progressEvent => {
							this.setProgress(progressEvent, progressEvent.index)
						}
					})
					.then(result => {
						this.setSuccessAndError(result.tempFiles)
					})
					.catch(err => {
						console.log('', err)
					})
			},

			/**
			 * 
			 * @param {Object} e
			 */
			uploadFiles(files) {
				files = [].concat(files)
				this.uploadCloudFiles(files, 5, res => {
						this.setProgress(res, res.index, true)
					})
					.then(result => {
						this.setSuccessAndError(result)
					})
					.catch(err => {
						console.log('err', err)
					})
			},

			/**
			 * 
			 */
			async setSuccessAndError(res, fn) {
				let successData = []
				let errorData = []
				let tempFilePath = []
				let errorTempFilePath = []
				for (let i = 0; i < res.length; i++) {
					// const index  = item.index
					const item = res[i]
					const index = item.uuid ? this.files.findIndex(p => p.uuid === item.uuid) : item.index
					if (index === -1 || !this.files) break
					if (item.errMsg === 'request:fail') {
						this.files[index].url = item.path
						this.files[index].status = 'error'
						this.files[index].errMsg = item.errMsg
						this.files[index].progress = -1
						errorData.push(this.files[index])
						errorTempFilePath.push(this.files[index].url)
					} else {
						this.files[index].errMsg = ''
						this.files[index].url = item.url
						this.files[index].status = 'success'
						successData.push(this.files[index])
						tempFilePath.push(this.files[index].url)
					}
				}

				if (successData.length > 0) {
					this.setEmit()
					// 
					this.$emit('success', {
						tempFiles: this.backObject(successData),
						tempFilePaths: tempFilePath
					})
				}

				if (errorData.length > 0) {
					this.$emit('fail', {
						tempFiles: this.backObject(errorData),
						tempFilePaths: errorTempFilePath
					})
				}
			},

			/**
			 * 
			 * @param {Object} progressEvent
			 * @param {Object} index
			 * @param {Object} type
			 */
			setProgress(progressEvent, index, type) {
				const fileLenth = this.files.length
				const percentNum = (index / fileLenth) * 100
				const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
				let idx = index
				if (!type) {
					idx = this.files.findIndex(p => p.uuid === progressEvent.tempFile.uuid)
				}
				if (idx === -1 || !this.files[idx]) return
				this.files[idx].progress = percentCompleted
				// 
				this.$emit('progress', {
					index: idx,
					progress: parseInt(percentCompleted),
					tempFile: this.files[idx]
				})
			},

			/**
			 * 
			 * @param {Object} index
			 */
			delFile(index) {
				this.$emit('delete', {
					tempFile: this.files[index],
					tempFilePath: this.files[index].url
				})
				this.files.splice(index, 1)
			},

			/**
			 * 
			 * @param {Object} name
			 */
			getFileExt(name) {
				const last_len = name.lastIndexOf('.')
				const len = name.length
				return {
					name: name.substring(0, last_len),
					ext: name.substring(last_len + 1, len)
				}
			},

			/**
			 * 
			 * @param {Object} filepath
			 */
			getFileInfo(filepath) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: filepath,
						success(res) {
							resolve(res)
						},
						fail(err) {
							reject(err)
						}
					})
				})
			},

			/**
			 * 
			 */
			async getFileData(files, type = 'image') {
				// 
				let fileFullName = this.getFileExt(files.name)
				const extname = fileFullName.ext.toLowerCase()
				let filedata = {
					name: files.name,
					uuid: files.uuid,
					extname: extname || '',
					cloudPath: files.cloudPath,
					fileType: files.fileType,
					url: files.path || files.path,
					size: files.size, //
					image: {},
					path: files.path,
					video: {}
				}
				if (type === 'image') {
					const imageinfo = await this.getFileInfo(files.path)
					filedata.image.width = imageinfo.width
					filedata.image.height = imageinfo.height
					filedata.image.location = imageinfo.path
				}
				return filedata
			},

			/**
			 * 
			 */
			uploadCloudFiles(files, max = 5, onUploadProgress) {
				files = JSON.parse(JSON.stringify(files))
				const len = files.length
				let count = 0
				let self = this
				return new Promise(resolve => {
					while (count < max) {
						next()
					}

					function next() {
						let cur = count++
						if (cur >= len) {
							!files.find(item => !item.url && !item.errMsg) && resolve(files)
							return
						}
						const fileItem = files[cur]
						const index = self.files.findIndex(v => v.uuid === fileItem.uuid)
						fileItem.url = ''
						delete fileItem.errMsg

						uniCloud
							.uploadFile({
								filePath: fileItem.path,
								cloudPath: fileItem.cloudPath,
								fileType: fileItem.fileType,
								onUploadProgress: res => {
									res.index = index
									onUploadProgress && onUploadProgress(res)
								}
							})
							.then(res => {
								fileItem.url = res.fileID
								fileItem.index = index
								if (cur < len) {
									next()
								}
							})
							.catch(res => {
								fileItem.errMsg = res.errMsg || res.message
								fileItem.index = index
								if (cur < len) {
									next()
								}
							})
					}
				})
			},
			setEmit() {
				let data = []
				if (this.returnType === 'object') {
					data = this.backObject(this.files)[0]
				} else {
					data = this.backObject(this.files)
				}
				this.$emit('input', data)
			},
			backObject(files) {
				let newFilesData = JSON.parse(JSON.stringify(files))
				newFilesData.map(v => {
					delete v.path
					delete v.uuid
					delete v.video
					delete v.progress
					delete v.errMsg
					delete v.status
					delete v.cloudPath
					return v
				})
				return newFilesData
			},
			async getTempFileURL(file, fileList) {
				fileList = {
					fileList: [].concat(fileList)
				}
				const urls = await uniCloud.getTempFileURL(fileList)
				file.path = urls.fileList[0].tempFileURL || ''
				const index = this.files.findIndex(v => v.path === file.path)
				if (index !== -1) {
					this.$set(this.files, index, file)
				}
			}
		}
	}
</script>

<style scoped>
	.uni-file-picker {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
	}

	.uni-file-picker__header {
		padding-top: 5px;
		padding-bottom: 10px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
	}

	.file-title {
		font-size: 14px;
		color: #333;
	}

	.file-count {
		font-size: 14px;
		color: #999;
	}

	.is-add {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.icon-add {
		width: 50px;
		height: 5px;
		background-color: #f1f1f1;
		border-radius: 2px;
	}

	.rotate {
		position: absolute;
		transform: rotate(90deg);
	}
</style>