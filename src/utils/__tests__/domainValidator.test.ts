import { validateEmailDomain, isAllowedDomain, extractDomain } from '../domainValidator';

describe('Domain Validation Security Engine', () => {
  test('allows official @hbplus.fit email address', () => {
    const result = validateEmailDomain('employee@hbplus.fit');
    expect(result.isValid).toBe(true);
    expect(result.domain).toBe('hbplus.fit');
    expect(result.errorMessage).toBeUndefined();
    expect(isAllowedDomain('employee@hbplus.fit')).toBe(true);
  });

  test('allows uppercase and mixed-case @hbplus.fit email address', () => {
    const result = validateEmailDomain('Employee.Admin@HBPLUS.FIT');
    expect(result.isValid).toBe(true);
    expect(result.domain).toBe('hbplus.fit');
  });

  test('blocks @gmail.com with exact required error message', () => {
    const result = validateEmailDomain('example@gmail.com');
    expect(result.isValid).toBe(false);
    expect(result.domain).toBe('gmail.com');
    expect(result.errorMessage).toBe('Access restricted. Please login using your official domain email.');
    expect(isAllowedDomain('example@gmail.com')).toBe(false);
  });

  test('blocks other external domains like yahoo.com, outlook.com', () => {
    const yahoo = validateEmailDomain('test.user@yahoo.com');
    expect(yahoo.isValid).toBe(false);
    expect(yahoo.errorMessage).toBe('Access restricted. Please login using your official domain email.');

    const outlook = validateEmailDomain('test.user@outlook.com');
    expect(outlook.isValid).toBe(false);
    expect(outlook.errorMessage).toBe('Access restricted. Please login using your official domain email.');
  });

  test('blocks subdomains or spoofing attempts (e.g. evil-hbplus.fit or hbplus.fit.evil.com)', () => {
    const spoof1 = validateEmailDomain('test@fakehbplus.fit');
    expect(spoof1.isValid).toBe(false);

    const spoof2 = validateEmailDomain('test@hbplus.fit.attacker.com');
    expect(spoof2.isValid).toBe(false);
  });

  test('blocks malformed or empty email', () => {
    expect(validateEmailDomain('').isValid).toBe(false);
    expect(validateEmailDomain('notanemail').isValid).toBe(false);
    expect(validateEmailDomain(null as any).isValid).toBe(false);
  });

  test('correctly extracts domain', () => {
    expect(extractDomain('user@hbplus.fit')).toBe('hbplus.fit');
    expect(extractDomain('test@example.com')).toBe('example.com');
  });
});

