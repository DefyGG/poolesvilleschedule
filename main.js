"use strict";

window.dataLayer = window.dataLayer || [];

const gtag = (...args) => dataLayer.push(args);

gtag('js', new Date());
gtag('config', 'UA-146662310-1');


class Mutex {
	static #GUARD_RANGE = 4294967296
	#lockGuard = null

	constructor() {}

	tryLock() {
		if (this.#lockGuard == null) {
			this.#lockGuard = Math.floor(Math.random() * Mutex.#GUARD_RANGE)
			return this.#lockGuard
		}
	}

	tryUnlock(guard) {
		if (this.#lockGuard != null && this.#lockGuard === guard) {
			this.#lockGuard = null
			return true
		} else {
			return false
		}
	}

	spinOn(spin_delay = 50) {
		return new Promise((resolve => {
			setInterval(() => {
				if (this.#lockGuard === null) {
					resolve()
				}
			}, spin_delay)
		}))
	}
}

class DateProvider {

	static FIVE_MINUTES = 5 * 60 * 1000
	static FIVE_SECONDS = 5 * 1000

	anchor = new Date()
	networkTime

	/// True whenever the network time is being set from null
	networkTimeLock = new Mutex()

	constructor() {}

	/// returns the most accurate date available at the current time
	/// if a connection to worldtimeapi.org is available, the time will be fetched from there
	/// otherwise the time will be fetched from the javascript default (which is the local computer)
	async date() {
		try {
			return await this.lazyNetworkDate()
		} catch {
			console.log("falling back to local time")
			return new Date()
		}
	}

	async lazyNetworkDate() {
		// refresh all measurements every so often
		let timeOffset = new Date() - this.anchor
		if (timeOffset > DateProvider.FIVE_MINUTES) {
			this.queryDateEdt()
				.then(date => {
					this.fromNetwork = date // non-blocking update to refresh time
					this.anchor = new Date() // anchor must be concurrent with the network time
				}) 
				.catch(_ => this.networkTime = null) // if network not detected, unset network time
		}

		// locks if null guard was activated on another task
		await this.networkTimeLock.spinOn()

		// null guard for fromNetwork
		if (this.networkTime == null) {
			let guard = this.networkTimeLock.tryLock()
			this.networkTime = await this.queryDateEdt() // no-network error originates from here
				.catch((err) => {
					console.log("could not find network time")
					this.networkTimeLock.tryUnlock(guard)
					throw err
				})
			this.networkTimeLock.tryUnlock(guard)
			console.log("network time found")
			this.anchor = new Date()
		}

		return new Date(this.networkTime.getTime() + timeOffset)
	}

	async queryDateEdt() {
		return await fetch("https://worldtimeapi.org/api/timezone/America/New_York")
			.then(response => response.json())
			.then(json => new Date(json.unixtime * 1000))
	}
}

let countdown = select('.countdown');
const output = countdown.innerHTML;
const periodoutput = document.getElementsByClassName('period')[0].innerHTML;
const typeoutput = document.getElementsByClassName('stype')[0].innerHTML;
const dateoutput = document.getElementsByClassName('date')[0].innerHTML;
const timeuntiloutput = document.getElementsByClassName('timeuntil')[0].innerHTML;
let goal = 24420;
let period = ""
let myArray = []
let data;

let dateProvider = new DateProvider()

main()

async function main() {

	// let data = JSON.parse(await (await (await fetch('data.json')).blob()).text())
	//bric is bad
	data = await fetch('data.json').then(response => response.json())

	updateSchedule()
	countDownDate();

	setInterval(countDownDate, 1000);
	setInterval(updateSchedule, 1000);
}

/**
 * Easy selector helper function
 */
function select(el, all = false) {
	el = el.trim()
	if (all) {
		return [...document.querySelectorAll(el)]
	} else {
		return document.querySelector(el)
	}
}

/**
 * Easy event listener function
 */
function on(type, el, listener, all = false) {
	let selectEl = select(el, all)
	if (selectEl) {
		if (all) {
			selectEl.forEach(e => e.addEventListener(type, listener))
		} else {
			selectEl.addEventListener(type, listener)
		}
	}
}

/**
 * Easy on scroll event listener 
 */
const onscroll = (el, listener) => {
	el.addEventListener('scroll', listener)
}

/**
 * Back to top button
 */
