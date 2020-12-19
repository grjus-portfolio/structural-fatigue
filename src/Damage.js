import { FatigueException, DamageException } from "./Exceptions.js";

function Damage(fatigueStress, requiredCycle, ultStrength, modificationFactor) {
  for (let each of arguments) {
    if (isNaN(each) || each <= 0) {
      throw new FatigueException(
        "Non negative values are allowed",
        DamageException
      );
    }
  }

  this.fatigueStress = fatigueStress;
  this.requiredCycle = requiredCycle;
  this.modificationFactor = modificationFactor;
  this.ultStrength = ultStrength;

  Object.defineProperties(this, {
    enduranceLimit: {
      get: function () {
        return 0.5 * this.ultStrength * this.modificationFactor;
      },
    },
    B_factor: {
      get: function () {
        return (
          (Math.log10(this.enduranceLimit) -
            Math.log10(0.9 * this.ultStrength)) /
          3
        );
      },
    },
    A_factor: {
      get: function () {
        return this.enduranceLimit / 10 ** (6 * this.B_factor);
      },
    },
  });
}

Damage.prototype = {
  constructor: Damage,
  allowableCycles: function () {
    console.log(this.enduranceLimit);
    if (this.fatigueStress < this.enduranceLimit) {
      return 1e7;
    } else {
      return (this.fatigueStress / this.A_factor) ** (1 / this.B_factor);
    }
  },
  damage: function () {
    return this.requiredCycle / this.allowableCycles();
  },
};

export function calculateDamage(
  fatigueStress,
  requiredCycle,
  ultStrength,
  modificationFactors
) {
  try {
    return new Damage(
      fatigueStress,
      requiredCycle,
      ultStrength,
      modificationFactors
    ).damage();
  } catch (e) {
    console.log(e.name, e.message);
  }
}
