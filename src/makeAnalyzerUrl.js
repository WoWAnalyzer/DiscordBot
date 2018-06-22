import getFightName from './common/getFightName';

export default function makeAnalyzerUrl(report, reportCode, fightId = null, playerId = null) {
  const url = [
    `https://wowanalyzer.com/report/${reportCode}`,
  ];

  if (fightId) {
    const fight = fightId === 'last' ? report.fights[report.fights.length - 1] : report.fights.find(fight => fight.id === Number(fightId));
    // Fight can be undefined if WoWAnalyzer cached the fights list and this link is for a newer report (or the id is just wrong)
    if (fight) {
      const fightName = getFightName(report, fight);
      url.push(`${fight.id}-${encodeURI(fightName).replace(/%20/g, '+')}`);
      if (playerId) {
        const player = report.friendlies.find(player => player.id === Number(playerId));
        url.push(player ? `${playerId}-${player.name}` : playerId);
      }
    }
  }
  return url.join('/');
}
