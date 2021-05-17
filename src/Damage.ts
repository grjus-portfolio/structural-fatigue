import { RangeError } from './Exceptions'

interface BaskinModelProps {
  ultimateStrenght: number,
  modificationFactor: number;
  enduranceLimitFactor:number | 0.5
}

class BaskinModel {
  enduranceLimit:number
  constructor (public baskinProps: BaskinModelProps) {
    this.baskinProps = baskinProps
    const { ultimateStrenght, enduranceLimitFactor, modificationFactor } = this.baskinProps
    this.enduranceLimit = ultimateStrenght * enduranceLimitFactor * modificationFactor
  };

  get bFactor () {
    return (
      (Math.log10(this.enduranceLimit) -
            Math.log10(0.9 * this.baskinProps.ultimateStrenght)) /
          3
    )
  }

  get aFactor () {
    return this.enduranceLimit / 10 ** (6 * this.bFactor)
  }
}

class ChartData extends BaskinModel {
  constructor (baskinProps:BaskinModelProps, public minCycle:number, public maxCycle:number, public chartResolution:number) {
    super(baskinProps)
    if (chartResolution % 2 !== 0 || chartResolution <= 1) {
      throw new RangeError('Invalid resolution value')
    }

    this.minCycle = minCycle
    this.maxCycle = maxCycle
  }

  static linespace = (start:number, stop:number, numberOfEntries:number) => {
    if (stop <= start) {
      throw new RangeError('Start value must be greater than stop value')
    }
    if (numberOfEntries % 2 !== 0 || numberOfEntries <= 1) {
      throw new RangeError('Incorrect number of entries')
    }
    const output = []
    const step = (stop - start) / (numberOfEntries - 1)
    for (let i = 0; i < numberOfEntries; i++) {
      output.push(start + i * step)
    }

    return output
  }

  chartData () {
    const cycleRange = ChartData.linespace(this.minCycle, this.maxCycle, this.chartResolution)
    const stress = cycleRange.map(item => (
      10 ** (Math.log10(this.aFactor) + this.bFactor * Math.log10(item))
    ))
    return ({
      cycle: cycleRange,
      stress: stress
    })
  }
}

class Damage {
  damage:number[]
  constructor (public fatigueStress:number[], public allowableStress:number[], public enduranceLimit:number) {
    this.fatigueStress = fatigueStress
    this.allowableStress = allowableStress
    this.enduranceLimit = enduranceLimit
    this.damage = []
  }

  getDamage () {
    this.fatigueStress.forEach((item, idx) => {
      if (item <= this.enduranceLimit) {
        this.damage.push(0)
      }
      this.damage.push(item / this.allowableStress[idx])
    })
  }
}

// import { FatigueException, DamageException } from "./Exceptions.js";

// function Damage(fatigueStress, requiredCycle, ultStrength, modificationFactor) {
//   for (let each of arguments) {
//     if (isNaN(each) || each <= 0) {
//       throw new FatigueException(
//         "Non negative values are allowed",
//         DamageException
//       );
//     }
//   }

//   this.fatigueStress = fatigueStress;
//   this.requiredCycle = requiredCycle;
//   this.modificationFactor = modificationFactor;
//   this.ultStrength = ultStrength;

//   Object.defineProperties(this, {
//     enduranceLimit: {
//       get: function () {
//         return 0.5 * this.ultStrength * this.modificationFactor;
//       },
//     },
//     B_factor: {
//       get: function () {
//         return (
//           (Math.log10(this.enduranceLimit) -
//             Math.log10(0.9 * this.ultStrength)) /
//           3
//         );
//       },
//     },
//     A_factor: {
//       get: function () {
//         return this.enduranceLimit / 10 ** (6 * this.B_factor);
//       },
//     },
//   });
// }

// Damage.prototype = {
//   constructor: Damage,
//   allowableCycles: function () {
//     console.log(this.enduranceLimit);
//     if (this.fatigueStress < this.enduranceLimit) {
//       return 1e7;
//     } else {
//       return (this.fatigueStress / this.A_factor) ** (1 / this.B_factor);
//     }
//   },
//   damage: function () {
//     return this.requiredCycle / this.allowableCycles();
//   },
// };
// /**
//  *
//  * @param {number} fatigueStress Fatigue stress (ksi)
//  * @param {number} requiredCycle Required cycle value
//  * @param {number} ultStrength Ultimate strength value (ksi)
//  * @param {number} modificationFactors Effecitve fatigue modificaiton factor
//  */
// export function calculateDamage(
//   fatigueStress,
//   requiredCycle,
//   ultStrength,
//   modificationFactors
// ) {
//   try {
//     return new Damage(
//       fatigueStress,
//       requiredCycle,
//       ultStrength,
//       modificationFactors
//     ).damage();
//   } catch (e) {
//     console.log(e.name, e.message);
//   }
// }
