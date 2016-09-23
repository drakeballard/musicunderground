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

// Set up new instance of Firebase Authorization

var provider = new firebase.auth.FacebookAuthProvider();

// Check to see if voter is signed in and if so diasable all vote buttons

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in. Add code to disable all Vote Buttons
    $('#signinStatus').html('Signed In');
  } else {
    // No user is signed in. Add code to enable all Vote Buttons
  }
});

// Code which will be used within the vote button to add voter to authorized users so if voter comes back won't be able to vote again.

// function facebookSignin() {
$("#facebookSignin").on("click", function() {    
    
   firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
   }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
   });
});

//Pseudo code
//Registrant needs to input information for the following: Artist name, hometown (autocomplete), song, facebook, and upload song

// Capture Button Click
$("#addArtist").on("click", function() {

    // Capture User Inputs and store into variables
    var artist = $('#inputArtist').val().trim();
    var song = $('#inputSong').val().trim();
    var hometown = $('#inputHometown').val().trim();
    var facebook = $('#inputFB').val().trim();

    console.log(artist);
    console.log(song);
    console.log(hometown);
    console.log(facebook);

    var newUser = {
        artist: artist,
        song: song,
        hometown: hometown,
        facebook: facebook

        //is a actual file consdiered as a val
        // song : song

    }

    database.ref().push(newUser);

    // Console log each of the user inputs to confirm you are receiving them
    console.log(newUser.artist);
    console.log(newUser.song);
    console.log(newUser.hometown);
    console.log(newUser.facebook);

    alert("You successfully added a new band to the page! Please stay TUNED!!!! 🤘🎸🤘")

    $('#inputArtist').val("");
    $('#inputSong').val("");
    $('#inputHometown').val("");
    $('#inputFB').val("");
    //


    // Don't refresh the page!
    return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    // console.log(childSnapshot.val());

    var artist = $('<div class="col-sm-12 col-md-3 artists">');
    //this will be changed with FB picture
    picture = $('<img src="assets/images/headphones.jpg" id = "artist1" class="thumbnail center-block">');
    artist.append(picture);
    artistName = $('<p class="text-center">').text(childSnapshot.val().artist);
    artist.append(artistName);
    song = $('<p class="text-center">').text(childSnapshot.val().song);
    artist.append(song);
    hometown = $('<p class="text-center">').text(childSnapshot.val().hometown);
    artist.append(hometown);
    //going to use audiofile for now. this will be replaced with the actual song
    audio = $('<audio controls class="center-block">');
    artist.append(audio);
    audio.attr("src", "assets/audio/guitar.mp3");

    vote = $('<button class="btn btn-vote center-block">')
    vote.text("Vote  +100");
    vote.attr('id', childSnapshot.val().artist);
    artist.append(vote);

    // artist = artist + $('<figcapture>').text('Song Title');
    // artist = artist + $('<audio class="audio">');
    // artist = artist + $('<button type="button" id="vote1" class="btn btn-vote center-block">').text('Vote');
    // console.log(artist);
    $('#competition').append(artist);
    // console.log(mp3);
    // console.log(audio);

    //Currently voting tool is going to be in a descending "clicks"
    $(".btn-vote").on("click", function() {
      alert("you just done voted");

    });

});


//if registrant does not include all field box, error message needs to be alerted. Jon, you were able to do a registrant error if user does not provide all information. please provide.


//if info is input correctl, information will be stored in a database

//append information to table and create hyperlinks to open container with artist information
// (profile image form facebook will be displaued with other information)

//click on song, and you will be able to play & pause

//click on hometown, google map api will be generated

// click on facebook redirects to their facebook page
