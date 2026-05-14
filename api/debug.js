import { GROUP_SCHEDULE, KO_DATES } from './_schedule.js';

export default function handler(req, res) {
  res.json({
    groupCount: GROUP_SCHEDULE.length,
    koPhases: Object.keys(KO_DATES),
    firstDate: GROUP_SCHEDULE[0]?.date ?? 'missing',
  });
}
