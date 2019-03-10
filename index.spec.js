const CompletenessCalculator = require("./index");

describe("CompletenessCalculator", () => {
  it("is a constructor", () => {
    expect(typeof CompletenessCalculator).toBe("function");
    expect(new CompletenessCalculator()).toBeInstanceOf(CompletenessCalculator);
  });

  describe("Interface", () => {
    it("has .getCompleteness method", () => {
      let calc = new CompletenessCalculator();
      expect(typeof calc.getCompleteness).toBe("function");
    });
  });

  describe("Logic", () => {
    describe("Simple flow", () => {
      let calc;
      const flow = [
        "step 1",
        "step 2",
        { name: "step 3" },
        { name: "step 4" },
        "step 5"
      ];
      beforeEach(() => {
        calc = new CompletenessCalculator(flow);
      });
      it("calculates completeness for unknown steps", () => {
        expect(calc.getCompleteness("unknown step")).toBe(0);
      });
      it("calculates completeness for known steps", () => {
        expect(calc.getCompleteness("step 1")).toBe(0.2);
        expect(calc.getCompleteness("step 2")).toBe(0.4);
        expect(calc.getCompleteness("step 3")).toBe(0.6);
        expect(calc.getCompleteness("step 4")).toBe(0.8);
        expect(calc.getCompleteness("step 5")).toBe(1);
      });
    });
    describe("Simple variegated flow", () => {
      let calc;
      const flow = [
        "step 1",
        "step 2",
        { name: "step 3", impact: 5 },
        "step 4",
        { name: "step 5", impact: 5 }
      ];
      beforeEach(() => {
        calc = new CompletenessCalculator(flow);
      });
      it("calculates completeness for unknown steps", () => {
        expect(calc.getCompleteness("unknown step")).toBe(0);
      });
      it("calculates completeness for known steps", () => {
        expect(calc.getCompleteness("step 1")).toBe(0.25);
        expect(calc.getCompleteness("step 2")).toBe(0.5);
        expect(calc.getCompleteness("step 3")).toBe(0.625);
        expect(calc.getCompleteness("step 4")).toBe(0.875);
        expect(calc.getCompleteness("step 5")).toBe(1);
      });
    });
    describe("Multiple variegated flows", () => {
      let calc;
      const flow1 = [
        "step 1",
        "step 2",
        { name: "step 3", impact: 5 },
        "step 4",
        { name: "step 5", impact: 5 },
        "step 6"
      ];
      const flow2 = ["step 1", "step 2", "step 3", "step 4"];
      beforeEach(() => {
        calc = new CompletenessCalculator(flow1, flow2);
      });
      it("calculates completeness for unknown steps", () => {
        expect(calc.getCompleteness("unknown step")).toBe(0);
      });
      it("calculates completeness for known steps", () => {
        expect(calc.getCompleteness("step 1")).toBe(0.25);
        expect(calc.getCompleteness("step 2")).toBe(0.5);
        expect(calc.getCompleteness("step 3")).toBe(0.75);
        expect(calc.getCompleteness("step 4")).toBe(1);
        expect(calc.getCompleteness("step 5")).toBe(0.8);
        expect(calc.getCompleteness("step 6")).toBe(1);
      });
    });

    describe("Parallel branches", () => {
      let calc;
      const flow1 = [
        "step 1",
        {
          type: "parallel",
          branches: ["step 2.1", "step 2.2"]
        },
        {
          type: "parallel",
          branches: ["step 3.1", "step 3.2"]
        },
        "step 4"
      ];
      beforeEach(() => {
        calc = new CompletenessCalculator(flow1);
      });
      it.skip("calculates completeness for unknown steps", () => {
        expect(calc.getCompleteness("unknown step")).toBe(0);
      });
      it("calculates completeness for known steps", () => {
        expect(calc.getCompleteness("step 1")).toBe(0.25);
        expect(calc.getCompleteness("step 2.1")).toBe(0.5);
        expect(calc.getCompleteness("step 2.2")).toBe(0.5);
        expect(calc.getCompleteness("step 3.1")).toBe(0.75);
        expect(calc.getCompleteness("step 3.2")).toBe(0.75);
        expect(calc.getCompleteness("step 4")).toBe(1);
      });
    });
  });

  describe("Parallel and sequence branches", () => {
    let calc;
    const flow1 = [
      "step 1",
      {
        type: "parallel",
        branches: ["step 2.1", "step 2.2"]
      },
      {
        type: "parallel",
        branches: [
          "step 3.1",
          {
            type: "sequence",
            sequence: [
              {
                name: "step 3.2.1",
                impact: 5
              },
              { name: "step 3.2.2", impact: 5 }
            ]
          }
        ]
      },
      {
        type: "sequence",
        sequence: ["step 4.1", "step 4.2"]
      }
    ];
    beforeEach(() => {
      calc = new CompletenessCalculator(flow1);
    });
    it("calculates completeness for unknown steps", () => {
      expect(calc.getCompleteness("unknown step")).toBe(0);
    });
    it("calculates completeness for known steps", () => {
      expect(calc.getCompleteness("step 1")).toBe(0.2);
      expect(calc.getCompleteness("step 2.1")).toBe(0.4);
      expect(calc.getCompleteness("step 2.2")).toBe(0.4);
      expect(calc.getCompleteness("step 3.1")).toBe(0.6);
      expect(calc.getCompleteness("step 3.2.1")).toBe(0.5);
      expect(calc.getCompleteness("step 3.2.2")).toBe(0.6);
      expect(calc.getCompleteness("step 4.1")).toBe(0.8);
      expect(calc.getCompleteness("step 4.2")).toBe(1);
    });
  });
});
