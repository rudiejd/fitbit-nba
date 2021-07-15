/*
 * Entry point for the companion app
 */
import * as messaging from "messaging";
import { GAME_COUNT, NBA_SCHEDULE_ENDPOINT, NBA_LIVESCORE_ENDPOINT } from "../common/globals";


function getNBASchedule() {
  fetch(NBA_SCHEDULE_ENDPOINT)
  .then(function (response) {
      response.json()
      .then(function(data) {
        // Send games to device
          let games = [];
          let gameDates = data['leagueSchedule']['gameDates'].filter(g => Date.parse(g['gameDate']) >= new Date());
          console.log(gameDates);
          let i = 0;
          while (games.length < GAME_COUNT && i < gameDates.length) {
             for (let game of gameDates[i]["games"]) {
                games.push({
                  "home": game["homeTeam"]["teamName"],
                  "away": game["awayTeam"]["teamName"],
                  "time": game["gameDateTimeEst"]
                });
                if (games.length >= GAME_COUNT) break;
             }
             // goto next day
             i++;
            }
            sendData({"type": "schedule", "games": games});
      });
  })
  .catch(function (err) {
    console.error(`Error fetching NBA games: ${err}`);
  });
}

function getNBALive() {
  fetch(NBA_LIVESCORE_ENDPOINT)
  .then((response) => {
    response.json()
    .then((data) => {
      console.log(data)
    })
  })
  
}

function sendData(data) {
  console.log("sending");
  console.log(data);
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.error("Error: Connection is not open");
  }
}


// Listen for the onopen event
messaging.peerSocket.addEventListener("open", () => {
  // Ready to send or receive messages
  getNBASchedule();
});
 

// Listen for the onmessage event
messaging.peerSocket.addEventListener("message", (evt) => {
  // Output the message to the console
  console.log(evt);
  if (evt.data == "live") {
    getNBALive();
  }
  console.log(JSON.stringify(evt.data));
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});
