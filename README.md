# Completeness calculator

This is an util class to calculate progress completeness in linear flows. To use it you need to have one (or multiple) queues of steps, which describe your process. After that you'll be able to get completeness for any step.

```javascript
const flow1 = [
  "step 1",
  "step 2",
  { name: "step 3", impact: 5 },
  "step 4",
  { name: "step 5", impact: 5 },
  "step 6"
];
const flow2 = ["step 1", "step 2", "step 3", "step 4"];
const calc = new CompletenessCalculator(flow1, flow2);
calc.getCompleteness("step 1"); // 0.25 - maximum progress for this step-name
calc.getCompleteness("unknown step"); // 0 - no progress for unknown steps
```

Step might be described with a string (name of step), or with object `{name: string, impact: number}`. This is helpful if you want to describe steps with different impact (minor/major steps). Default impact for step - 10. So you can set impact with higher/less value to tweak calculations.
