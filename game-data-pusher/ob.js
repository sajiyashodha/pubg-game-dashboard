var http = require("http");
var url = require('url');
var fs = require('fs');
var util = require('util');
const mysql = require('mysql2');

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'pubg',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

function Datetime(){
    return new Date().toISOString(). replace(/T/, ' ').replace(/\..+/, '');
};

var logDir = 'log/';
if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

var logDate = new Date().yyyymmdd();
var logFilePath = logDir + 'log-' + logDate + '.txt';
var logFile = fs.createWriteStream(logFilePath, {flags : 'a'});
// var logStdout = process.stdout;

console.log = function() {
  logFile.write(util.format.apply(null, arguments) + '\r\n');
  // logStdout.write(util.format.apply(null, arguments) + '\r\n');
}
console.error = console.log;

var app = {};
app.allInfo = {};
app.isInGame = false;
app.observingPlayer = {};
app.killInfo = [];
app.killBossInfo = [];
app.consumeItem = [];
app.gameGlobalInfo = {};
app.circleInfo = [];
app.teamreportdata = {};
app.playerreportdata = {};
app.playerweaponinfo = {};
app.playerweapondetailinfo = [];
app.teambackpackinfo = {};
app.allplayerthrowinfo = {};
app.airdropboxinfo = {};
app.tdmresultinfo = {};
app.playersaminfo = [];
app.playerssightusageinfo = {};

const queue = [];
let processing = false;

