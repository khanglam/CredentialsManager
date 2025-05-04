/**
 * Calculates the strength of a password based on various criteria.
 * @param password The password to evaluate
 * @returns An object containing the strength rating and score
 */
export function calculatePasswordStrength(password: string): { strength: 'weak' | 'medium' | 'strong'; score: number } {
  if (!password) {
    return { strength: 'weak', score: 0 };
  }

  let score = 0;

  // Length check
  if (password.length >= 12) {
    score += 3;
  } else if (password.length >= 8) {
    score += 2;
  } else if (password.length >= 6) {
    score += 1;
  }

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 2; // Has special character

  // Variety check
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars >= password.length * 0.7) score += 1;
  
  // Determine strength based on score
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 7) {
    strength = 'strong';
  } else if (score >= 4) {
    strength = 'medium';
  }

  return { strength, score };
}

/**
 * Generates a random password with specified options
 * @param length The length of the password to generate
 * @param options Options for password generation
 * @returns A randomly generated password
 */
export function generatePassword(length = 12, options = { 
  uppercase: true, 
  lowercase: true, 
  numbers: true, 
  symbols: true 
}): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let availableChars = '';
  if (options.uppercase) availableChars += uppercaseChars;
  if (options.lowercase) availableChars += lowercaseChars;
  if (options.numbers) availableChars += numberChars;
  if (options.symbols) availableChars += symbolChars;
  
  // Fallback to ensure we have some characters
  if (!availableChars) {
    availableChars = lowercaseChars + numberChars;
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }
  
  return password;
}
