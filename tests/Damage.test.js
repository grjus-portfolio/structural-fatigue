import { calculateDamage } from "../index";

const fatigueStress = 60;
const requiredCycle = 300_000;
const ultStrength = 160;
const modificationFactor = 0.9;

describe("Damage calculation", () => {
  test("Calculate damage", () => {
    const res = calculateDamage(
      fatigueStress,
      requiredCycle,
      ultStrength,
      modificationFactor
    );
    expect(res).toBe(0.03);
  });
  test("Calculate damage - mod factor 0.70", () => {
    const modificationFactor = 0.7;
    const res = calculateDamage(
      fatigueStress,
      requiredCycle,
      ultStrength,
      modificationFactor
    );
    expect(parseFloat(res.toFixed(3))).toBe(0.497);
  });
});
