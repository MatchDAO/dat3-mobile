/**
 * @desc 
 * @param func 
 * @param wait 
 * @param immediate true -  false - 
 */
export const debounce = function(func, wait = 1000, immediate = true) {
	let timer;
	console.log(1);
	return function() {
		console.log(123);
		let context = this,
			args = arguments;
		if (timer) clearTimeout(timer);
		if (immediate) {
			let callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait);
			if (callNow) func.apply(context, args);
		} else {
			timer = setTimeout(() => {
				func.apply(context, args);
			}, wait)
		}
	}
}
/**
 * @desc 
 * @param func 
 * @param wait 
 * @param type 1  2 
 */
export const throttle = (func, wait = 1000, type = 1) => {
	let previous = 0;
	let timeout;
	return function() {
		let context = this;
		let args = arguments;
		if (type === 1) {
			let now = Date.now();

			if (now - previous > wait) {
				func.apply(context, args);
				previous = now;
			}
		} else if (type === 2) {
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = null;
					func.apply(context, args)
				}, wait)
			}
		}
	}
}
