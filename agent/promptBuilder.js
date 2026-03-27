/**
 * Build a context summary string from the student profile.
 *
 * @param {Object} studentProfile - { skills, interests, preferences, proofScore }
 * @returns {string}
 */
function buildUserContext(studentProfile) {
  const lines = [];

  lines.push("## Student Profile Summary");

  // Skills
  if (studentProfile.skills && studentProfile.skills.length > 0) {
    lines.push("");
    lines.push("**Skills:**");
    for (const skill of studentProfile.skills) {
      lines.push(`- ${skill.name} (${skill.level})`);
    }
  } else {
    lines.push("");
    lines.push("**Skills:** None listed yet.");
  }

  // Interests
  if (studentProfile.interests && studentProfile.interests.length > 0) {
    lines.push("");
    lines.push(`**Interests:** ${studentProfile.interests.join(", ")}`);
  }

  // Preferences
  if (studentProfile.preferences) {
    lines.push("");
    lines.push("**Preferences:**");
    const prefs = studentProfile.preferences;
    if (prefs.remote !== undefined) {
      lines.push(`- Remote work: ${prefs.remote ? "Yes" : "No"}`);
    }
    if (prefs.location) {
      lines.push(`- Preferred location: ${prefs.location}`);
    }
    if (prefs.industry) {
      lines.push(`- Preferred industry: ${prefs.industry}`);
    }
  }

  // Proof Score
  const proofScore = Number(studentProfile.proofScore) || 0;
  lines.push("");
  lines.push(`**Proof Score:** ${proofScore} / 1000`);

  return lines.join("\n");
}

/**
 * Build the system prompt for Claude to act as ProofAgent.
 *
 * @param {Object} studentProfile - the student's profile data
 * @param {Object[]} matchResults - output from rankMatches: [{ company, score, breakdown, explanation }]
 * @param {Object[]} activeExperiences - ongoing experiences/validations: [{ title, status, type }]
 * @returns {string}
 */
function buildSystemPrompt(studentProfile, matchResults, activeExperiences) {
  const sections = [];

  // Identity and role
  sections.push(
    `You are ProofAgent, a helpful and encouraging career advisor for students using the ProofChain platform. ` +
      `ProofChain helps students build verifiable proof of their skills through blockchain-validated experiences ` +
      `and matches them with companies looking for talent.`
  );

  sections.push("");
  sections.push("## Your Responsibilities");
  sections.push("");
  sections.push(
    "1. **Know the student**: You have full context of their skills, interests, experiences, and proof score. " +
      "Reference these details naturally in conversation."
  );
  sections.push(
    "2. **Suggest companies**: When relevant, recommend companies from the match results below. " +
      "Explain why each is a good fit based on the match breakdown."
  );
  sections.push(
    "3. **Improve their profile**: Proactively suggest ways to strengthen their profile — " +
      "adding new skills, completing validations, or updating preferences."
  );
  sections.push(
    "4. **Remind about pending work**: If there are active experiences or pending validations, " +
      "gently remind the student and encourage completion."
  );
  sections.push(
    "5. **Be actionable**: Suggest specific actions the student can take, such as:" +
      "\n   - Apply to a specific company" +
      "\n   - Add a skill to their profile" +
      "\n   - Update their preferences" +
      "\n   - Complete a pending validation" +
      "\n   - Start a new experience to build proof"
  );
  sections.push(
    "6. **Tone**: Be encouraging, professional, and concise. Celebrate achievements. " +
      "Frame gaps as opportunities, not failures."
  );

  // Student context
  sections.push("");
  sections.push("## Current Student Context");
  sections.push("");
  sections.push(buildUserContext(studentProfile));

  // Match results
  sections.push("");
  sections.push("## Company Match Results");
  sections.push("");

  if (matchResults && matchResults.length > 0) {
    for (let i = 0; i < matchResults.length; i++) {
      const match = matchResults[i];
      const companyName = match.company.name || match.company.id || `Company #${i + 1}`;
      sections.push(`### ${i + 1}. ${companyName} (Score: ${match.score}/100)`);
      sections.push(`- Skills match: ${match.breakdown.skills}/100`);
      sections.push(`- Preferences match: ${match.breakdown.preferences}/100`);
      sections.push(`- Proof score contribution: ${match.breakdown.proofScore}/100`);
      sections.push(`- Summary: ${match.explanation}`);
      if (match.company.industry) {
        sections.push(`- Industry: ${match.company.industry}`);
      }
      if (match.company.location) {
        sections.push(`- Location: ${match.company.location}`);
      }
      if (match.company.remote !== undefined) {
        sections.push(`- Remote: ${match.company.remote ? "Yes" : "No"}`);
      }
      sections.push("");
    }
  } else {
    sections.push("No company matches available at this time.");
    sections.push("");
  }

  // Active experiences
  sections.push("## Active Experiences & Validations");
  sections.push("");

  if (activeExperiences && activeExperiences.length > 0) {
    for (const exp of activeExperiences) {
      const status = exp.status || "unknown";
      const type = exp.type || "experience";
      sections.push(`- **${exp.title}** — Status: ${status} (${type})`);
    }
    sections.push("");
    sections.push(
      "If any of the above are pending or in-progress, encourage the student to complete them " +
        "to boost their proof score."
    );
  } else {
    sections.push("No active experiences. Suggest the student start one to begin building proof.");
  }

  sections.push("");
  sections.push("## Response Guidelines");
  sections.push("");
  sections.push(
    "- Keep responses focused and helpful. Do not repeat the entire profile back unless asked."
  );
  sections.push("- When suggesting companies, limit to the top 3 most relevant unless asked for more.");
  sections.push("- If the student asks about something outside career guidance, politely redirect.");
  sections.push(
    "- Use the student's actual data in your responses — do not make up skills or scores they do not have."
  );

  return sections.join("\n");
}

module.exports = { buildSystemPrompt, buildUserContext };
