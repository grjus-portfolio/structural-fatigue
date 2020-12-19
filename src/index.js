// import { calculateFatigueStress } from "./Fatigue.js";
// import { getDeratingFactor } from "./ModificationFactors.js";
// import { calculateDamage } from "./Damage.js";

// const modificationFactor = getDeratingFactor({
//   relLevel: 66,
//   loadType: "axial",
//   surfFinish: ["RHR125", 155],
//   miscFactor: 0.56,
// });

// const minStress = [-10, -20, -30, -50];
// const maxStress = [20, 30, 50, 30];

// const fatigueStress = minStress.map((item, idx) =>
//   calculateFatigueStress(
//     item,
//     maxStress[idx],
//     "GOODMAN",
//     { ultStrength: 155 },
//     true
//   )
// );

// const requiredCycles = [200_000, 400_000, 300_000, 200_000];

// const damage = requiredCycles.map((item, idx) =>
//   calculateDamage(fatigueStress[idx], item, -155, modificationFactor)
// );

// console.log(damage);

function NameException(message) {
  this.message = "You fucked up";
  this.name = NameException;
}

function Dummy(name) {
  this._name = name;
}

Object.defineProperty(Dummy.prototype, "name", {
  get: function () {
    return this._name;
  },
  set: function (value) {
    if (value.length < 4) {
      throw new NameException();
    }
    this._name = value;
  },
});
const lol = new Dummy("as");
console.log(lol.name);