function processQueue() {
    // If already processing, do not process again
    if (processing || queue.length === 0) return;
  
    processing = true;
    
    // Process the most recent item (last one in the queue)
    const { request, response } = queue.pop();  // Always remove the last item
  
    handleRequest(request, response)
      .finally(() => {
        processing = false;
        processQueue();  // Continue processing the next request in the queue (if any)
      });
  }
  
  async function handleRequest(request, response) {
    if (request.method == "POST") {
        let body = "";
    
        request.on("data", (chunk) => {
          body += chunk.toString();
        });
    
        request.on("end", () => {
          let obj = JSON.parse(body);
          app.allInfo = obj;
    
          console.log(obj);
    
          const { GameID, TotalPlayerList, GameStartTime, TeamInfoList, FinishedStartTime } = obj;
    
          // Ensure GameID and GameStartTime are valid
          if (!GameID || !GameStartTime) {
            console.error("Invalid GameID or GameStartTime");
            response.writeHead(400, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ error: "Invalid data" }));
          }
    
          // Check if game_round exists and insert if not
          const query = "SELECT * FROM game_rounds WHERE game_id = ?";
          db.execute(query, [GameID.toString()], (err, result) => {
            if (err) {
              console.error("Error checking game_id in game_rounds:", err);
              response.writeHead(500, { "Content-Type": "application/json" });
              return response.end(JSON.stringify({ error: "Database error" }));
            }
    
            if (result.length === 0) {
              const insertGameQuery = `INSERT INTO game_rounds (game_id, started_at, is_ended, tournament_id, game_name) VALUES (?, ?, ?, NULL, NULL)`;
              db.execute(
                insertGameQuery,
                [GameID.toString(), new Date(GameStartTime * 1000), false],
                (err, result) => {
                  if (err) {
                    console.error("Error inserting game round:", err);
                    response.writeHead(500, { "Content-Type": "application/json" });
                    return response.end(
                      JSON.stringify({ error: "Database error" })
                    );
                  }
                }
              );
            }
    
            // Initialize dictionary to store teamId and rank
            const teamRankDictionary = {};
    
            // Insert or update players in the totalmessage table
            TotalPlayerList.forEach((player) => {
              // Replace undefined fields with null
              const playerName = player.playerName;
              const teamId = player.teamId;
              const uId = player.uId;
    
              if (!playerName || !teamId || !uId) {
                console.error(
                  "playerName and teamId and uId should not be null.",
                  playerName,
                  teamId,
                  uId
                );
                response.writeHead(400, { "Content-Type": "application/json" });
                return response.end(
                  JSON.stringify({
                    error: "playerName and teamId and uId should not be null",
                  })
                );
              }
    
              const killNum = player.killNum !== undefined ? player.killNum : 0;
              const damage = player.damage !== undefined ? player.damage : 0;
              const rank = player.rank !== undefined ? player.rank : 0;
              const heal = player.heal !== undefined ? player.rank : 0;
              const health = player.health;
              const assists = player.assists !== undefined ? player.assists : 0;
              const knockouts =
                player.knockouts !== undefined ? player.knockouts : 0;
              const killNumByGrenade =
                player.killNumByGrenade !== undefined ? player.killNumByGrenade : 0;
              const killNumInVehicle =
                player.killNumInVehicle !== undefined ? player.killNumInVehicle : 0;
    
              // Store the teamId and rank in the dictionary
              if (!teamRankDictionary[teamId]) {
                teamRankDictionary[teamId] = rank;
              }
    
              // Handle possible null/undefined values properly
              const insertPlayerQuery = `
                            INSERT INTO totalmessage 
                            (player_name, team_id, u_id, kill_num, damage, rank, heal, health, assists, knockouts, kill_num_in_vehicle, kill_num_by_grenade, game_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                                player_name = VALUES(player_name),
                                team_id = VALUES(team_id),
                                kill_num = VALUES(kill_num),
                                damage = VALUES(damage),
                                rank = VALUES(rank),
                                heal = VALUES(heal),
                                health = VALUES(health),
                                assists = VALUES(assists),
                                knockouts = VALUES(knockouts),
                                kill_num_in_vehicle = VALUES(kill_num_in_vehicle),
                                kill_num_by_grenade = VALUES(kill_num_by_grenade)
                        `;
    
              const values = [
                playerName,
                teamId,
                uId.toString(),
                killNum,
                damage,
                rank,
                heal,
                health,
                assists,
                knockouts,
                killNumInVehicle,
                killNumByGrenade,
                GameID.toString(), // Always include GameID here
              ];
    
              // Execute the insert query
              db.execute(insertPlayerQuery, values, (err, result) => {
                if (err) {
                  console.error(
                    "Error inserting/updating player into totalmessage:",
                    err
                  );
                }
              });
            });
    
            // Insert or update teams in the team_rankings table
            TeamInfoList.forEach((team) => {
              // Replace undefined fields with null
              const teamName = team.teamName;
              const teamId = team.teamId;
              const killNum = team.killNum;
              const rank = teamRankDictionary[teamId] !== undefined ? teamRankDictionary[teamId] : 0;
    
              if (!teamId) {
                console.error(
                  "teamId should not be null.",
                  teamId
                );
                response.writeHead(400, { "Content-Type": "application/json" });
                return response.end(
                  JSON.stringify({
                    error: "teamId should not be null",
                  })
                );
              }
    
              let pts = 0;
              if (rank === 1) {
                pts = 10;
              } else if (rank === 2) {
                pts = 6;
              } else if (rank === 3) {
                pts = 5;
              } else if (rank === 4) {
                pts = 4;
              } else if (rank === 5) {
                pts = 3;
              } else if (rank === 6) {
                pts = 2;
              } else if (rank === 7 || rank === 8) {
                pts = 1;
              } else if (rank >= 9 && rank <= 25) {
                pts = 0;
              }
    
              const total = pts + Number(killNum);
    
              // Handle possible null/undefined values properly
              const insertTeamRankingQuery = `
                                            INSERT INTO team_rankings 
                                            (team_id, team_name, kill_num, pts, rank, total, game_id)
                                            VALUES (?, ?, ?, ?, ?, ?, ?)
                                            ON DUPLICATE KEY UPDATE
                                                team_name = VALUES(team_name),
                                                kill_num = VALUES(kill_num),
                                                pts = VALUES(pts),
                                                rank = VALUES(rank),
                                                total = VALUES(total)
                                        `;
    
              const values = [
                teamId,
                teamName,
                killNum,
                pts,
                rank,
                total,
                GameID.toString(), // Always include GameID here
              ];
    
              // Execute the insert query
              db.execute(insertTeamRankingQuery, values, (err, result) => {
                if (err) {
                  console.error(
                    "Error inserting/updating team into team_rankings:",
                    err
                  );
                }
              });
            });
    
            if (Number(FinishedStartTime)>0) {
                const updateGameRoundIsActiveQuery = 'UPDATE game_rounds SET is_ended = ? WHERE game_id = ?';
              // Execute the update query
              db.execute(updateGameRoundIsActiveQuery, [true, GameID.toString()], (err, result) => {
                if (err) {
                  console.error(
                    "Error updating team is_ended in game_rounds table:",
                    err
                  );
                }
              });
            }
    
            // Respond with success (200 OK)
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Data successfully saved" }));
          });
        });
      } else {
        // Handle non-POST requests
        response.writeHead(405, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Method Not Allowed" }));
      }
  }

app.totalmessage = function (request, response) {
      // If the queue already has items, and a new request arrives, we discard the previous ones.
  // Only the most recent one will be processed.
  queue.length = 0;  // Clear the queue before pushing the new request

  // Add the new request to the queue
  queue.push({ request, response });

  // Start processing the queue (if it's not already being processed)
  processQueue();  
};

