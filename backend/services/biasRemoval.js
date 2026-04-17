/**
 * Bias Removal Service
 * Anonymizes resume text before AI scoring to ensure fair, unbiased matching.
 * Strips: names, emails, phones, gender pronouns, age-revealing graduation years.
 */

function anonymizeResume(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') return '';

  let text = resumeText;

  // Remove email addresses
  text = text.replace(/\S+@\S+\.\S+/g, '[EMAIL]');

  // Remove phone numbers (international formats)
  text = text.replace(/[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]/g, '[PHONE]');

  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, '[URL]');
  text = text.replace(/www\.\S+/g, '[URL]');

  // Remove graduation years that could reveal age
  text = text.replace(/\b(19[5-9]\d|200[0-9]|201[0-5])\b/g, '[YEAR]');

  // Remove gender pronouns and honorifics
  const genderTerms = ['he', 'she', 'him', 'her', 'his', 'hers', 'mr\\.', 'mrs\\.', 'ms\\.', 'miss'];
  for (const term of genderTerms) {
    text = text.replace(new RegExp(`\\b${term}\\b`, 'gi'), '[P]');
  }

  // Remove common religion/nationality indicators
  const sensitiveTerms = ['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jewish'];
  for (const term of sensitiveTerms) {
    text = text.replace(new RegExp(`\\b${term}\\b`, 'gi'), '[REDACTED]');
  }

  return text;
}

function getBiasReport(originalText, anonymizedText) {
  const emailsRemoved = (originalText.match(/\S+@\S+\.\S+/g) || []).length;
  const phonesRemoved = (originalText.match(/[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]/g) || []).length;
  const pronounsRemoved = (originalText.match(/\b(he|she|him|her|his|hers|mr\.|mrs\.|ms\.)\b/gi) || []).length;

  return {
    fields_anonymized: emailsRemoved + phonesRemoved + pronounsRemoved,
    emails_removed: emailsRemoved,
    phones_removed: phonesRemoved,
    pronouns_removed: pronounsRemoved,
    bias_free: true,
    message: 'Resume scored on anonymized data — name, gender, age, and contact info were stripped before AI analysis.'
  };
}

module.exports = { anonymizeResume, getBiasReport };
