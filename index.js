const DEFAULT_IMPACT = 10;
const FULL_IMPACT = 100;

const isParallelBranchItem = item =>
  item && item.type === "parallel" && Array.isArray(item.branches);

const expandParallelBranches = flows => {
  if (!flows.some(flow => flow.some(isParallelBranchItem))) {
    return flows;
  }

  let result = [];
  flows.forEach(flow => {
    const firstListEl = flow.find(isParallelBranchItem);

    if (!firstListEl) {
      result.push(flow);
    } else {
      firstListEl.branches.forEach(listElement =>
        result.push(flow.map(el => (el === firstListEl ? listElement : el)))
      );
    }
  });
  return expandParallelBranches(result);
};

const isSequenceItem = item =>
  item && item.type === "sequence" && Array.isArray(item.sequence);

const expandSequences = flows => {
  if (
    !flows.some(flow => {
      return flow.some(isSequenceItem);
    })
  ) {
    return flows;
  }

  let result = [];
  flows.forEach(flow => {
    const firstListEl = flow.find(isSequenceItem);

    if (!firstListEl) {
      result.push(flow);
    } else {
      const flowResult = [];
      flow.forEach(el => {
        if (el === firstListEl) {
          firstListEl.sequence.forEach(el => flowResult.push(el));
        } else {
          flowResult.push(el);
        }
      });
      result.push(flowResult);
    }
  });
  return expandSequences(result);
};

class CompletenessCalculator {
  constructor(...flows) {
    let flowsToAdd = expandParallelBranches(flows);
    let linearFlows = expandSequences(flowsToAdd);
    this.flows = linearFlows.map(flow =>
      flow.map(el => {
        if (typeof el === "string") {
          return {
            name: el,
            impact: DEFAULT_IMPACT
          };
        }
        if (!!el && typeof el === "object" && typeof el.name === "string") {
          return {
            name: el.name,
            impact: +el.impact || DEFAULT_IMPACT
          };
        }
        throw new Error(
          `${JSON.stringify(el)} is unrecognized step definition`
        );
      })
    );

    this.flows.forEach(flow => {
      const totalImpact = flow.reduce((flowAcc, el) => flowAcc + el.impact, 0);
      const impactValue = FULL_IMPACT / totalImpact;
      let value = 0;
      flow.forEach((el, index) => {
        value += el.impact * impactValue;
        el.value = index === flow.length - 1 ? FULL_IMPACT : value;
      });
    });
  }

  getCompleteness(stepName) {
    const stepValues = this.flows
      .map(flow => flow.find(el => el.name === stepName))
      .filter(Boolean)
      .map(el => el.value);

    if (!stepValues.length) {
      return 0;
    }
    return Math.max(...stepValues) / 100;
  }
}

module.exports = CompletenessCalculator;
