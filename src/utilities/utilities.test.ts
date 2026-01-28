import { describe, it, expect, test } from 'vitest';
import { isUrl } from './utilities';

describe('isUrl', () => {
  describe('should accept valid URLs', () => {
    test('should accept http:// URLs', () => {
      expect(isUrl('http://example.com')).toBe(true);
      expect(isUrl('http://test.org/path')).toBe(true);
      expect(isUrl('http://subdomain.example.com')).toBe(true);
    });

    test('should accept https:// URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('https://test.org/path')).toBe(true);
      expect(isUrl('https://subdomain.example.com')).toBe(true);
    });

    test('should accept URLs with paths and query strings', () => {
      expect(isUrl('https://example.com/path/to/page')).toBe(true);
      expect(isUrl('http://test.org/with/path?query=1&param=2')).toBe(true);
      expect(isUrl('https://example.com/path#anchor')).toBe(true);
    });

    test('should accept URLs with multiple subdomains', () => {
      expect(isUrl('https://subdomain.example.com')).toBe(true);
      expect(isUrl('https://www.example.co.uk')).toBe(true);
    });
  });

  describe('should reject invalid URLs', () => {
    test('should reject URLs without :// separator', () => {
      expect(isUrl('http:example.com')).toBe(false);
      expect(isUrl('https:example.com')).toBe(false);
    });

    test('should reject URLs without TLD', () => {
      expect(isUrl('https://fdasfdsavsdcj')).toBe(false);
      expect(isUrl('http://test')).toBe(false);
    });

    test('should reject URLs with trailing dots', () => {
      expect(isUrl('https://mytestdocumentation...')).toBe(false);
      expect(isUrl('https://test.')).toBe(false);
      expect(isUrl('https://test..')).toBe(false);
    });

    test('should reject URLs with consecutive dots', () => {
      expect(isUrl('https://example..com')).toBe(false);
      expect(isUrl('http://test..example.com')).toBe(false);
    });

    test('should reject URLs with empty hostname', () => {
      expect(isUrl('https://.com')).toBe(false);
      expect(isUrl('http://')).toBe(false);
      expect(isUrl('https://')).toBe(false);
    });

    test('should reject non-http/https protocols', () => {
      expect(isUrl('ftp://example.com')).toBe(false);
      expect(isUrl('file://example.com')).toBe(false);
      expect(isUrl('ws://example.com')).toBe(false);
    });

    test('should reject URLs with whitespace', () => {
      expect(isUrl('https://test.com with space')).toBe(false);
      expect(isUrl('not a url')).toBe(false);
      expect(isUrl('http://example.com ')).toBe(false);
      expect(isUrl(' http://example.com')).toBe(false);
    });

    test('should reject invalid strings', () => {
      expect(isUrl('not a url')).toBe(false);
      expect(isUrl('')).toBe(false);
      expect(isUrl('just text')).toBe(false);
    });
  });
});
