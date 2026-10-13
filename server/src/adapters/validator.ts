export interface ValidationResult {
  isValid: boolean;
  normalizedLinkedinUrl?: string;
  normalizedInstagramUrl?: string;
  linkedinUsername?: string;
  instagramUsername?: string;
  errors: {
    name?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export function validateParticipantInput(name: string, linkedinUrl: string, instagramUrl: string): ValidationResult {
  const errors: { name?: string; linkedin?: string; instagram?: string } = {};

  // Validate Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Participant name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Participant name must be at least 2 characters long.';
  }

  // Validate LinkedIn URL
  if (!linkedinUrl || typeof linkedinUrl !== 'string' || linkedinUrl.trim().length === 0) {
    errors.linkedin = 'LinkedIn URL is required. Both LinkedIn and Instagram are mandatory.';
  } else {
    const trimmedLi = linkedinUrl.trim();
    // Allow http or https, optional www, domain linkedin.com or linkedin.cn, path /in/username
    const linkedinRegex = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+(?:\/)?.*)$/i;
    const match = trimmedLi.match(linkedinRegex);
    if (!match) {
      errors.linkedin = 'Must be a valid public LinkedIn profile URL (e.g. https://www.linkedin.com/in/username)';
    } else {
      const rawUser = match[1].split('/')[0].split('?')[0];
      if (!rawUser || rawUser.length < 2) {
        errors.linkedin = 'LinkedIn username could not be determined from the profile URL.';
      }
    }
  }

  // Validate Instagram URL
  if (!instagramUrl || typeof instagramUrl !== 'string' || instagramUrl.trim().length === 0) {
    errors.instagram = 'Instagram URL is required. Both LinkedIn and Instagram are mandatory.';
  } else {
    const trimmedIg = instagramUrl.trim();
    const instagramRegex = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?instagram\.com\/([a-zA-Z0-9_.-]+(?:\/)?.*)$/i;
    const match = trimmedIg.match(instagramRegex);
    if (!match) {
      errors.instagram = 'Must be a valid public Instagram profile URL (e.g. https://www.instagram.com/username)';
    } else {
      const rawUser = match[1].split('/')[0].split('?')[0];
      // Exclude reserved paths
      const reserved = ['p', 'reel', 'stories', 'explore', 'direct', 'accounts', 'legal'];
      if (!rawUser || rawUser.length < 1 || reserved.includes(rawUser.toLowerCase())) {
        errors.instagram = 'Invalid Instagram username in URL path.';
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;

  let normalizedLinkedinUrl: string | undefined;
  let linkedinUsername: string | undefined;
  let normalizedInstagramUrl: string | undefined;
  let instagramUsername: string | undefined;

  if (isValid) {
    // Normalize LinkedIn
    const liMatch = linkedinUrl.trim().match(/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (liMatch) {
      linkedinUsername = liMatch[1];
      normalizedLinkedinUrl = `https://www.linkedin.com/in/${linkedinUsername}`;
    }

    // Normalize Instagram
    const igMatch = instagramUrl.trim().match(/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?instagram\.com\/([a-zA-Z0-9_.-]+)/i);
    if (igMatch) {
      instagramUsername = igMatch[1];
      normalizedInstagramUrl = `https://www.instagram.com/${instagramUsername}`;
    }
  }

  return {
    isValid,
    normalizedLinkedinUrl,
    normalizedInstagramUrl,
    linkedinUsername,
    instagramUsername,
    errors,
  };
}
