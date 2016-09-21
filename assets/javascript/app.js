// alert("Test 1,2,3");

//Firebase application
// // Initialize Firebase
var config = {
  apiKey: "AIzaSyDjEsXkOlnjKIq2L-Ldgr2SYTvXRWjhgfc",
  authDomain: "music-underground.firebaseapp.com",
  databaseURL: "https://music-underground.firebaseio.com",
  storageBucket: "music-underground.appspot.com",
  messagingSenderId: "381719161618"
};
firebase.initializeApp(config);

var database = firebase.database();

//Pseudo code
//Registrant needs to input information for the following: Artist name, location (autocomplete), song, facebook, and upload song

// Capture Button Click
$("#addArtist").on("click", function() {

	// Capture User Inputs and store into variables
	var artist = $('#inputArtist').val().trim();
	var song = $('#inputSong').val().trim();
	var location = $('#inputLocation').val().trim();
	var facebook = $('#inputFB').val().trim();

	console.log(artist);
	console.log(song);
	console.log(location);
	console.log(facebook);


	var newUser = {
		artist : artist,
		song : song,
		location : location,
		facebook : facebook

		//is a actual file consdiered as a val
		// song : song

	}

	database.ref().push(newUser);

	// Console log each of the user inputs to confirm you are receiving them
	console.log(newUser.artist);
	console.log(newUser.song);
	console.log(newUser.location);
	console.log(newUser.facebook);

	alert("You successfully added a new band to the page! Please stay TUNED!!!! 🤘🎸🤘")

	$('#inputArtist').val("");
	$('#inputSong').val("");
	$('#inputLocation').val("");
	$('#inputFB').val("");
	//
	

	// Don't refresh the page!
	return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey){
	console.log(childSnapshot.val());

	var inputArtist = childSnapshot.val().artist;
	var inputSong = childSnapshot.val().song;
	var inputLocation = childSnapshot.val().location;
	var inputFB = childSnapshot.val().facebook;

	console.log(inputArtist);
	console.log(inputSong);
	console.log(inputLocation);
	console.log(inputFB);

})

    //if registrant does not include all field box, error message needs to be alerted. Jon, you were able to do a registrant error if user does not provide all information. please provide.


//if info is input correctl, information will be stored in a database

//append information to table and create hyperlinks to open container with artist information
  // (profile image form facebook will be displaued with other information)

//click on song, and you will be able to play & pause

//click on location, google map api will be generated

// click on facebook redirects to their facebook page
