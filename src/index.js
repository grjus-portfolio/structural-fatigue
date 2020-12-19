import { calculateFatigueStress } from "./Fatigue.js";
import { getDeratingFactor } from "./ModificationFactors.js";
import { calculateDamage } from "./Damage.js";

const modificationFactor = getDeratingFactor({
  relLevel: 66,
  loadType: "axial",
  surfFinish: ["RHR125", 155],
  miscFactor: 0.56,
});

const minStress = [-10, -20, -30, -50];
const maxStress = [20, 30, 50, 30];

const fatigueStress = minStress.map((item, idx) =>
  calculateFatigueStress(
    item,
    maxStress[idx],
    "GOODMAN",
    { ultStrength: 155 },
    true
  )
);

const requiredCycles = [200_000, 400_000, 300_000, 200_000];

const damage = requiredCycles.map((item, idx) =>
  calculateDamage(fatigueStress[idx], item, -155, modificationFactor)
);

console.log(damage);
