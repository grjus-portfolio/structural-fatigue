# structural-fatigue

structural-fatigue is javascript library for basic structural fatigue calculation

## Installation

Use the package manager [Node.js](http://nodejs.org/) to install structural-fatigue.

```bash
npm install structural-fatigue
```

## Usage

**Input stress and related material constants should be defined in ksi**

```javascript
import {
  calculateStressRatio,
  calculateAlternatingStress,
  calculateMeanStress,
  calculateFatigueStress,
  calculateDamage,
  getDeratingFactor,
} from "structural-fatigue";

// DEFINE STRESS VALUES

const minStress = -40;
const maxStress = 50;
const ultStrength = 155;

//STRESS RATIO

const stressRatio = calculateStressRatio(minStress, maxStress);

//ALTERNATING STRESS

const altStress = calculateAlternatingStress(minStress, maxStress);

//MEAN STRESS

const meanStress = calculateMeanStress(minStress, maxStress);

// FATIGUE STRESS

const fatigueStress = calculateFatigueStress(
  minStress,
  maxStress,
  "GOODMAN",
  { ultStrength: ultStrength },
  true
);

// CALCULATE EFFECTIVE FATIGUE DERATING FACTOR

const modificationFactors = {
  loadType: "axial", //
  surfFinish: ["RHR125", ultStrength],
  miscFactor: 1.0,
};

const effectiveDeratingFactor = getDeratingFactor(modificationFactors);

//CALCULATE DAMAGE

const requiredCycle = 400_000;

const damage = calculateDamage(
  fatigueStress,
  requiredCycle,
  ultStrength,
  effectiveDeratingFactor
);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
