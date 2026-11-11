const ALLOWED_DOMAIN = 'hbplus.fit';
const DOMAIN_RESTRICTION_ERROR_MESSAGE = 'Access restricted. Please login using your official domain email.';

function validateEmailDomain(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      domain: '',
      email: '',
      errorMessage: 'No email address was provided by Google OAuth.',
    };
  }

  const cleanedEmail = email.trim().toLowerCase();
  const atIndex = cleanedEmail.lastIndexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === cleanedEmail.length - 1) {
    return {
      isValid: false,
      domain: '',
      email: cleanedEmail,
      errorMessage: 'Invalid email address format.',
    };
  }

  const userDomain = cleanedEmail.slice(atIndex + 1);

  if (userDomain !== ALLOWED_DOMAIN) {
    return {
      isValid: false,
      domain: userDomain,
      email: cleanedEmail,
      errorMessage: DOMAIN_RESTRICTION_ERROR_MESSAGE,
    };
  }

  return {
    isValid: true,
    domain: userDomain,
    email: cleanedEmail,
  };
}

console.log('--- TEST 1: Allowed Domain (@hbplus.fit) ---');
const t1 = validateEmailDomain('example@hbplus.fit');
console.log(t1);
if (!t1.isValid) throw new Error('Test 1 failed!');

console.log('\n--- TEST 2: Blocked Domain (@gmail.com) ---');
const t2 = validateEmailDomain('example@gmail.com');
console.log(t2);
if (t2.isValid || t2.errorMessage !== DOMAIN_RESTRICTION_ERROR_MESSAGE) {
  throw new Error('Test 2 failed!');
}

console.log('\n--- TEST 3: Blocked Domain (@yahoo.com) ---');
const t3 = validateEmailDomain('someone@yahoo.com');
console.log(t3);
if (t3.isValid) throw new Error('Test 3 failed!');

console.log('\n--- TEST 4: Spoofing attempt (@fakehbplus.fit) ---');
const t4 = validateEmailDomain('attacker@fakehbplus.fit');
console.log(t4);
if (t4.isValid) throw new Error('Test 4 failed!');

console.log('\n✅ ALL DOMAIN RESTRICTION TESTS PASSED PERFECTLY!');

