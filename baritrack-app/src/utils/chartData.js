import { calculateExpectedWeight } from './calculations';

// Generate chart data with daily/weekly options
export const generateChartData = (chartTimeframe, currentDay, userData, weightEntries) => {
  const data = [];
  const startWeight = parseFloat(userData.surgeryWeight);

  if (chartTimeframe === 'daily') {
    const maxDays = Math.max(currentDay + 30, 30);
    for (let day = 0; day <= maxDays; day++) {
      const weeks = day / 7;
      const expectedWeight = calculateExpectedWeight(weeks, userData.surgeryWeight, userData.weightUnit, userData.surgeryType);

      let actualEntry = weightEntries.find(entry => entry.day === day);
      let actualWeight = null;

      if (day === 0) {
        actualWeight = startWeight;
      } else {
        actualWeight = actualEntry ? actualEntry.weight : null;
      }

      data.push({
        timepoint: day,
        timeLabel: `Day ${day}`,
        expectedWeight: day === 0 ? startWeight : expectedWeight,
        actualWeight: actualWeight
      });
    }
  } else {
    const currentWeek = Math.floor(currentDay / 7);
    const maxWeeks = Math.max(currentWeek + 4, 26);
    for (let week = 0; week <= maxWeeks; week++) {
      const expectedWeight = calculateExpectedWeight(week, userData.surgeryWeight, userData.weightUnit, userData.surgeryType);

      let actualEntry = weightEntries.find(entry => entry.week === week);
      let actualWeight = null;

      if (week === 0) {
        actualWeight = startWeight;
      } else {
        actualWeight = actualEntry ? actualEntry.weight : null;
      }

      data.push({
        timepoint: week,
        timeLabel: `Week ${week}`,
        expectedWeight: week === 0 ? startWeight : expectedWeight,
        actualWeight: actualWeight
      });
    }
  }

  return data;
};

// Check if user is off track
export const isOffTrack = (currentDay, userData, weightEntries) => {
  const currentWeek = Math.floor(currentDay / 7);
  const latestEntry = weightEntries.find(entry => entry.week === currentWeek);

  if (!latestEntry) return false;

  const expectedWeight = calculateExpectedWeight(currentWeek, userData.surgeryWeight, userData.weightUnit, userData.surgeryType);
  const actualWeight = latestEntry.weight;
  const deviation = ((actualWeight - expectedWeight) / expectedWeight) * 100;

  return deviation >= 15;
};
