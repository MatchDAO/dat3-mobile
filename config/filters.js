const tofixed8 = val => {
	const e = String(val)
	let rex =/^[0-9]+\.[0-9]{9,}$/ // 9
	if(rex.test(e)){
		return Math.floor(parseInt(val*1000000000))/1000000000
	}else{
		// 8
		return val
	}
}
// yyyy-MM-dd hh:mm:ss.SSS 
function pad(str, length = 2) {
	str += ''
	while (str.length < length) {
		str = '0' + str
	}
	return str.slice(-length)
}

const parser = {
	yyyy: (dateObj) => {
		return pad(dateObj.year, 4)
	},
	yy: (dateObj) => {
		return pad(dateObj.year)
	},
	MM: (dateObj) => {
		return pad(dateObj.month)
	},
	M: (dateObj) => {
		return dateObj.month
	},
	dd: (dateObj) => {
		return pad(dateObj.day)
	},
	d: (dateObj) => {
		return dateObj.day
	},
	hh: (dateObj) => {
		return pad(dateObj.hour)
	},
	h: (dateObj) => {
		return dateObj.hour
	},
	mm: (dateObj) => {
		return pad(dateObj.minute)
	},
	m: (dateObj) => {
		return dateObj.minute
	},
	ss: (dateObj) => {
		return pad(dateObj.second)
	},
	s: (dateObj) => {
		return dateObj.second
	},
	SSS: (dateObj) => {
		return pad(dateObj.millisecond, 3)
	},
	S: (dateObj) => {
		return dateObj.millisecond
	},
}

// niOS2020-12-122020/12/12
function getDate(time) {
	if (time instanceof Date) {
		return time
	}
	switch (typeof time) {
		case 'string':
			{
				// 2020-12-12T12:12:12.000Z2020-12-12T12:12:12.000
				if (time.indexOf('T') > -1) {
					return new Date(time)
				}
				return new Date(time.replace(/-/g, '/'))
			}
		default:
			return new Date(time)
	}
}

export const filters = {
  tofixed: val => {
		const e = String(val)
		let rex = /^([0-9])\.?([0-9]*)e-([0-9])/
		if( (rex.test(e) && val < 1)){
			const numArr = e.match(rex)
			const n = Number('' + numArr[1] + (numArr[2] || ''))
			const num = '0.' + String(Math.pow(10, Number(numArr[3]) - 1)).substr(1) + n
			return tofixed8(num.replace(/0*$/, ''))  // 0.0001540000000
		}else{
			// 
			let num = new Number(val)
			return tofixed8(num.toString())
		}
  },
	tofixedNum:num =>{
		const e = Number(num)
		if(e>=1000000 && e<1000000000){
			let n = e/1000000
			return n.toFixed(4)+'M'
		}
		if(e>=1000000000){
			let n1 = e/1000000000
			return n1.toFixed(4)+'B'
		}
		
		return num
	},
	tofixed8,
	formatDate(date, format = 'yyyy/MM/dd hh:mm:ss') {
		if (!date && date !== 0) {
			return ''
		}
		date = getDate(date)
		const dateObj = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds(),
			millisecond: date.getMilliseconds()
		}
		const tokenRegExp = /yyyy|yy|MM|M|dd|d|hh|h|mm|m|ss|s|SSS|SS|S/
		let flag = true
		let result = format
		while (flag) {
			flag = false
			result = result.replace(tokenRegExp, function(matched) {
				flag = true
				return parser[matched](dateObj)
			})
		}
		return result
	}
}