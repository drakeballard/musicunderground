// alert("Test 1,2,3");

//Firebase application
// // Initialize Firebase
// var config = {
//   apiKey: "AIzaSyDjEsXkOlnjKIq2L-Ldgr2SYTvXRWjhgfc",
//   authDomain: "music-underground.firebaseapp.com",
//   databaseURL: "https://music-underground.firebaseio.com",
//   storageBucket: "music-underground.appspot.com",
//   messagingSenderId: "381719161618"
// };
// firebase.initializeApp(config);


//Pseudo code
//Registrant needs to input information for the following: Artist name, location (autocomplete), song, facebook, and upload song

// Capture Button Click
$("#addArtist").on("click", function() {

	// Capture User Inputs and store into variables
	var artist = $('#inputArtist').val().trim();
	var song = $('#inputSong').val().trim();
	var location = $('#inputLocation').val().trim();
	var facebook = $('#inputFB').val().trim();

	// Console log each of the user inputs to confirm you are receiving them
	console.log(artist);
	console.log(song);
	console.log(location);
	console.log(facebook);

	// Dump all of the new information into the relevant sections "THIS MAY BE REPLACED USING FIREBASE DATABASE FOR HTML REPRESENTATION"
	// $("#namedisplay").html(name);
	// $("#emaildisplay").html(email);
	// $("#agedisplay").html(age);
	// $("#commentdisplay").html(comment);

	// Don't refresh the page!
	return false;
})


    //if registrant does not include all field box, error message needs to be alerted. Jon, you were able to do a registrant error if user does not provide all information. please provide.


//if info is input correctl, information will be stored in a database

//append information to table and create hyperlinks to open container with artist information
  // (profile image form facebook will be displaued with other information)

//click on song, and you will be able to play & pause

//click on location, google map api will be generated

// click on facebook redirects to their facebook page
