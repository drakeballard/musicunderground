// alert("TIMER BITCH");
//timer function
var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
console.log("currentTime " + currentTime);
var destinationTime = moment("SAT 11:59:00 PM");
var counter = currentTime.diff(destinationTime, 'd:hh:mm:ss');
console.log(counter);

// var countdown = moment().endOf(SAT ).fromNow();
