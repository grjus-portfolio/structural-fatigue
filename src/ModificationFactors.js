function InvalidFactorDefinition(message) {
  this.message = message || "Modification factor is not valid !";
  this.name = "InvalidFactorDefinition";
}

const FatModFactor = (function () {
  const surfaceFactor = {
    RHR1: [-1.9781e-10, 9.3052e-8, -1.54162e-5, 0.000992486, 0.978754496],
    RHR2: [-2.41664e-10, 1.13e-7, -1.8961e-5, 0.001197649, 0.974180822],
    RHR4: [-5.66e-11, 6.42711e-9, 1.65e-7, -6.21739e-5, 0.993976607],
    RHR8: [-9.26e-11, 6.87e-9, 2.03e-6, -0.000443363, 1.011989161],
    RHR16: [2.55e-12, -4.52e-8, 8.68e-6, -0.000785533, 1.018570076],
    RHR32: [1.79e-10, -1.19e-7, 1.57404e-5, -0.001125283, 1.018212068],
    RHR63: [5.12e-10, -2.54041e-7, 3.17459e-5, -0.002175019, 1.034503858],
    RHR125: [3.78e-10, -1.2e-7, -2.41e-6, 0.00018656, 0.969804219],
    RHR250: [-3.9e-10, 3.06e-7, -7.71122e-5, 0.004515181, 0.855559011],
    RHR500: [-6.78e-10, 4.29e-7, -8.51744e-5, 0.003218463, 0.872820273],
    RHR1000: [-4.88e-10, 2.78e-7, -4.34443e-5, -0.000879014, 0.898145566],
    RHR2500: [-2.43e-10, 1.12e-7, -5.36e-6, -0.003676684, 0.859450989],
  };

  const loadFactor = {
    bending: 1,
    axial: 0.7,
    shear: 0.57735,
  };

  return {
    loadType: function (loadType) {
      if (!(loadType in loadFactor)) {
        throw new InvalidFactorDefinition(
          `Invalid load type factor. Allowabled options are: ${Object.keys(
            loadFactor
          )}`
        );
      }
      return loadFactor[loadType];
    },
    surfFinish: function ([surfaceFinish, ultStrength]) {
      if (!(surfaceFinish in surfaceFactor)) {
        throw new InvalidFactorDefinition(
          `Invalid surface finish definition.Allowable values are: ${Object.keys(
            surfaceFactor
          )}`
        );
      }
      if (isNaN(ultStrength) || ultStrength < 50) {
        throw new InvalidFactorDefinition(
          "Invalid ultimate strenght value. Min 50 ksi is required"
        );
      }

      const [a, b, c, d, e] = surfaceFactor[surfaceFinish];
      return (
        a * ultStrength ** 4 +
        b * ultStrength ** 3 +
        c * ultStrength ** 2 +
        d * ultStrength +
        e
      );
    },
    miscFactor: function (param) {
      if (isNaN(param) || param <= 0) {
        throw new InvalidFactorDefinition(
          "Invalid miscellaneous parameter. Value should be higher than 0 "
        );
      }
      return param;
    },
  };
})();

export function getDeratingFactor(obj) {
  if (JSON.stringify(obj) === "{}" || obj === undefined || obj === null) {
    return 1;
  }

  const params = Object.keys(obj);
  try {
    for (let each of Object.keys(obj)) {
      if (!Object.keys(FatModFactor).includes(each)) {
        throw new InvalidFactorDefinition(
          "Invalid key in modification factor definition"
        );
      }
    }

    return params
      .map((item) => FatModFactor[item](obj[item]))
      .reduce((a, b) => a * b, 1);
  } catch (e) {
    console.error(e.name, e.message);
  }
}
