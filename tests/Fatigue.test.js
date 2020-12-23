import {
  calculateAlternatingStress,
  calculateMeanStress,
  calculateStressRatio,
  calculateFatigueStress,
} from "../index";

const round = (num) => {
  return parseFloat(num.toFixed(3));
};

const minStress = -80;
const maxStress = 20;
const ultStrength = 160;
const yieldStrength = 110;

describe("Fatigue components", () => {
  test("Stress ratio", () => {
    const res = calculateStressRatio(minStress, maxStress);
    expect(round(res)).toBe(-4.0);
  });

  test("Mean stress", () => {
    const res = calculateMeanStress(minStress, maxStress);
    expect(round(res)).toBe(-30);
  });

  test("Alternating stress", () => {
    const res = calculateAlternatingStress(minStress, maxStress);
    expect(round(res)).toBe(50);
  });
  test("Incorrect stress range", () => {
    const consoleError = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    calculateAlternatingStress(maxStress, minStress);
    expect(consoleError).toHaveBeenCalled();
  });
});

describe("Fatigue models", () => {
  test("Goodman - NO MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "GOODMAN",
      { ultStrength: ultStrength },
      false
    );
    expect(round(res)).toBe(42.11);
  });

  test("Goodman - MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "GOODMAN",
      { ultStrength: ultStrength },
      true
    );
    expect(round(res)).toBe(50);
  });
  test("Gerber - NO MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "GERBER",
      { ultStrength: ultStrength },
      false
    );
    expect(round(res)).toBe(51.82);
  });

  test("Gerber - MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "GERBER",
      { ultStrength: ultStrength },
      true
    );
    expect(round(res)).toBe(50.0);
  });
  test("Soderberg - NO MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "SODERBERG",
      { yieldStrength: yieldStrength },
      false
    );
    expect(round(res)).toBe(39.29);
  });
  0.8;

  test("Soderberg - MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "SODERBERG",
      { yieldStrength: yieldStrength },
      true
    );
    expect(round(res)).toBe(50.0);
  });

  test("Soderberg - NO MATRIAL CORRECTION", () => {
    const res = calculateFatigueStress(
      minStress,
      maxStress,
      "SODERBERG",
      { yieldStrength: yieldStrength },
      true
    );
    expect(round(res)).toBe(50.0);
  });

  test("Incorrect faitgue model", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    calculateFatigueStress(
      minStress,
      maxStress,
      "LOL",
      { yieldStrength: yieldStrength },
      true
    );
    expect(consoleError).toHaveBeenCalled();
  });
});
