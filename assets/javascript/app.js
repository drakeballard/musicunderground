$(document).ready(function() {

// Initialize Firebase

  var config = {
      apiKey: "AIzaSyDjEsXkOlnjKIq2L-Ldgr2SYTvXRWjhgfc",
      authDomain: "music-underground.firebaseapp.com",
      databaseURL: "https://music-underground.firebaseio.com",
      storageBucket: "music-underground.appspot.com",
      messagingSenderId: "381719161618"
  };
  firebase.initializeApp(config);

// Set up new instance of Firebase Database and Authorization Link To Facebook

  var database = firebase.database();
  var facebookAuth = new firebase.auth.FacebookAuthProvider();

  // Check to see if voter is signed in and if so diasable all vote buttons

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in. Add code to disable all Vote Buttons
      // $('.btn-vote').attr("disabled","disabled");
      $('.btn-vote').prop('disabled', true);
      //$('#signinStatus').html(' Signed In ');
    } else {
      // No user is signed in. Add code to enable all Vote Buttons
      $('.btn-vote').prop('disabled', false);
    }
     console.log('user '+user);
  });

// Check to see if voter is signed in and if so diasable all vote buttons

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in. Add code to disable all Vote Buttons
      $('.btn-vote').attr("disabled","disabled");
      $('#signinStatus').html(' Signed In ');
    } else {
      // No user is signed in. Add code to enable all Vote Buttons
    }
  });

// Show artist sign up form when the compete button is clicked

  $("#compete").on("click", function() {
      $("#signup").removeClass('hide');
  }); 

// Call function Upload song when browse is clicked.

  $("#inputSongUpload").on('change', uploadSong);

  // Function to display which song is submitted and when selected upload song to Firebase storage and pass url to new Artist being set up.

  function uploadSong(evt) {

    // Set up up Firebase Storage and Anonymous Authorization for song file upload

    var anonymousAuth = firebase.auth().signInAnonymously(); 
    var storageRef = firebase.storage().ref();
       
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle authorization errors.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error Code: '+error.Code+' Error Message: '+error.message);
    });  

    // Capture file and add meta tag for type of file.
    var file = evt.target.files[0];
    var metadata = {
      'contentType': 'audio/mp3'
    };

    // Disable submit button and set up progress bar to show song uploading
    $(".progress-bar").animate({width: "100%"}, 10000);
    $("#addArtist").addClass("disabled");

    // Push to child path.
    var uploadTask = storageRef.child('audio').child(file.name).put(file, metadata);

    // Listen for errors and completion of the upload.
    uploadTask.on('state_changed', null, function(error) {
      console.error('Upload failed:', error);
    }, function() {
      // Disable Submit Button until song upload completes
      $("#addArtist").removeClass("disabled");
      // Change text for progress bar to Song Uploaded when song upload is done.
      $("#fileUploadStatus").html("Song Uploaded");
      // Capture Song File Name and song file url from Firebase to be used for audio player.
      songFileName = $('#inputSongUpload').val().trim();
      songFileName = songFileName.replace("C:\\fakepath\\", "");
      songURL = uploadTask.snapshot.metadata.downloadURLs[0];
    });
  }

// Function to process Artist Sign Up when submit button clicked

  $("#addArtist").on("click", function() {

    // Capture User Inputs and store into variables
    var artist = $('#inputArtist').val().trim();
    var song = $('#inputSong').val().trim();
    var hometown = $('#inputHometown').val().trim();
    var facebook = $('#inputFB').val().trim();
    var vote = 0;
    // CompetitonStatus is used to hold whether the artist is current or next competion. Also used to hold the winner.
    var competitionStatus = 'next';

    // Upload artist to Firebase. Index is the artist name with spaces removed.
    database.ref(artist.replace(/\s/g, '')).set({          
        artist: artist,
        song: song,
        hometown: hometown,
        facebook: facebook,
        songFileName: songFileName,
        songURL: songURL, 
        vote : vote,
        competeStatus: competitionStatus
    });

    //Clear The Artist Sign Up Fields    
    $('#inputArtist').val("");
    $('#inputSong').val("");
    $('#inputHometown').val("");
    $('#inputFB').val("");
    $(".progress-bar").animate({width: "0%"}, 10000);
    $("#fileUploadStatus").html("Song Uploading");
    $("#inputSongUpload").replaceWith($("#inputSongUpload").val('').clone(true));
    $("#signup").addClass('hide');

    // Keep the Artist Sign Up form from trying to go to a new page when submitted
    return false;
  });

