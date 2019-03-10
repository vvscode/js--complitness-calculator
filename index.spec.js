const CompletenessCalculator = require('./index');

describe('CompletenessCalculator', () => {
  it('is a constructor', () => {
    expect(typeof CompletenessCalculator).toBe('function');
    expect(new CompletenessCalculator()).toBeInstanceOf(CompletenessCalculator);
  });

  describe('Interface', () => {
    it('has .getCompleteness method', () => {
      let calc = new CompletenessCalculator();
      expect(typeof calc.getCompleteness).toBe('function');
    });
  });

  describe('Logic', () => {
    describe('Simple flow', () => {
      let calc;
      const flow = [
        'step 1',
        'step 2',
        { name: 'step 3'},
        { name: 'step 4'},
        'step 5',
      ];
      beforeEach(() => {
        calc = new CompletenessCalculator(flow);
      })
      it('calculates completeness for unknown steps', () => {
        expect(calc.getCompleteness('unknown step')).toBe(0);
      });
      it('calculates completeness for known steps', () => {
        expect(calc.getCompleteness('step 1')).toBe(0.2);
        expect(calc.getCompleteness('step 2')).toBe(0.4);
        expect(calc.getCompleteness('step 3')).toBe(0.6);
        expect(calc.getCompleteness('step 4')).toBe(0.8);
        expect(calc.getCompleteness('step 5')).toBe(1);
      })
    });
  });
})