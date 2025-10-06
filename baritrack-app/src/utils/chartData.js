import { calculateExpectedWeight } from './calculations';

// Build a quick lookup for exact day/week entries
const indexEntries = (entries) => {
  const byDay = new Map();
  const byWeek = new Map();
  for (const e of entries) {
    if (Number.isFinite(+e.day))  byDay.set(+e.day, e);
    if (Number.isFinite(+e.week)) byWeek.set(+e.week, e);
  }
  return { byDay, byWeek };
};

// Generate chart data with daily/weekly options
export const generateChartData = (chartTimeframe, currentDay, userData, weightEntries) => {
  const data = [];
  const startWeight = parseFloat(userData.surgeryWeight);
  const { byDay, byWeek } = indexEntries(weightEntries);

  if (chartTimeframe === 'daily') {
    const maxDays = Math.max(currentDay + 30, 30);
    for (let day = 0; day <= maxDays; day++) {
      const weeks = day / 7;
      const expectedWeight = calculateExpectedWeight(
        weeks,
        userData.surgeryWeight,
        userData.weightUnit,
        userData.surgeryType
      );

      const actualEntry = byDay.get(day) || null;
      const actualWeight = day === 0 ? startWeight : actualEntry?.weight ?? null;

      data.push({
        timepoint: day,
        timeLabel: `Day ${day}`,
        expectedWeight: day === 0 ? startWeight : expectedWeight,
        actualWeight
      });
    }
  } else {
    const currentWeek = Math.floor(currentDay / 7);
    const maxWeeks = Math.max(currentWeek + 4, 26);
    for (let week = 0; week <= maxWeeks; week++) {
      const expectedWeight = calculateExpectedWeight(
        week,
        userData.surgeryWeight,
        userData.weightUnit,
        userData.surgeryType
      );

      const actualEntry = byWeek.get(week) || null;
      const actualWeight = week === 0 ? startWeight : actualEntry?.weight ?? null;

      data.push({
        timepoint: week,
        timeLabel: `Week ${week}`,
        expectedWeight: week === 0 ? startWeight : expectedWeight,
        actualWeight
      });
    }
  }

  return data;
};

// Flag user as "off track" if actual is outside a tolerance band around expected.
// Default band: ±3% of starting weight (or ±5 lbs/kg minimum).
export const isOffTrack = (currentDay, userData, weightEntries, opts = {}) => {
  const { weightUnit, surgeryType, surgeryWeight } = userData;
  const start = parseFloat(surgeryWeight);
  if (!Number.isFinite(start)) return false;

  const currentWeek = Math.floor(currentDay / 7);
  const latest = weightEntries
    .filter(e => Number.isFinite(+e.week) && e.week <= currentWeek)
    .sort((a, b) => b.day - a.day)[0];

  if (!latest) return false;

  const expected = calculateExpectedWeight(currentWeek, surgeryWeight, weightUnit, surgeryType);
  if (!Number.isFinite(expected)) return false;

  const minBandAbs = Math.max(5, 0); // at least ±5 (lbs or kg)
  const pctBand = opts.percentBand ?? 0.03; // 3% of starting weight
  const absBand = Math.max(minBandAbs, start * pctBand);

  return Math.abs(latest.weight - expected) > absBand;
};
