window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-146662310-1');
  
  (async function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
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
  const on = (type, el, listener, all = false) => {
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

  let countdown = select('.countdown');
  const output = countdown.innerHTML;
  const periodoutput = document.getElementsByClassName('period')[0].innerHTML;
  const typeoutput = document.getElementsByClassName('stype')[0].innerHTML;
  const dateoutput = document.getElementsByClassName('date')[0].innerHTML;
  const timeuntiloutput = document.getElementsByClassName('timeuntil')[0].innerHTML;
  var goal = 24420;
  var period = ""
  var myArray = []
  
  var data = JSON.parse(await (await (await fetch('data.json')).blob()).text())

  const updateSchedule = function() {
    calculateGoal()
    // var myArray = [['test', 'test'], ['test','testtest']]

    var result = '<table style="border:2px solid white;margin-left:auto;margin-right:auto;table-layout: fixed;width: 80%;" border=1> <tr style = "border: solid;"> <td style="padding : 10px">Period Name</td> <td style="padding : 10px"> Time </td> </tr>';
    
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td style='padding : 10px'>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    document.getElementsByClassName('scheds')[0].innerHTML = result;
  }
  const proccessTime = function(time) {
    if (Math.floor(time/60/60) > 12){
      time -= 12*60*60;
    }
    return "" + Math.floor(time/60/60) + ":" + (Math.floor((time/60))%60 < 10 ? "0" : "") + Math.floor((time/60))%60;
  }

  /// returns the most accurate date available at the current time
  /// if a connection to worldtimeapi.org is available, the time will be fetched from there
  /// otherwise the time will be fetched from the javascript default (which is the local computer)
  const reliableDate = async function() {
    try {
      return await dateEdt()
    } catch {
      return new Date()
    }
  }

  const dateEdt = async function() {
    let response = await fetch("https://worldtimeapi.org/api/timezone/America/New_York")
    let blob = await response.blob()
    let timezone_data = JSON.parse(await blob.text())
    return new Date(timezone_data.unixtime * 1000)
  }

  const calculateGoal = async function() {
    const date = await reliableDate();
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    var str = `${month}/${day}`;
    var cur = date.getHours();
    var val = cur*60*60 + date.getMinutes()*60 + date.getSeconds();
    if (!(str in data)){
      str = "base"
    }
    var arr = data[str];
    var periods = arr[1];
    var largestUnder = -1;
    var largest = -1;
    myArray = []

    var schoolStart = 10000000;
    for (let k in periods){
      k= parseInt(k)
      if (k < schoolStart){
        schoolStart = k
      }
      myArray.push([periods[k][1], proccessTime(k) + " -> " + proccessTime(periods[parseInt(k)][0])])
      if (k < val && k > largestUnder){
        largestUnder = k;
      }
      if (k > largest){
        largest = k;
      }
    }
    if (largestUnder == -1){
      goal = schoolStart
      period = "Before School"
      document.getElementsByClassName('timeuntil')[0].innerHTML = timeuntiloutput.replace('%inf',"period starts...")
    }
    else if (periods[largestUnder][0] - val < 0 && largestUnder != largest){
      document.getElementsByClassName('timeuntil')[0].innerHTML = timeuntiloutput.replace('%inf',"period starts...")
      for (let k in periods){
        k = parseInt(k)
        if (k > largestUnder){
          goal = k;
          break;
        }
      }
      period = "Transition"
    }
    else{
      period = periods[largestUnder][1]
      goal = periods[largestUnder][0];
      document.getElementsByClassName('timeuntil')[0].innerHTML = timeuntiloutput.replace('%inf',"period ends...")
    }

    

  }
  const countDownDate = async function() {
    calculateGoal();
    // console.log(data['8/22'])
    const date = await reliableDate();

    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    var str = `${month}/${day}`;
    if (!(str in data)){
      str = "base"
    }

    // console.log(data[str])

    var cur = date.getHours();

    var val = cur*60*60 + date.getMinutes()*60 + date.getSeconds();

    let timeleft = goal - val;
    if (timeleft <= 0){
      timeleft = 0
    }
    let hours = Math.floor(timeleft / (60 * 60));
    let minutes = Math.floor((timeleft - hours * 60 * 60) / 60);
    let seconds = Math.floor((timeleft - hours * 60 * 60 -minutes*60 ));

    countdown.innerHTML = output.replace('%h', hours).replace('%m', minutes).replace('%s', seconds);
    document.getElementsByClassName('period')[0].innerHTML = periodoutput.replace('%d',period)
    document.getElementsByClassName('stype')[0].innerHTML = typeoutput.replace('%a',data[str][0])
    var dateObj = await reliableDate();
    var monthe = dateObj.getMonth() + 1; //months from 1-12
    var daye = dateObj.getDate();
    var yeare = dateObj.getFullYear();

    var newdate = monthe + "/" + daye + "/" + yeare;

    document.getElementsByClassName('date')[0].innerHTML = dateoutput.replace('%ss',newdate)

  }
  updateSchedule()
  countDownDate();
  
  setInterval(countDownDate, 1000);
  setInterval(updateSchedule, 1000);

})()
