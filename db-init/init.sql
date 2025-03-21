#DROP DATABASE pubg;
#CREATE DATABASE pubg;
CREATE DATABASE IF NOT EXISTS pubg;

USE pubg;

CREATE TABLE tournaments (
  tournament_id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_rounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id VARCHAR(255) NOT NULL,
  tournament_id INT,
  game_name VARCHAR(255),
  started_at DATETIME,
  is_ended BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE INDEX idx_game_id ON game_rounds(game_id);

CREATE TABLE totalmessage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  u_id VARCHAR(255) NOT NULL,
  player_name VARCHAR(255) NOT NULL,
  team_id INT NOT NULL,
  kill_num INT DEFAULT 0,
  damage INT DEFAULT 0,
  rank INT DEFAULT 0,
  heal INT DEFAULT 0,
  health INT DEFAULT 100,
  assists INT DEFAULT 0,
  knockouts INT DEFAULT 0,
  kill_num_in_vehicle INT DEFAULT 0,
  kill_num_by_grenade INT DEFAULT 0,
  game_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (game_id) REFERENCES game_rounds(game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE totalmessage ADD CONSTRAINT unique_u_id_game_id UNIQUE (u_id, game_id);


CREATE TABLE team_rankings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  kill_num INT DEFAULT 0,
  rank INT DEFAULT 0,
  pts INT DEFAULT 0,
  total INT DEFAULT 0,
  game_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (game_id) REFERENCES game_rounds(game_id),
  CONSTRAINT unique_team_game_id UNIQUE (team_id, game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