app.getallinfo = function(request, response) {
    let ret = {}

    if (app.allInfo) {
        ret.allinfo = app.allInfo;
    }

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.gettotalplayerlist = function(request, response) {
    let ret = {}
    ret.playerInfoList = [];

    if (app.allInfo) {
        if (app.allInfo['TotalPlayerList']) {
            ret.playerInfoList = app.allInfo['TotalPlayerList']
        }
    }

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.getteaminfolist = function(request, response) {
    let ret = {}
    ret.teamInfoList = [];

    if (app.allInfo) {
        if (app.allInfo['TeamInfoList']) {
            ret.teamInfoList = app.allInfo['TeamInfoList']
        }
    }

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setisingame = function(request, response) {
    if (request.method  == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            app.isInGame = body == 'InGame'

            console.log(body);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.isingame = function(request, response) {
    let ret = {}
    ret.isInGame = app.isInGame == true;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setobservingplayer = function(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
            app.observingPlayer = obj

            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getobservingplayer = function(request, response) {
    let ret = {}
    ret.observingPlayer = app.observingPlayer;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setkillinfo = function(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
            app.killInfo.unshift(obj);

            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getkillinfo = function(request, response) {
    let ret = {}
    ret.killInfo = app.killInfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setkillbossinfo = function(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
            app.killBossInfo.unshift(obj);

            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getkillbossinfo = function(request, response) {
    let ret = {}
    ret.killBossInfo = app.killBossInfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setconsumeitem = function(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
            app.consumeItem.unshift(obj);

            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getconsumeitem = function(request, response) {
    let ret = {}
    ret.consumeItem = app.consumeItem;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setgameglobalinfo = function(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.gameGlobalInfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getgameglobalinfo = function(request, response) {
    let ret = {}
    ret.gameGlobalInfo = app.gameGlobalInfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setcircleinfo = function(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.circleInfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getcircleinfo = function(request, response) {
    let ret = {}
    ret.circleInfo = app.circleInfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setteamreportdata = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.teamreportdata = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getteamreportdata = function(request, response) {
    let ret = {}
    ret.teamreportdata = app.teamreportdata;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setplayerreportdata = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.playerreportdata = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getplayerreportdata = function(request, response) {
    let ret = {}
    ret.playerreportdata = app.playerreportdata;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setplayerweaponinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.playerweaponinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getplayerweaponinfo = function(request, response) {
    let ret = {}
    ret.playerweaponinfo = app.playerweaponinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setplayerweapondetailinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
		
        request.on('end', () => {
            let obj = JSON.parse(body);
			app.playerweapondetailinfo.unshift(obj);
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getplayerweapondetailinfo = function(request, response) {
    let ret = {}
    ret.playerweapondetailinfo = app.playerweapondetailinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setteambackpackinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.teambackpackinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getteambackpackinfo = function(request, response) {
    let ret = {}
    ret.teambackpackinfo = app.teambackpackinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setallplayerthrowinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.allplayerthrowinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }	
}

app.getallplayerthrowinfo = function(request, response) {
    let ret = {}
    ret.allplayerthrowinfo = app.allplayerthrowinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setairdropboxinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.airdropboxinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }	
}

app.getairdropboxinfo = function(request, response) {
    let ret = {}
    ret.airdropboxinfo = app.airdropboxinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.settdmresultinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.tdmresultinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }	
}

app.gettdmresultinfo = function(request, response) {
    let ret = {}
    ret.tdmresultinfo = app.tdmresultinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setplayersaminfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
		
        request.on('end', () => {
            let obj = JSON.parse(body);
			app.playersaminfo.unshift(obj);
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }
}

app.getplayersaminfo = function(request, response) {
    let ret = {}
    ret.playersaminfo = app.playersaminfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

app.setplayerssightusageinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.playerssightusageinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }	
}

app.getplayerssightusageinfo = function(request, response) {
    let ret = {}
    ret.playerssightusageinfo = app.playerssightusageinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}


app.setplayerpickupinfo = function(request, response) {
    if(request.method == "POST") {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            let obj = JSON.parse(body);
			app.playerpickupinfo = obj;
            console.log(obj);

            response.write('ok');
            response.end();
        });
    } else {
        response.end();
    }	
}

app.getplayerpickupinfo = function(request, response) {
    let ret = {}
    ret.playerpickupinfo = app.playerpickupinfo;

    let resStr = JSON.stringify(ret);
    console.log(resStr);

    response.write(resStr);
    response.end();
}

var httpserver = http.createServer(
    function(request,response){
        let clientRequestPath = url.parse(request.url).pathname;
        console.log(util.format('[%s] %s %s', Datetime(), request.method, clientRequestPath));
        
        let handle = app[clientRequestPath.substring(1, clientRequestPath.length)];
        if (handle) {
            handle(request, response);
        } else {
            console.log('[Error]: handle not found');
        }
    }
);

httpserver.listen(10086);

