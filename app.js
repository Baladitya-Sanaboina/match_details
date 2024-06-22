const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
let db = null
const path = require('path')
const dbPath = path.join(__dirname, 'cricketMatchDetails.db')

const connectDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.driver,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
  }
}
connectDbAndServer()

const convertPlayerDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  }
}

const convertMatchDbOvjectToResponseObject = dbObject => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT * FROM player_details`
  const playersArray = await db.all(getPlayersQuery)
  response.send(
    playersArray.map(eachItem =>
      convertPlayerDbObjectToResponseObject(eachItem),
    ),
  )
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  SELECT * FROM player_details WHERE player_id = ${playerId}`
  const playerArray = await db.get(getPlayerQuery)
  response.send(convertPlayerDbObjectToResponseObject(playerArray))
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName} = playerDetails
  const updatePlayerQuery = `
  UPDATE player_details
  SET player_name =${playerName}`
  await db.run(updatePlayerQuery)
  response.send('Player Detaiilis Updated')
})

app.get('/matches/:matchId', async (request, response) => {
  const {matchId} = request.params
  const getMatchQuery = `
  SELECT * FROM match_details WHERE match_id = ${matchId}
  `
  const getMatchArray = db.get(getMatchQuery)
  response.send(convertMatchDbOvjectToResponseObject(getMatchArray))
})

app.get('/players/:playerId/matches', async (request, response) => {
  const {playerId} = request.params
  const getMatches = `
  SELECT * FROM match_details WHERE match_id = ${matchId}`
  const matchesArray = db.all(getMatches)
  response.send(
    matchesArray.map(eachItem =>
      convertMatchDbOvjectToResponseObject(eachItem),
    ),
  )
})
