/*
 * Entry point for the watch app
 */
import * as messaging from "messaging";
import document from "document";


var gameList = document.getElementById('game-list');


messaging.peerSocket.addEventListener("message", (evt) => {
  gameList.delegate = {
    getTileInfo: (index) => {
      return {
        type: "game-pool",
        value: "Item",
        index: index
      };
    },
    configureTile: (tile, info) => {
      console.log(JSON.stringify(info));
      if (info.type == "game-pool") {

        if (info.index == 0) {
          if (evt.data.type == "schedule") {
             tile.getElementById("match").text = "Show live games";
       
          } else {
             tile.getElementById("match").text = "Show scheduled games"; 
          }
          tile.getElementById("date").style.display = "none";          
        } else {
          if (evt.data.type == "schedule") {
            const gameData = evt.data.games[info.index-1];
            console.log(JSON.stringify(gameData));
            tile.getElementById("date").text = gameData.time;
            tile.getElementById("match").text = `${gameData.away} at ${gameData.home} `;
              let touch = tile.getElementById("touch");
              console.log(JSON.stringify(touch));
          
          } else if (evt.data.type == "live") {

          } 
        }




      }
    }
  };
  gameList.length = evt.data.games.length+1;
});


// length must be set AFTER delegate


