import { getDeratingFactor, InvalidFactorDefinition } from "../index";

describe("Various modification factors", function () {
  test("Evaluation of effective fatigue derating factor - ALL FACTORS", () => {
    const ultStrength = 155;
    const factorObject = {
      loadType: "axial",
      surfFinish: ["RHR125", ultStrength],
      miscFactor: 1,
    };
    const res = getDeratingFactor(factorObject);
    expect(res).toBe(0.4984963236750001);
  });

  test("Evaluation of effective fatigue derating factor - LOAD & MISC", () => {
    const factorObject = {
      loadType: "axial",
      miscFactor: 0.7,
    };
    const res = getDeratingFactor(factorObject);
    expect(parseFloat(res.toFixed(2))).toBe(0.49);
  });
  test("Evaluation of effective fatigue derating factor - LOAD", () => {
    const factorObject = {
      loadType: "axial",
    };
    const res = getDeratingFactor(factorObject);
    expect(parseFloat(res.toFixed(2))).toBe(0.7);
  });

  test("Incorrect key definition", async () => {
    const factorObject = {
      someFactor: "axial",
    };
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getDeratingFactor(factorObject);
    expect(consoleError).toHaveBeenCalled();
  });
});
