const SKILL_LEVELS = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

const WEIGHTS = {
  skills: 0.5,
  preferences: 0.3,
  proofScore: 0.2,
};

const MAX_PROOF_SCORE = 1000;

/**
 * Convert a skill level string to its numeric value.
 * Returns 0 for unrecognized levels.
 */
function levelToNumber(level) {
  if (typeof level === "number") return level;
  return SKILL_LEVELS[String(level).toLowerCase()] || 0;
}

/**
 * Calculate the skills sub-score (0-100).
 * For each required skill, check if the student has it.
 * Full credit if student level >= required level.
 * Partial credit (proportional) if student has the skill at a lower level.
 * Zero credit if student lacks the skill entirely.
 */
function scoreSkills(studentSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { score: 100, details: [] };
  }

  const studentMap = new Map();
  for (const s of studentSkills || []) {
    studentMap.set(s.name.toLowerCase(), s);
  }

  let totalPoints = 0;
  const maxPoints = requiredSkills.length;
  const details = [];

  for (const req of requiredSkills) {
    const key = req.name.toLowerCase();
    const reqLevel = levelToNumber(req.level);
    const student = studentMap.get(key);

    if (!student) {
      details.push({ skill: req.name, required: req.level, has: null, credit: 0 });
      continue;
    }

    const studentLevel = levelToNumber(student.level);

    if (studentLevel >= reqLevel) {
      totalPoints += 1;
      details.push({ skill: req.name, required: req.level, has: student.level, credit: 1 });
    } else {
      const partial = reqLevel > 0 ? studentLevel / reqLevel : 0;
      totalPoints += partial;
      details.push({ skill: req.name, required: req.level, has: student.level, credit: partial });
    }
  }

  const score = Math.round((totalPoints / maxPoints) * 100);
  return { score, details };
}

/**
 * Calculate the preferences sub-score (0-100).
 * Checks remote match, location match, and industry overlap.
 * Each factor is weighted equally (1/3 each).
 */
function scorePreferences(studentPrefs, companyProfile) {
  if (!studentPrefs) {
    return { score: 50, details: {} };
  }

  let points = 0;
  let factors = 0;
  const details = {};

  // Remote match
  factors++;
  if (studentPrefs.remote === undefined || studentPrefs.remote === companyProfile.remote) {
    points++;
    details.remote = true;
  } else {
    details.remote = false;
  }

  // Location match
  factors++;
  if (
    !studentPrefs.location ||
    !companyProfile.location ||
    studentPrefs.location.toLowerCase() === companyProfile.location.toLowerCase()
  ) {
    points++;
    details.location = true;
  } else {
    details.location = false;
  }

  // Industry overlap
  factors++;
  if (
    !studentPrefs.industry ||
    !companyProfile.industry ||
    studentPrefs.industry.toLowerCase() === companyProfile.industry.toLowerCase()
  ) {
    points++;
    details.industry = true;
  } else {
    details.industry = false;
  }

  const score = Math.round((points / factors) * 100);
  return { score, details };
}

/**
 * Normalize proof score from 0-1000 range to 0-100.
 */
function scoreProof(proofScore) {
  const raw = Number(proofScore) || 0;
  const clamped = Math.max(0, Math.min(raw, MAX_PROOF_SCORE));
  return Math.round((clamped / MAX_PROOF_SCORE) * 100);
}

/**
 * Build a human-readable explanation of the match.
 */
function buildExplanation(skillResult, prefResult, proofNormalized, finalScore) {
  const parts = [];

  if (finalScore >= 80) {
    parts.push("Strong match overall.");
  } else if (finalScore >= 60) {
    parts.push("Good match with some gaps.");
  } else if (finalScore >= 40) {
    parts.push("Moderate match — consider upskilling.");
  } else {
    parts.push("Weak match — significant gaps exist.");
  }

  // Skills detail
  const missing = skillResult.details.filter((d) => d.has === null);
  const partial = skillResult.details.filter((d) => d.has !== null && d.credit < 1);

  if (missing.length > 0) {
    parts.push(`Missing skills: ${missing.map((d) => d.skill).join(", ")}.`);
  }
  if (partial.length > 0) {
    parts.push(
      `Skills needing improvement: ${partial.map((d) => `${d.skill} (have ${d.has}, need ${d.required})`).join(", ")}.`
    );
  }
  if (missing.length === 0 && partial.length === 0 && skillResult.details.length > 0) {
    parts.push("All required skills met or exceeded.");
  }

  // Preferences detail
  const prefMisses = [];
  if (prefResult.details.remote === false) prefMisses.push("remote preference");
  if (prefResult.details.location === false) prefMisses.push("location");
  if (prefResult.details.industry === false) prefMisses.push("industry");

  if (prefMisses.length > 0) {
    parts.push(`Preference mismatches: ${prefMisses.join(", ")}.`);
  }

  // Proof score
  if (proofNormalized >= 70) {
    parts.push("Strong proof score backs your profile.");
  } else if (proofNormalized >= 40) {
    parts.push("Building proof score — keep completing validations.");
  } else {
    parts.push("Low proof score — complete more validations to strengthen your profile.");
  }

  return parts.join(" ");
}

/**
 * Compare a student profile against a company profile and return a match result.
 *
 * @param {Object} studentProfile - { skills, interests, preferences, proofScore }
 * @param {Object} companyProfile - { requiredSkills, industry, location, remote, culture }
 * @returns {{ score: number, breakdown: { skills: number, preferences: number, proofScore: number }, explanation: string }}
 */
function calculateMatch(studentProfile, companyProfile) {
  const skillResult = scoreSkills(studentProfile.skills, companyProfile.requiredSkills);
  const prefResult = scorePreferences(studentProfile.preferences, companyProfile);
  const proofNormalized = scoreProof(studentProfile.proofScore);

  const weightedScore = Math.round(
    skillResult.score * WEIGHTS.skills +
      prefResult.score * WEIGHTS.preferences +
      proofNormalized * WEIGHTS.proofScore
  );

  const finalScore = Math.max(0, Math.min(100, weightedScore));

  const explanation = buildExplanation(skillResult, prefResult, proofNormalized, finalScore);

  return {
    score: finalScore,
    breakdown: {
      skills: skillResult.score,
      preferences: prefResult.score,
      proofScore: proofNormalized,
    },
    explanation,
  };
}

/**
 * Rank multiple companies against a student profile, sorted by score descending.
 *
 * @param {Object} studentProfile
 * @param {Object[]} companies - array of company profiles
 * @returns {{ company: Object, score: number, breakdown: Object, explanation: string }[]}
 */
function rankMatches(studentProfile, companies) {
  if (!companies || companies.length === 0) return [];

  const results = companies.map((company) => {
    const { score, breakdown, explanation } = calculateMatch(studentProfile, company);
    return { company, score, breakdown, explanation };
  });

  results.sort((a, b) => b.score - a.score);
  return results;
}

module.exports = { calculateMatch, rankMatches };
