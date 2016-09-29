// // alert("TIMER BITCH");
// //timer function\
//
// var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
// console.log("currentTime " + currentTime);
// var destinationTime = moment("SAT 11:59:00 PM");
// var counter = currentTime.diff(destinationTime, 'd:hh:mm:ss');
// console.log(counter);
//
// // var countdown = moment().endOf(SAT ).fromNow();

var deadline = 'October 1 2016 23:59:59 GMT-0500';
  // console.log(deadline);
function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}
function initializeClock(id, endtime){
  var clock = document.getElementById(id);
  var timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
    clock.innerHTML = 'days: ' + t.days + '<br>' +
                      'hours: '+ t.hours + '<br>' +
                      'minutes: ' + t.minutes + '<br>' +
                      'seconds: ' + t.seconds;
    if(t.total<=0){
      clearInterval(timeinterval);
    }
  },1000);
}
initializeClock('clockdiv', deadline);
