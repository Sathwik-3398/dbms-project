// Smart Book Valuation Algorithm
const calculateBookValue = (bookData) => {
  const {
    condition,
    originalPrice = 10,
    publicationYear,
    views = 0,
    favorites = 0
  } = bookData;

  // Condition factor (30% weight)
  const conditionScores = {
    'new': 1.0,
    'like-new': 0.85,
    'good': 0.65,
    'fair': 0.45,
    'poor': 0.25
  };
  const conditionScore = conditionScores[condition] || 0.5;

  // Age depreciation factor (20% weight)
  const currentYear = new Date().getFullYear();
  const age = publicationYear ? currentYear - publicationYear : 0;
  const ageDepreciation = Math.max(0.4, 1 - (age * 0.05));

  // Market demand factor (25% weight)
  const demandScore = Math.min(1, (views * 0.01 + favorites * 0.05) / 10);
  const marketDemand = 0.5 + (demandScore * 0.5); // Range: 0.5 to 1.0

  // Rarity factor (15% weight) - simplified
  const rarityScore = publicationYear && publicationYear < 1980 ? 1.2 : 1.0;

  // Calculate weighted value
  const estimatedValue = originalPrice * 
    (conditionScore * 0.30 + 
     ageDepreciation * 0.20 + 
     marketDemand * 0.25 + 
     rarityScore * 0.15 + 
     0.10); // Base 10% of original price

  return Math.round(estimatedValue * 100) / 100;
};

module.exports = calculateBookValue;