// Function to detect when a new artist added and update the competition page.

    database.ref().on("child_added", function(childSnapshot, currChildKey) {  

    // Build the artist

    var artist = $('<div class="col-sm-12 col-md-3 artists">');
    //Sets up a default artist picture which will be updated with Facebook API to pull in the Artist Profile Picture from Facebook
    picture = $('<img src="assets/images/headphones.jpg" id = "artist_'+(childSnapshot.val().artist).replace(/\s/g, '')+'" class="thumbnail center-block">');
    artist.append(picture);
    artistName = $('<figcaption class="text-center">').text(childSnapshot.val().artist);
    artist.append(artistName);
    song = $('<figcaption class="text-center">').text(childSnapshot.val().song);
    artist.append(song);
    hometown = $('<figcaption class="text-center">').text(childSnapshot.val().hometown);
    artist.append(hometown);
    audio = $('<audio controls class="center-block">');
    artist.append(audio);
    audio.attr("src", childSnapshot.val().songURL);
    vote = $('<button class="btn btn-vote center-block">')
    vote.text("Vote "+childSnapshot.val().vote);
    buttonId = childSnapshot.val().artist.replace(/\s/g, '');
    vote.attr('id', buttonId);
    artist.append(vote);

    // Check to see if a user is signed in and if so disable the vote buttons so you are unable to vote again.

    var user = firebase.auth().currentUser;
    
    if (user) {
      // $('.btn-vote').attr("disabled","disabled");
      $('.btn-vote').prop('disabled', true);
    } else {
      $('.btn-vote').prop('disabled', false);
    }

    // Add artist to page
    $('#competition').append(artist);

    // AJAX call to pull in the Artist facebook profile picture 
    
    // Strip the artist ID from the facebook link provided on sign up.
    var facebookId = childSnapshot.val().facebook;
    facebookId = facebookId.replace("http://wwww.facebook.com/","");
    facebookId = facebookId.replace("https://wwww.facebook.com/","");
    facebookId = facebookId.replace("/?fref=ts","");
        
    // Build the url to pass on to ajax to pull in the Artist Profile Picture from Facebook
    
    var queryURL = "https://graph.facebook.com/"+facebookId+"?fields=picture.type(large)";
    $.ajax({url: queryURL, method: 'GET', processData: false}).done(function(response) {
        // Pull in the picture url from the response received from the Ajax call
        var updatePicture = "#artist_"+childSnapshot.val().artist.replace(/\s/g, '');
        artistPicture = response.picture.data.url.trim();
        // Update the picture url from the default picture to the Facebook Picture Url
        $(updatePicture).attr("src",artistPicture);
    }); 

  });

// Function to check which artist vote button was clicked and update the artist vote count in Firebase and the vote button

  $(document).on("click", '.btn-vote', function() {

    // Update the authorized users in Firebase against Facebook

    firebase.auth().signInWithPopup(facebookAuth).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });

    // Get the id of the artist from the vote button clicked.
    artist = $(this).attr('id');  
    var db = firebase.database();
    var ref = db.ref(artist);
    // Check the database for an artist whose index value matching the id of the button clicked and return the artist.
    return ref.once('value').then(function(snapshot) {
      var vote = snapshot.val().vote;
      vote++;
      // Update the artist record with the vote
      database.ref(artist).update({
           vote : vote
      });
      // Display the new vote count for the artist.
      $('#'+artist).html('Vote '+ vote);
      $('.btn-vote').attr("disabled","disabled");
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  });  
 
});