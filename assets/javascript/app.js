$(document).ready(function() {

    // Global variables

    var t = 0; // holds current remaining time
    // Dates for competitions
    var competitionDates = [
        { "index": 0, "endDate": "10/2/16" },
        { "index": 1, "endDate": "10/9/16" },
        { "index": 2, "endDate": "10/16/16" },
        { "index": 3, "endDate": "10/23/16" },
        { "index": 4, "endDate": "10/30/16" },
        { "index": 5, "endDate": "11/6/16" },
        { "index": 6, "endDate": "11/13/16" },
        { "index": 7, "endDate": "11/20/16" },
        { "index": 8, "endDate": "11/27/16" },
    ];

    var currentHighVotes = 0;

    //Function to check local storage if modal has been stored. If so, Modal will stay hidden
    //If not, show modal, play audio and update local storage when user clicks close gyph. 
    //This will keep it from showing in future visits.

    function hideIt() {
        $('#myModal').modal('hide');
    };

    if (localStorage.hidden === "hidden") {
        hideIt();
    } else {
        $(window).load(function() {
            $('#myModal').modal('show');
            var audio = new Audio('assets/audio/rumble.mp3');
            audio.play();
        });

        $('.close').on('click', function() {
            $('#myModal').modal('hide');
            localStorage.hidden = "hidden";
        });
    };

    // Build the countdown timer for the contest

    // // initializeClock('clockdiv', deadline);
    function getTimeRemaining(endtime) {
        t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            daysSpan.innerHTML = t.days;
            hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                clearInterval(timeinterval);
                daysSpan.innerHTML = ('0');
                hoursSpan.innerHTML = ('0');
                minutesSpan.innerHTML = ('0');
                secondsSpan.innerHTML = ('0');
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }
    //update the new date here for the time remaining or updating for new battle

    for (var key in competitionDates) {
        var currentDate = moment();
        var end = moment(competitionDates[key].endDate, "MM/DD/YYYY");
        if (currentDate < end) {
            deadline = end;
            break;
        }
    }

    initializeClock('clockdiv', deadline);

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
    });

    // Check to see if voter is signed in and if so diasable all vote buttons

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in. Add code to disable all Vote Buttons
            $('.btn-vote').attr("disabled", "disabled");
            $('#signinStatus').html(' Signed In ');
        } else {
            // No user is signed in. Add code to enable all Vote Buttons
        }
    });

    // Show artist sign up form when the compete button is clicked

    $("#compete").on("click", function() {
        $("#signup").removeClass('hide');
        $('html, body').animate({
            scrollTop: $("#signup").offset().top
        }, 2000);
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
            console.log('Error Code: ' + error.Code + ' Error Message: ' + error.message);
        });

        // Capture file and add meta tag for type of file.
        var file = evt.target.files[0];
        var metadata = {
            'contentType': 'audio/mp3'
        };

        // Disable submit button and set up progress bar to show song uploading
        $(".progress-bar").animate({ width: "100%" }, 10000);
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
            vote: vote,
            competeStatus: competitionStatus
        });

        //Clear The Artist Sign Up Fields    
        $('#inputArtist').val("");
        $('#inputSong').val("");
        $('#inputHometown').val("");
        $('#inputFB').val("");
        $(".progress-bar").animate({ width: "0%" }, 10000);
        $("#fileUploadStatus").html("Song Uploading");
        $("#inputSongUpload").replaceWith($("#inputSongUpload").val('').clone(true));
        $("#signup").addClass('hide');

        // Keep the Artist Sign Up form from trying to go to a new page when submitted
        return false;
    });

    // Function to detect when a new artist added and update the competition page.

    // database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    database.ref().on("child_added", function(childSnapshot) {
        // If/Then to see if there is remaining time left in the current battle.
        if (t > 0) {

            if (childSnapshot.val().artist == "Aaawinner") {
                // Build the previous winner

                var artist = $('<div class="col-sm-12 col-md-3 artists">');
                //Sets up a default artist picture which will be updated with Facebook API to pull in the Artist Profile Picture from Facebook
                picture = $('<a href="' + childSnapshot.val().facebook + '" target="_blank"><img src="assets/images/headphones.jpg" id = "artist_' + (childSnapshot.val().artist).replace(/\s/g, '') + '" class="thumbnail center-block"></a>');
                artist.append(picture);
                artistName = $('<figcaption class="text-center">').text(childSnapshot.val().winner);
                artist.append(artistName);
                song = $('<figcaption class="text-center">').text(childSnapshot.val().song);
                artist.append(song);
                hometown = $('<figcaption class="text-center">').text(childSnapshot.val().hometown);
                artist.append(hometown);
                winningdate = $('<figcaption class="text-center">').text('Previous Weeks Winner');
                artist.append(winningdate);
                audio = $('<audio controls class="center-block">');
                audio.attr("src", childSnapshot.val().songURL);
                artist.append(audio);

                // Add winner to page
                $('#competition').append(artist);

                // AJAX call to pull in the Artist facebook profile picture 

                // Strip the artist ID from the facebook link provided on sign up.
                var facebookId = childSnapshot.val().facebook;
                facebookId = facebookId.replace("http://wwww.facebook.com/", "");
                facebookId = facebookId.replace("https://wwww.facebook.com/", "");
                facebookId = facebookId.replace("/?fref=ts", "");

                // Build the url to pass on to ajax to pull in the Artist Profile Picture from Facebook

                var queryURL = "https://graph.facebook.com/" + facebookId + "?fields=picture.type(large)";
                $.ajax({ url: queryURL, method: 'GET', processData: false }).done(function(response) {
                    // Pull in the picture url from the response received from the Ajax call
                    var updatePicture = "#artist_" + childSnapshot.val().artist.replace(/\s/g, '');
                    artistPicture = response.picture.data.url.trim();
                    // Update the picture url from the default picture to the Facebook Picture Url
                    $(updatePicture).attr("src", artistPicture);
                });
            } else if (childSnapshot.val().artist != "currentleader") {

                // Build the competiting artist 

                var artist = $('<div class="col-sm-12 col-md-3 artists">');
                //Sets up a default artist picture which will be updated with Facebook API to pull in the Artist Profile Picture from Facebook
                picture = $('<a href="' + childSnapshot.val().facebook + '" target="_blank"><img src="assets/images/headphones.jpg" id = "artist_' + (childSnapshot.val().artist).replace(/\s/g, '') + '" class="thumbnail center-block"></a>');
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
                vote.text("Vote " + childSnapshot.val().vote);
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
                facebookId = facebookId.replace("http://wwww.facebook.com/", "");
                facebookId = facebookId.replace("https://wwww.facebook.com/", "");
                facebookId = facebookId.replace("/?fref=ts", "");

                // Build the url to pass on to ajax to pull in the Artist Profile Picture from Facebook

                var queryURL = "https://graph.facebook.com/" + facebookId + "?fields=picture.type(large)";
                $.ajax({ url: queryURL, method: 'GET', processData: false }).done(function(response) {
                    // Pull in the picture url from the response received from the Ajax call
                    var updatePicture = "#artist_" + childSnapshot.val().artist.replace(/\s/g, '');
                    artistPicture = response.picture.data.url.trim();
                    // Update the picture url from the default picture to the Facebook Picture Url
                    $(updatePicture).attr("src", artistPicture);
                });
                // update current leader with the artist having the highest number of votes.
                if (childSnapshot.val().vote > currentHighVotes) {
                    currentHighVotes = childSnapshot.val().vote;
                    database.ref('currentleader').update({
                        currentleader: childSnapshot.val().artist,
                        song: childSnapshot.val().song,
                        hometown: childSnapshot.val().hometown,
                        facebook: childSnapshot.val().facebook,
                        songFileName: childSnapshot.val().songFileName,
                        songURL: childSnapshot.val().songURL,
                        vote: currentHighVotes,
                    });
                }
            }
        // Read in current leader and assign the new winner if no time remains in current battle. Reset votes to 0 for new week.    
        } else {
            
            database.ref(childSnapshot.val().artist.replace(/\s/g, '')).update({
                vote: 0
            })
            return database.ref("currentleader").once('value').then(function(snapshot) {
                console.log('winner');
                winner = snapshot.val().currentleader;
                song = snapshot.val().song;
                hometown = snapshot.val().hometown;
                facebook = snapshot.val().facebook;
                songFileName = snapshot.val().songFileName;
                songURL = snapshot.val().songURL;
                database.ref('Aaawinner').update({
                    winner: winner,
                    song: song,
                    hometown: hometown,
                    facebook: facebook,
                    songFileName: songFileName,
                    songURL: songURL,
                });

            }, function(errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }
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
        var artist = $(this).attr('id');
        var db = firebase.database();
        var ref = db.ref(artist);
        // var artist = '';
        var currentleader = '';
        var song = '';
        var hometown = '';
        var facebook = '';
        var songFileName = '';
        var songURL = '';
        var vote = 0;
        var competeStatus = '';
        // Check the database for an artist whose index value matching the id of the button clicked and return the artist.
        return ref.once('value').then(function(snapshot) {
            currentLeader = snapshot.val().artist;
            song = snapshot.val().song;
            hometown = snapshot.val().hometown;
            facebook = snapshot.val().facebook;
            songFileName = snapshot.val().songFileName;
            songURL = snapshot.val().songURL;
            vote = snapshot.val().vote;
            vote++;
            // Update the artist record with the vote
            database.ref(artist).update({
                vote: vote
            });
            // Display the new vote count for the artist.
            $('#' + artist).html('Vote ' + vote);
            $('.btn-vote').attr("disabled", "disabled");
            // Check to see if vote makes the artist the new current leader
            if (vote > currentHighVotes) {
                database.ref('currentleader').update({
                    currentleader: currentLeader,
                    song: song,
                    hometown: hometown,
                    facebook: facebook,
                    songFileName: songFileName,
                    songURL: songURL,
                    vote: vote,
                });
            }

        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    });

});
