// Fetches current NBA standings and updates RAW_FB in index.html
// Runs daily via GitHub Actions

const fs = require('fs');
const path = require('path');

async function main() {
  const res = await fetch('https://site.api.espn.com/apis/v2/sports/basketball/nba/standings', {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
  });
  if (!res.ok) throw new Error(`ESPN API returned ${res.status}`);
  const data = await res.json();

  const teams = [];
  for (const group of (data.children || [])) {
    const conf = (group.abbreviation || group.name || '').toLowerCase().includes('east') ? 'E' : 'W';
    for (const entry of (group.standings?.entries || [])) {
      const t = entry.team || {};
      if (!t.displayName) continue;
      const stats = Object.fromEntries((entry.stats || []).map(s => [s.name, s.value]));
      teams.push({
        abbr:   t.abbreviation || t.displayName.slice(0, 3).toUpperCase(),
        teamId: parseInt(t.id) || 0,
        city:   t.location || '',
        name:   t.name || '',
        conf,
        wins:   Math.round(stats.wins ?? 0),
        losses: Math.round(stats.losses ?? 0),
      });
    }
  }

  if (teams.length < 18) throw new Error(`Only got ${teams.length} teams — aborting`);

  teams.sort((a, b) => b.losses !== a.losses ? b.losses - a.losses : a.wins - b.wins);
  const lottery = teams.slice(0, 18);

  // Build replacement string
  const maxCityLen  = Math.max(...lottery.map(t => t.city.length));
  const maxNameLen  = Math.max(...lottery.map(t => t.name.length));
  const rows = lottery.map(t => {
    const cityPad = ' '.repeat(maxCityLen - t.city.length);
    const namePad = ' '.repeat(maxNameLen - t.name.length);
    return `  {abbr:'${t.abbr}',teamId:${t.teamId},city:'${t.city}',${cityPad}name:'${t.name}',${namePad}conf:'${t.conf}',wins:${t.wins},losses:${t.losses}}`;
  });
  const replacement = `const RAW_FB=[\n${rows.join(',\n')},\n];`;

  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const updated = html.replace(/const RAW_FB=\[[\s\S]*?\];/, replacement);

  if (updated === html) throw new Error('RAW_FB pattern not found in index.html');

  fs.writeFileSync(htmlPath, updated, 'utf8');
  console.log(`Updated RAW_FB with ${lottery.length} teams (${new Date().toISOString()})`);
  lottery.forEach((t, i) => console.log(`  ${i + 1}. ${t.city} ${t.name} ${t.wins}-${t.losses}`));
}

main().catch(err => { console.error(err.message); process.exit(1); });
