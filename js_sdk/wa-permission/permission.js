/**
 * AndroidiOS
 */

var isIos
// #ifdef APP-PLUS
isIos = (plus.os.name == "iOS")
// #endif

// 
function judgeIosPermissionPush() {
	var result = false;
	var UIApplication = plus.ios.import("UIApplication");
	var app = UIApplication.sharedApplication();
	var enabledTypes = 0;
	if (app.currentUserNotificationSettings) {
		var settings = app.currentUserNotificationSettings();
		enabledTypes = settings.plusGetAttribute("types");
		console.log("enabledTypes1:" + enabledTypes);
		if (enabledTypes == 0) {
			console.log("");
		} else {
			result = true;
			console.log("!")
		}
		plus.ios.deleteObject(settings);
	} else {
		enabledTypes = app.enabledRemoteNotificationTypes();
		if (enabledTypes == 0) {
			console.log("!");
		} else {
			result = true;
			console.log("!")
		}
		console.log("enabledTypes2:" + enabledTypes);
	}
	plus.ios.deleteObject(app);
	plus.ios.deleteObject(UIApplication);
	return result;
}

// 
function judgeIosPermissionLocation() {
	var result = false;
	var cllocationManger = plus.ios.import("CLLocationManager");
	var status = cllocationManger.authorizationStatus();
	result = (status != 2)
	console.log("" + result);
	//  checkSystemEnableLocation
	/* var enable = cllocationManger.locationServicesEnabled();
	var status = cllocationManger.authorizationStatus();
	console.log("enable:" + enable);
	console.log("status:" + status);
	if (enable && status != 2) {
		result = true;
		console.log("");
	} else {
		console.log("");
	} */
	plus.ios.deleteObject(cllocationManger);
	return result;
}

// 
function judgeIosPermissionRecord() {
	var result = false;
	var avaudiosession = plus.ios.import("AVAudioSession");
	var avaudio = avaudiosession.sharedInstance();
	var permissionStatus = avaudio.recordPermission();
	console.log("permissionStatus:" + permissionStatus);
	if (permissionStatus == 1684369017 || permissionStatus == 1970168948) {
		console.log("");
	} else {
		result = true;
		console.log("");
	}
	plus.ios.deleteObject(avaudiosession);
	return result;
}

// 
function judgeIosPermissionCamera() {
	var result = false;
	var AVCaptureDevice = plus.ios.import("AVCaptureDevice");
	var authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
	console.log("authStatus:" + authStatus);
	if (authStatus == 3) {
		result = true;
		console.log("");
	} else {
		console.log("");
	}
	plus.ios.deleteObject(AVCaptureDevice);
	return result;
}

// 
function judgeIosPermissionPhotoLibrary() {
	var result = false;
	var PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
	var authStatus = PHPhotoLibrary.authorizationStatus();
	console.log("authStatus:" + authStatus);
	if (authStatus == 3) {
		result = true;
		console.log("");
	} else {
		console.log("");
	}
	plus.ios.deleteObject(PHPhotoLibrary);
	return result;
}

// 
function judgeIosPermissionContact() {
	var result = false;
	var CNContactStore = plus.ios.import("CNContactStore");
	var cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
	if (cnAuthStatus == 3) {
		result = true;
		console.log("");
	} else {
		console.log("");
	}
	plus.ios.deleteObject(CNContactStore);
	return result;
}

// 
function judgeIosPermissionCalendar() {
	var result = false;
	var EKEventStore = plus.ios.import("EKEventStore");
	var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
	if (ekAuthStatus == 3) {
		result = true;
		console.log("");
	} else {
		console.log("");
	}
	plus.ios.deleteObject(EKEventStore);
	return result;
}

// 
function judgeIosPermissionMemo() {
	var result = false;
	var EKEventStore = plus.ios.import("EKEventStore");
	var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
	if (ekAuthStatus == 3) {
		result = true;
		console.log("");
	} else {
		console.log("");
	}
	plus.ios.deleteObject(EKEventStore);
	return result;
}

// Android
function requestAndroidPermission(permissionID) {
	return new Promise((resolve, reject) => {
		plus.android.requestPermissions(
			[permissionID], // 
			function(resultObj) {
				var result = 0;
				for (var i = 0; i < resultObj.granted.length; i++) {
					var grantedPermission = resultObj.granted[i];
					console.log('' + grantedPermission);
					result = 1
				}
				for (var i = 0; i < resultObj.deniedPresent.length; i++) {
					var deniedPresentPermission = resultObj.deniedPresent[i];
					console.log('' + deniedPresentPermission);
					result = 0
				}
				for (var i = 0; i < resultObj.deniedAlways.length; i++) {
					var deniedAlwaysPermission = resultObj.deniedAlways[i];
					console.log('' + deniedAlwaysPermission);
					result = -1
				}
				resolve(result);
				// ,APP,APP
				// if (result != 1) {
				// gotoAppPermissionSetting()
				// }
			},
			function(error) {
				console.log('' + error.code + " = " + error.message);
				resolve({
					code: error.code,
					message: error.message
				});
			}
		);
	});
}

// 
function judgeIosPermission(permissionID) {
	if (permissionID == "location") {
		return judgeIosPermissionLocation()
	} else if (permissionID == "camera") {
		return judgeIosPermissionCamera()
	} else if (permissionID == "photoLibrary") {
		return judgeIosPermissionPhotoLibrary()
	} else if (permissionID == "record") {
		return judgeIosPermissionRecord()
	} else if (permissionID == "push") {
		return judgeIosPermissionPush()
	} else if (permissionID == "contact") {
		return judgeIosPermissionContact()
	} else if (permissionID == "calendar") {
		return judgeIosPermissionCalendar()
	} else if (permissionID == "memo") {
		return judgeIosPermissionMemo()
	}
	return false;
}

// ****
function gotoAppPermissionSetting() {
	if (isIos) {
		var UIApplication = plus.ios.import("UIApplication");
		var application2 = UIApplication.sharedApplication();
		var NSURL2 = plus.ios.import("NSURL");
		// var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");		
		var setting2 = NSURL2.URLWithString("app-settings:");
		application2.openURL(setting2);

		plus.ios.deleteObject(setting2);
		plus.ios.deleteObject(NSURL2);
		plus.ios.deleteObject(application2);
	} else {
		// console.log(plus.device.vendor);
		var Intent = plus.android.importClass("android.content.Intent");
		var Settings = plus.android.importClass("android.provider.Settings");
		var Uri = plus.android.importClass("android.net.Uri");
		var mainActivity = plus.android.runtimeMainActivity();
		var intent = new Intent();
		intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
		var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
		intent.setData(uri);
		mainActivity.startActivity(intent);
	}
}

// 
// var checkSystemEnableLocation = async function () {
function checkSystemEnableLocation() {
	if (isIos) {
		var result = false;
		var cllocationManger = plus.ios.import("CLLocationManager");
		var result = cllocationManger.locationServicesEnabled();
		console.log(":" + result);
		plus.ios.deleteObject(cllocationManger);
		return result;
	} else {
		var context = plus.android.importClass("android.content.Context");
		var locationManager = plus.android.importClass("android.location.LocationManager");
		var main = plus.android.runtimeMainActivity();
		var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
		var result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
		console.log(":" + result);
		return result
	}
}

module.exports = {
	judgeIosPermission: judgeIosPermission,
	requestAndroidPermission: requestAndroidPermission,
	checkSystemEnableLocation: checkSystemEnableLocation,
	gotoAppPermissionSetting: gotoAppPermissionSetting
}
