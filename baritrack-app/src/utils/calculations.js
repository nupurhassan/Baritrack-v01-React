// Unit conversion functions
export const kgToLbs = (kg) => kg * 2.20462;
export const lbsToKg = (lbs) => lbs / 2.20462;
export const cmToFtIn = (cm) => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return { feet, inches: remainingInches };
};

// Get surgery weight in kg for calculations
export const getSurgeryWeightInKg = (surgeryWeight, weightUnit) => {
  const weight = parseFloat(surgeryWeight);
  return weightUnit === 'lbs' ? lbsToKg(weight) : weight;
};

// Calculate BMI
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Calculate expected weight based on surgery type and time
export const calculateExpectedWeight = (weeks, surgeryWeight, weightUnit, surgeryType) => {
  const startWeightKg = getSurgeryWeightInKg(surgeryWeight, weightUnit);
  if (!startWeightKg) return startWeightKg;

  const months = weeks / 4.33;
  let expectedLossPercentage = 0;

  if (surgeryType === 'Gastric Bypass') {
    if (months <= 1) expectedLossPercentage = 0.10 * months;
    else if (months <= 3) expectedLossPercentage = 0.10 + (0.15 * (months - 1) / 2);
    else if (months <= 6) expectedLossPercentage = 0.25 + (0.25 * (months - 3) / 3);
    else expectedLossPercentage = 0.50;
  } else if (surgeryType === 'Gastric Sleeve') {
    if (months <= 1) expectedLossPercentage = 0.08 * months;
    else if (months <= 3) expectedLossPercentage = 0.08 + (0.12 * (months - 1) / 2);
    else if (months <= 6) expectedLossPercentage = 0.20 + (0.25 * (months - 3) / 3);
    else expectedLossPercentage = 0.45;
  } else if (surgeryType === 'Duodenal Switch (BPD-DS)') {
    if (months <= 1) expectedLossPercentage = 0.12 * months;
    else if (months <= 3) expectedLossPercentage = 0.12 + (0.23 * (months - 1) / 2);
    else if (months <= 6) expectedLossPercentage = 0.35 + (0.35 * (months - 3) / 3);
    else expectedLossPercentage = 0.70;
  }

  const expectedWeightKg = startWeightKg - (startWeightKg * expectedLossPercentage);
  return weightUnit === 'lbs' ? kgToLbs(expectedWeightKg) : expectedWeightKg;
};

// Format weight display
export const formatWeight = (weight, weightUnit) => {
  if (!weight) return 'No data';
  return `${weight.toFixed(1)} ${weightUnit}`;
};

// Format percentage loss
export const formatPercentageLoss = (percentage) => {
  if (!percentage) return '0%';
  return `${percentage.toFixed(1)}%`;
};

// Format height display
export const formatHeight = (height, heightUnit) => {
  if (!height) return '';
  if (heightUnit === 'cm') {
    return `${height} cm`;
  } else {
    const heightInCm = heightUnit === 'in' ? parseFloat(height) * 2.54 : parseFloat(height);
    const { feet, inches } = cmToFtIn(heightInCm);
    return `${feet}'${inches}"`;
  }
};
