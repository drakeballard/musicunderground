$(document).ready(function() {

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

  // // Set up new instance of Firebase Database and Authorization

  var database = firebase.database();
  var facebookAuth = new firebase.auth.FacebookAuthProvider();

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

  // Code which will be used within the vote button to add voter to authorized users so if voter comes back won't be able to vote again.

  // function facebookSignin() {
  $("#facebookSignin").on("click", function() {    
      
     firebase.auth().signInWithPopup(facebookAuth).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
     }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
     });
  });

  // Show artist sign up
  $("#compete").on("click", function() {
      $("#signup").removeClass('hide');
  }); 

  // Click function to handle when choose file is submitted to upload song to Firebase storage and pass url to new Artist

  $("#inputSongUpload").on('change', handleFileSelect);


  function handleFileSelect(evt) {

    // Set up up Firebase Storage and Anonymous Authorization for song file upload

    var anonymousAuth = firebase.auth().signInAnonymously(); 
    var storageRef = firebase.storage().ref();
     
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error Code: '+error.Code+' Error Message: '+error.message);
    });  

    evt.stopPropagation();
    evt.preventDefault();
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
      console.log('Uploaded', uploadTask.snapshot.totalBytes, 'bytes.');
      console.log(uploadTask.snapshot.metadata);
      $("#addArtist").removeClass("disabled");
      $("#fileUploadStatus").html("Song Uploaded");
      songFileName = $('#inputSongUpload').val().trim();
      songFileName = songFileName.replace("C:\\fakepath\\", "");
      songURL = uploadTask.snapshot.metadata.downloadURLs[0];
      console.log('song '+songURL);
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

      console.log(artist);
      console.log(song);
      console.log(hometown);
      console.log(facebook);
      console.log(vote);

      // database.ref(artist).set({
      database.ref(artist.replace(/\s/g, '')).set({          
          artist: artist,
          song: song,
          hometown: hometown,
          facebook: facebook,
          songFileName: songFileName,
          songURL: songURL, 
          vote : vote
      });

      // var newArtist = {
      //     artist: artist,
      //     song: song,
      //     hometown: hometown,
      //     facebook: facebook,
      //     songURL: songURL, 
      //     vote : vote
      // }

      // database.ref().push(newArtist);

      // Console log each of the user inputs to confirm you are receiving them
      // console.log(newArtist.artist);
      // console.log(newArtist.song);
      // console.log(newArtist.hometown);
      // console.log(newArtist.facebook);
      // console.log(newArtist.songURL)

      alert("You successfully added a new band to the page! Please stay TUNED!!!! 🤘🎸🤘")

      $('#inputArtist').val("");
      $('#inputSong').val("");
      $('#inputHometown').val("");
      $('#inputFB').val("");
      $(".progress-bar").animate({width: "0%"}, 10000);
      $("#inputSongUpload").replaceWith($("#inputSongUpload").val('').clone(true));
      $("#signup").addClass('hide');


      // Don't refresh the page!
      return false;
  });

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

      // console.log(childSnapshot.val());

      var artist = $('<div class="col-sm-12 col-md-3 artists">');
      //this will be changed with FB picture
      picture = $('<img src="assets/images/headphones.jpg" id = "artist1" class="thumbnail center-block">');
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
      console.log(buttonId);
      vote.attr('id', buttonId);

      var user = firebase.auth().currentUser;

      if (user) {
        $('.btn-vote').attr("disabled","disabled");
      }

      artist.append(vote);
      $('#competition').append(artist);
  });

  $(document).on("click", '.btn-vote', function() {

    firebase.auth().signInWithPopup(facebookAuth).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });

    artist = $(this).attr('id');  
    var db = firebase.database();
    var ref = db.ref(artist);
    // Attach an asynchronous callback to read the data at our posts reference
    // ref.on("value", function(snapshot) {
    return ref.once('value').then(function(snapshot) {
      var vote = snapshot.val().vote;
      vote++;
      database.ref(artist).update({
           vote : vote
      });
      $('#'+artist).html('Vote '+ vote);
      console.log('artist '+artist);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    $('.btn-vote').attr("disabled","disabled");
 
  });





});