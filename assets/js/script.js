$(document).ready(function(){
  
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAnm_PfXIa9dAczXD6KY9APu5Fzjg3xLGo",
    authDomain: "which-train-when.firebaseapp.com",
    databaseURL: "https://which-train-when.firebaseio.com",
    projectId: "which-train-when",
    storageBucket: "which-train-when.appspot.com",
    messagingSenderId: "1037311861791"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();

  //Variables
  var train;
  var destination;
  var firstTrain="";
  var frequency;
  var nextArrival;
  var minutesAway;
  var maxDuration;
  var timeLeft;
  var diffTime;
  var timeDivision;
  var minutesNextTrain;
  var nextArrival;
  var firstTrainConverted;
  var locomotiveName;
  var locomotiveDestination;
  var locomotiveFirstTime;
  var locomotiveFrequency;
  var now; //obtains current time
  var tilNextMinute;
;



  //EVENTS & FUNCTIONS

  // Add Train button click listener
  $('#submit-button').on('click', function () {
    event.preventDefault();

    train = $('#train-name').val().trim();
    destination = $('#destination').val().trim();
    firstTrain = $('#first-train').val().trim();
    frequency = $("#frequency").val().trim();

    
    console.log(train);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);
  
    database.ref().push({
      trainName: train,
      trainDestination: destination,
      trainFirst: firstTrain,
      trainFrequency: frequency

    });

    $('#train-name').val("");
    $('#destination').val("")
    $('#first-train').val("");
    $('#frequency').val("");

  });



  // Update Train button click listener

  // $(document.body).on('click', '#update-button', function () {
  //   event.preventDefault();


  //   var dropDownUpdate = $('<div class = "dropdown-menu> id = "update-dd-menu" aria-labellledby = "dropdownMenuButton>"');
  //   var addUpdateItem = $('<a class = "dropdown-item" href = "#"> + locomotiveName + </a>');

  //   $('#update-button').append(dropDownUpdate);
  //   $('#update-dd-menu').append(addUpdateItem);

  // });

  //Date and Time Calculations

  function display_time() {
    $('#clock').html(moment().format('MMMM Do, YYYY h:mm:ss A'));
  }

  setInterval(display_time, 1000);




  //MAIN PROCESS

  database.ref().on('child_added', function (childSnapshot) {
    // console.log(childSnapshot.val());



    locomotiveName = childSnapshot.val().trainName;
    locomotiveDestination = childSnapshot.val().trainDestination;
    locomotiveFirstTime = childSnapshot.val().trainFirst;
    locomotiveFrequency = childSnapshot.val().trainFrequency;

    firstTrainConverted = moment(locomotiveFirstTime, 'HH:mm').subtract(1,'years');

    // console.log(firstTrainConverted);
 

    TrainTimeUpdate();



    var newRow = $('<tr>').append (
      $('<td class = "column-1">').text(locomotiveName),
      $('<td class = "column-2">').text(locomotiveDestination),
      $('<td class = "column-3">').text(locomotiveFrequency),
      $('<td class = "column-4">').text(nextArrival),
      $('<td class = "column-5">').text(minutesNextTrain),

    );

  
    $('#current-train-table > tbody').append(newRow);



  });


  Timer();


  function TrainTimeUpdate() {

    diffTime = moment().diff(moment(firstTrainConverted), "minutes");

    timeDivision = diffTime % locomotiveFrequency;  //Divide frequency into time diff between first train of day and now, remainder (modulus) is the minutues left over

    minutesNextTrain = locomotiveFrequency-timeDivision; //take modulus and subtract from train frequency to get minutes left until next train

    console.log('Minutes until next ride for ' +locomotiveName+' :'+ minutesNextTrain);

    nextArrival = moment().add(minutesNextTrain, 'minutes').format('h:mm A');
    // console.log('Next train arrives at: '+nextArrival);


  }

  //Train Info Timer
  function Timer() {
    now = moment().format('ss'); //obtains current time
    tilNextMinute = 60-now;

    // console.log('The seconds grabbed were: '+ now);
    timeLeft = setInterval(TimerDisplay, 1000);
  }

  function TimerDisplay() {
    tilNextMinute--;

    console.log(tilNextMinute);

    if (tilNextMinute <= 0) {
        clearInterval(timeLeft);

      //  tilNextMinute =  moment().format('ss');
        // minuteMinder++;
        // TrainTimeUpdate();
        tableTimeUpdate();
        Timer();
    }
  }


  function tableTimeUpdate () {
    var table = document.getElementById('current-train-table');
    
    for (var r=1, n=table.rows.length; r < n; r++) {
      for (var c=4, m=table.rows[r].cells.length; c < m; c++) {
        var cellTime = table.rows[r].cells[c].innerText;
        var cellTimeUpdate = cellTime-1;

        // if (table.rows[r].cells[4].innerText =1) {
        //   var minuteLeft = table.rows[r].cells[4];
        //   minuteLeft.style.setProperty('color', 'red');
        // } else {
        //   minuteLeft.style.setProperty('color', '#0D0D0D')
        // }

        if (cellTimeUpdate > 0) {
          table.rows[r].cells[c].innerText = cellTimeUpdate;

        }
        else { 
          var trainFreq =  table.rows[r].cells[2].innerText;
          var nextArr =  table.rows[r].cells[3].innerText;
          // var nextArr = moment.duration(nextArr).as('minutes');
          // console.log('Next arrival is: ' + nextArr);
         
          var updateArrival = moment(nextArr,'h:mm A').add(trainFreq, 'minutes');
          var reformatUpdateArrival = moment(updateArrival).format('h:mm A');
          var updateMinsAway = trainFreq;

          table.rows[r].cells[3].innerText = reformatUpdateArrival;
          table.rows[r].cells[4].innerText = updateMinsAway;
        
        }


      }
    }
  }

});