let backtotop = select('.back-to-top')
if (backtotop) {
	const toggleBacktotop = () => {
		if (window.scrollY > 100) {
			backtotop.classList.add('active')
		} else {
			backtotop.classList.remove('active')
		}
	}
	window.addEventListener('load', toggleBacktotop)
	onscroll(document, toggleBacktotop)
}



function updateSchedule() {
	calculateGoal()
	// let myArray = [['test', 'test'], ['test','testtest']]

	let result = '<table style="border:2px solid white;margin-left:auto;margin-right:auto;table-layout: fixed;width: 80%;" border=1> <tr style = "border: solid;"> <td style="padding : 10px">Period Name</td> <td style="padding : 10px"> Time </td> </tr>';

	for (let i = 0; i < myArray.length; i++) {
		result += "<tr>";
		for (let j = 0; j < myArray[i].length; j++) {
			result += "<td style='padding : 10px'>" + myArray[i][j] + "</td>";
		}
		result += "</tr>";
	}
	result += "</table>";

	document.getElementsByClassName('scheds')[0].innerHTML = result;
}
const proccessTime = function(time) {
	if (Math.floor(time / 60 / 60) > 12) {
		time -= 12 * 60 * 60;
	}
	return "" + Math.floor(time / 60 / 60) + ":" + (Math.floor((time / 60)) % 60 < 10 ? "0" : "") + Math.floor((time / 60)) % 60;
}


const calculateGoal = async function() {
	const date = await dateProvider.date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	let str = `${month}/${day}`;
	let cur = date.getHours();
	let val = cur * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
	if (!(str in data)) {
		str = "base"
	}
	let arr = data[str];
	let periods = arr[1];
	let largestUnder = -1;
	let largest = -1;
	myArray = []

	let schoolStart = 10000000;
	for (let k in periods) {
		k = parseInt(k)
		if (k < schoolStart) {
			schoolStart = k
		}
		myArray.push([periods[k][1], proccessTime(k) + " -> " + proccessTime(periods[parseInt(k)][0])])
		if (k < val && k > largestUnder) {
			largestUnder = k;
		}
		if (k > largest) {
			largest = k;
		}
	}
	if (largestUnder == -1) {
		goal = schoolStart
		period = "Before School"
		document.getElementsByClassName('timeuntil')[0].innerHTML = timeuntiloutput.replace('%inf', "period starts...")
	} else if (periods[largestUnder][0] - val < 0 && largestUnder != largest) {
		document.getElementsByClassName('timeuntil')[0].innerHTML = timeuntiloutput.replace('%inf', "period starts...")
		for (let k in periods) {
			k = parseInt(k)
			if (k > largestUnder) {
				goal = k;
				break;
			}
		}
		period = "Transition"
	} else {
		period = periods[largestUnder][1]
		goal = periods[largestUnder][0];
		document.getElementsByClassName('timeuntil')[0].innerHTML = timeuntiloutput.replace('%inf', "period ends...")
	}



}
const countDownDate = async function() {
	calculateGoal();
	// console.log(data['8/22'])
	const date = await dateProvider.date();

	const day = date.getDate();
	const month = date.getMonth() + 1;
	//const year = date.getFullYear();
	let str = `${month}/${day}`;
	if (!(str in data)) {
		str = "base"
	}

	// console.log(data[str])

	let cur = date.getHours();

	let val = cur * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();

	let timeleft = goal - val;
	if (timeleft <= 0) timeleft = 0
	
	let hours = Math.floor(timeleft / (60 * 60));
	let minutes = Math.floor((timeleft - hours * 60 * 60) / 60);
	let seconds = Math.floor((timeleft - hours * 60 * 60 - minutes * 60));

	countdown.innerHTML = output.replace('%h', hours).replace('%m', minutes).replace('%s', seconds);
	document.getElementsByClassName('period')[0].innerHTML = periodoutput.replace('%d', period)
	document.getElementsByClassName('stype')[0].innerHTML = typeoutput.replace('%a', data[str][0])
	let dateObj = await dateProvider.date();
	let monthe = dateObj.getMonth() + 1; //months from 1-12
	let daye = dateObj.getDate();
	let yeare = dateObj.getFullYear();

	let newdate = monthe + "/" + daye + "/" + yeare;

	document.getElementsByClassName('date')[0].innerHTML = dateoutput.replace('%ss', newdate)

}
