//SUPPORTING FUNCTIONS

function roundOutput(item, noOfDigits) {
  try {
    return parseFloat(item.toFixed(noOfDigits));
  } catch (e) {
    console.error(e);
    return null;
  }
}

//SUPPORTED FATIGUE  MODELS
const GERBER = "GERBER";
const GOODMAN = "GOODMAN";
const SODERBERG = "SODERBERG";

//EXCEPTION HANDLING
function InvalidStressValue(message) {
  this.message = "Invalid stress value" || message;
  this.name = InvalidStressValue;
}
function InvalidMaterialProperties(message) {
  this.message = "Invalid material constant value" || message;
  this.name = InvalidMaterialProperties;
}

//FAITGUE CONSTRUCTOR
function Stress(minStress, maxStress) {
  this.minStress = minStress;
  this.maxStress = maxStress;
  if (
    isNaN(parseFloat(minStress)) ||
    isNaN(parseFloat(maxStress)) ||
    minStress >= maxStress
  ) {
    throw new InvalidStressValue();
  }
}

//FATIGUE PROTOTYPE
Stress.prototype = {
  constructor: Stress,
  stressRatio: function () {
    return this.minStress / this.maxStress;
  },
  alternatingStress: function () {
    return 0.5 * (this.maxStress - this.minStress);
  },
  meanStress: function () {
    return 0.5 * (this.maxStress + this.minStress);
  },
  goodmanStress: function (matConst, stressCorrection) {
    stressCorrection = false || stressCorrection;
    const { ultStrength } = matConst;
    let meanStress = this.meanStress();
    let altStress = this.alternatingStress();
    if (ultStrength === undefined || isNaN(ultStrength)) {
      throw new InvalidMaterialProperties();
    }
    if (ultStrength <= meanStress) {
      throw new InvalidMaterialProperties(
        "Ultimate strength higher than mean stress value"
      );
    }
    if (stressCorrection && meanStress < 0) {
      meanStress = 0;
    }
    return altStress / (1 - meanStress / ultStrength);
  },
  soderbergStress: function (matConst, stressCorrection) {
    const { yieldStrength } = matConst;
    let meanStress = this.meanStress();
    let altStress = this.alternatingStress();
    if (yieldStrength === undefined || isNaN(yieldStrength)) {
      throw new InvalidMaterialProperties();
    }
    if (yieldStrength <= this.meanStress()) {
      throw new InvalidMaterialProperties(
        "Ultimate strength higher than mean stress value"
      );
    }
    if (stressCorrection && meanStress < 0) {
      meanStress = 0;
    }
    return altStress / (1 - meanStress / yieldStrength);
  },
  gerberStress: function (matConst, stressCorrection) {
    const { ultStrength } = matConst;
    let meanStress = this.meanStress();
    let altStress = this.alternatingStress();
    if (ultStrength === undefined || isNaN(ultStrength)) {
      throw new InvalidMaterialProperties();
    }
    if (ultStrength <= this.meanStress()) {
      throw new InvalidMaterialProperties(
        "Ultimate strength higher than mean stress value"
      );
    }
    if (stressCorrection && meanStress < 0) {
      meanStress = 0;
    }
    return altStress / (1 - (meanStress / ultStrength) ** 2);
  },
};

/**
 * Calculates fatigue stress
 * @param {number} minStress Minimum stress value (ksi)
 * @param {number} maxStress Maximum stress value (ksi)
 * @param {string} fatigueModel Avaiable fatigue models:GOODMAN,GERBER, SODERBERG
 * @param {object} matConstant  For GOODMAN and GERBER {ultStrength:value}, for SODERBERG {yieldStrength:value}. Units: (ksi)
 * @param {boolean} stressCorrection  true?negative compressive stress set to 0:no correction
 * @returns {number} Fatigue stress
 */

export const calculateFatigueStress = (
  minStress,
  maxStress,
  fatigueModel,
  matConstant,
  stressCorrection
) => {
  try {
    const fatigue = new Stress(minStress, maxStress);

    switch (fatigueModel) {
      case GOODMAN:
        return roundOutput(
          fatigue.goodmanStress(matConstant, stressCorrection),
          2
        );

      case GERBER:
        return roundOutput(
          fatigue.gerberStress(matConstant, stressCorrection),
          2
        );

      case SODERBERG:
        return roundOutput(
          fatigue.soderbergStress(matConstant, stressCorrection),
          2
        );

      default:
        console.error("Unsupported fatigue model");
    }
  } catch (e) {
    console.error(e.name, e.message);
  }
};

/**
 * Calculates stress ratio
 * @param {number} minStress Minimum stress value (ksi)
 * @param {number} maxStress Maximum stress value (ksi)
 */

export const calculateStressRatio = (minStress, maxStress) => {
  try {
    return roundOutput(new Stress(minStress, maxStress).stressRatio(), 2);
  } catch (e) {
    console.error(e.name, e.message);
  }
};

/**
 * Calculates alternating stress
 * @param {number} minStress Minimum stress value (ksi)
 * @param {number} maxStress Maximum stress value (ksi)
 */
export const calculateAlternatingStress = (minStress, maxStress) => {
  try {
    return roundOutput(new Stress(minStress, maxStress).alternatingStress(), 2);
  } catch (e) {
    console.log(e.name, e.message);
  }
};
/**
 * Calculates mean stress
 * @param {number} minStress Minimum stress value (ksi)
 * @param {number} maxStress Maximum stress value (ksi)
 */
export const calculateMeanStress = (minStress, maxStress) => {
  try {
    return roundOutput(new Stress(minStress, maxStress).meanStress(), 2);
  } catch (e) {
    console.log(e.name, e.message);
  }
};
