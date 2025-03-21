#!/bin/bash

# Define the endpoint URL
URL="http://localhost:10086/totalmessage"

# Function to generate the payload with a dynamic killNum value
generate_payload() {
  local kill_num=$1
  cat <<EOF
{
  "TotalPlayerList": [
    {
      "uId": 5623694881,
      "playerName": "NV・ILAHI786",
      "playerOpenId": "38147617599128872",
      "picUrl": "",
      "showPicUrl": false,
      "teamId": 15,
      "teamName": "NV 786",
      "character": "None",
      "isFiring": false,
      "bHasDied": false,
      "location": [null],
      "health": 0,
      "healthMax": 100,
      "liveState": 5,
      "killNum": $kill_num,
      "killNumBeforeDie": 0,
      "playerKey": 3820785733,
      "gotAirDropNum": 0,
      "maxKillDistance": 0,
      "damage": 90,
      "killNumInVehicle": 0,
      "killNumByGrenade": 0,
      "AIKillNum": 0,
      "BossKillNum": 0,
      "rank": 20,
      "isOutsideBlueCircle": false,
      "inDamage": 198,
      "heal": 0,
      "headShotNum": 0,
      "survivalTime": 6,
      "driveDistance": 0,
      "marchDistance": 14,
      "assists": 1,
      "outsideBlueCircleTime": 0,
      "knockouts": 0,
      "rescueTimes": 0,
      "useSmokeGrenadeNum": 0,
      "useFragGrenadeNum": 0,
      "useBurnGrenadeNum": 0,
      "useFlashGrenadeNum": 0,
      "PoisonTotalDamage": 0,
      "UseSelfRescueTime": 0,
      "UseEmergencyCallTime": 0
    },
    {
      "uId": 5770137746,
      "playerName": "DDx丨NeroGZ",
      "playerOpenId": "46928788696991016",
      "picUrl": "",
      "showPicUrl": false,
      "teamId": 4,
      "teamName": "DDX GODZ CLUB",
      "character": "None",
      "isFiring": false,
      "bHasDied": false,
      "location": [null],
      "health": 0,
      "healthMax": 100,
      "liveState": 5,
      "killNum": $kill_num,
      "killNumBeforeDie": 0,
      "playerKey": 1652310847,
      "gotAirDropNum": 0,
      "maxKillDistance": 0,
      "damage": 54,
      "killNumInVehicle": 0,
      "killNumByGrenade": 0,
      "AIKillNum": 0,
      "BossKillNum": 0,
      "rank": 17,
      "isOutsideBlueCircle": false,
      "inDamage": 194,
      "heal": 0,
      "headShotNum": 0,
      "survivalTime": 323,
      "driveDistance": 1056,
      "marchDistance": 680,
      "assists": 0,
      "outsideBlueCircleTime": 0,
      "knockouts": 0,
      "rescueTimes": 0,
      "useSmokeGrenadeNum": 0,
      "useFragGrenadeNum": 0,
      "useBurnGrenadeNum": 0,
      "useFlashGrenadeNum": 0,
      "PoisonTotalDamage": 0,
      "UseSelfRescueTime": 0,
      "UseEmergencyCallTime": 0
    }
  ],
  "TeamInfoList": [
    {
      "teamId": 15,
      "teamName": "NV 786",
      "isShowLogo": false,
      "logoPicUrl": "",
      "killNum": $kill_num,
      "liveMemberNum": 0
    },
    {
      "teamId": 4,
      "teamName": "DDX GODZ CLUB",
      "isShowLogo": false,
      "logoPicUrl": "",
      "killNum": $kill_num,
      "liveMemberNum": 0
    }
  ],
  "GameStartTime": "1738780886",
  "FightingStartTime": "0",
  "FinishedStartTime": "1738782562",
  "GameID": "2860125894379991697",
  "CurrentTime": "1738782561"
}
EOF
}

# Loop to send 10 requests per second for a total of 10 requests
for i in $(seq 1 50); do
  # Create the payload with the current iteration as the killNum value
  PAYLOAD=$(generate_payload $i)

  # Send the POST request using curl
  curl -X POST $URL \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" &

  # Sleep for 0.1 seconds to make 10 requests per second
  sleep 0.02
done
