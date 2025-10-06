// ---- Unit conversion helpers ----
export const KG_PER_LB = 0.45359237;
export const LB_PER_KG = 1 / KG_PER_LB;
export const CM_PER_IN = 2.54;

export const kgToLbs = (kg) => (Number.isFinite(+kg) ? +kg * LB_PER_KG : NaN);
export const lbsToKg = (lbs) => (Number.isFinite(+lbs) ? +lbs * KG_PER_LB : NaN);
export const cmToFtIn = (cm) => {
  const totalInches = Number.isFinite(+cm) ? +cm / CM_PER_IN : NaN;
  if (!Number.isFinite(totalInches)) return { feet: 0, inches: 0 };
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
};

// ---- Normalizers ----
export const getSurgeryWeightInKg = (surgeryWeight, weightUnit) => {
  const w = parseFloat(surgeryWeight);
  if (!Number.isFinite(w)) return null;
  return weightUnit === 'lbs' ? lbsToKg(w) : w;
};

export const getHeightInCm = (height, heightUnit) => {
  const h = parseFloat(height);
  if (!Number.isFinite(h)) return null;
  return heightUnit === 'in' ? h * CM_PER_IN : h;
};

// ---- BMI ----
/**
 * Calculate BMI given weight & height with explicit units.
 * Returns a number (kg/m^2) or null if inputs invalid.
 */
export const calculateBMI = (weight, height, weightUnit = 'kg', heightUnit = 'cm') => {
  if (weight == null || height == null) return null;

  // Normalize to metric
  let weightKg = parseFloat(weight);
  let heightCm = parseFloat(height);
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return null;

  if (weightUnit === 'lbs') weightKg = lbsToKg(weightKg);
  if (heightUnit === 'in') heightCm = heightCm * CM_PER_IN;

  const heightM = heightCm / 100;
  if (heightM <= 0) return null;

  return weightKg / (heightM * heightM);
};

// ---- Expected weight trajectory ----
// Piecewise % loss by months since surgery; clamped to [0, cap].
const percentLossByMonths = (months, surgeryType) => {
  let p = 0;
  if (surgeryType === 'Gastric Bypass') {
    if (months <= 1) p = 0.10 * months;
    else if (months <= 3) p = 0.10 + (0.15 * (months - 1) / 2);
    else if (months <= 6) p = 0.25 + (0.25 * (months - 3) / 3);
    else p = 0.50;
  } else if (surgeryType === 'Gastric Sleeve') {
    if (months <= 1) p = 0.08 * months;
    else if (months <= 3) p = 0.08 + (0.12 * (months - 1) / 2);
    else if (months <= 6) p = 0.20 + (0.25 * (months - 3) / 3);
    else p = 0.45;
  } else if (surgeryType === 'Duodenal Switch (BPD-DS)') {
    if (months <= 1) p = 0.12 * months;
    else if (months <= 3) p = 0.12 + (0.23 * (months - 1) / 2);
    else if (months <= 6) p = 0.35 + (0.35 * (months - 3) / 3);
    else p = 0.70;
  }
  // Clamp and floor at 0
  if (!Number.isFinite(p) || p < 0) p = 0;
  return Math.min(p, 0.99); // avoid reaching/going below 0 weight numerically
};

/**
 * Calculate expected weight at a given timepoint.
 * @param {number} weeks since surgery
 * @param {number|string} surgeryWeight starting weight (unit given by weightUnit)
 * @param {'lbs'|'kg'} weightUnit
 * @param {'Gastric Bypass'|'Gastric Sleeve'|'Duodenal Switch (BPD-DS)'} surgeryType
 * @returns number in the SAME unit as weightUnit
 */
export const calculateExpectedWeight = (weeks, surgeryWeight, weightUnit, surgeryType) => {
  const startKg = getSurgeryWeightInKg(surgeryWeight, weightUnit);
  if (!Number.isFinite(startKg)) return null;

  const months = Math.max(0, (+weeks) / 4.33);
  const expectedLossPct = percentLossByMonths(months, surgeryType);
  const expectedKg = startKg * (1 - expectedLossPct);

  return weightUnit === 'lbs' ? kgToLbs(expectedKg) : expectedKg;
};

// ---- Formatters ----
export const formatWeight = (weight, weightUnit) => {
  const w = parseFloat(weight);
  if (!Number.isFinite(w)) return 'No data';
  return `${w.toFixed(1)} ${weightUnit}`;
};

export const formatPercentageLoss = (percentage) => {
  const p = parseFloat(percentage);
  if (!Number.isFinite(p)) return '0%';
  return `${Math.max(0, p).toFixed(1)}%`;
};

export const formatHeight = (height, heightUnit) => {
  if (height == null || height === '') return '';
  if (heightUnit === 'cm') {
    const h = parseFloat(height);
    return Number.isFinite(h) ? `${h.toFixed(1)} cm` : '';
  }
  // stored as total inches
  const totalInches = parseFloat(height);
  if (!Number.isFinite(totalInches)) return '';
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
};
