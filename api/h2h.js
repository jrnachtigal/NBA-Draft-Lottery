// api/h2h.js
// Returns current-season H2H record between two teams for tiebreak resolution
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=3600');

  const { teamA, teamB } = req.query;
  if (!teamA || !teamB) {
    return res.status(400).json({ success: false, error: 'teamA and teamB required' });
  }

  const SEASON = '2025-26';

  try {
    const url =
      `https://stats.nba.com/stats/leaguegamefinder` +
      `?PlayerOrTeam=T&TeamID=${teamA}&Season=${SEASON}&SeasonType=Regular+Season` +
      `&LeagueID=00&VsTeamID=${teamB}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.nba.com',
        'Referer': 'https://www.nba.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true',
      },
    });

    if (!response.ok) throw new Error(`NBA API ${response.status}`);

    const data = await response.json();
    const rs = data.resultSets[0];
    const WL = rs.headers.indexOf('WL');
    let wins = 0, losses = 0;
    rs.rowSet.forEach(row => {
      if (row[WL] === 'W') wins++;
      else if (row[WL] === 'L') losses++;
    });

    const games = wins + losses;
    let winner = null;
    let status = games === 0 ? 'no_games' : wins > losses ? 'complete' : losses > wins ? 'complete' : 'tied';
    if (status === 'complete') winner = wins > losses ? parseInt(teamA) : parseInt(teamB);

    return res.status(200).json({
      success: true,
      teamA: parseInt(teamA), teamB: parseInt(teamB),
      teamAWins: wins, teamALosses: losses,
      gamesPlayed: games, winner, status,
    });

  } catch (err) {
    console.error('H2H error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
