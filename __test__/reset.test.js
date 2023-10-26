import dotenv from 'dotenv';
import request from 'supertest';
import "../dist/config.js";
dotenv.config();
import ableToReset from '../dist/middleware/validation/resetPwd.js';


describe('ableToReset', () => {
    it('should return true when two strings are identical', () => {
      const one = 'hello';
      const two = 'hello';
  
      const result = ableToReset(one, two);
  
      expect(result).toBe(true);
    });
  
    it('should return false when two strings have different lengths', () => {
      const one = 'hello';
      const two = 'world';
  
      const result = ableToReset(one, two);
  
      expect(result).toBe(false);
    });
  
    it('should return false when two strings are different', () => {
      const one = 'hello';
      const two = 'hola';
  
      const result = ableToReset(one, two);
  
      expect(result).toBe(false);
    });
  });
  
