import StressError from './Exceptions'

interface MaterialConstant {
  ultimateStrenght:number,
  yieldStrength?:number
}

class StressComponents {
  constructor (public minStress:number[], public maxStress:number[], public materialConstant:MaterialConstant) {
    const matCriterion = materialConstant.yieldStrength || materialConstant.ultimateStrenght
    minStress.forEach((item, idx) => {
      if (item >= maxStress[idx]) {
        throw new StressError(`Minimum stress is greater than maximum one at index ${idx}`)
      }
      if (matCriterion < maxStress[idx]) {
        throw new StressError(`Maximum stress is greater than predefied material constant at index ${idx}`)
      }
    })
    this.minStress = minStress
    this.maxStress = maxStress
  }

  alternatingStress () {
    return this.maxStress.map((item, idx) => 0.5 * (item - this.minStress[idx]))
  }

  meanStress () {
    return this.maxStress.map((item, idx) => 0.5 * (item + this.minStress[idx]))
  }
}

type FatigueModel = 'GOODMAN' | 'SODEBERG' | 'GERBER'

class FatigueStress extends StressComponents {
  altStress:number[]
  mStress:number[]

  constructor (public fatigueModel:FatigueModel, public minStress:number[], public maxStress:number[], public materialConstant:MaterialConstant) {
    super(minStress, maxStress, materialConstant)
    this.fatigueModel = fatigueModel
    this.altStress = this.alternatingStress()
    this.mStress = this.meanStress()
  }

  private goodmanStress () {
    return this.altStress.map((item, idx) => item / (1 - this.mStress[idx] / this.materialConstant.ultimateStrenght))
  }

  private sodebergStress () {
    if (this.materialConstant.yieldStrength) {
      return this.altStress.map((item, idx) => item / (1 - this.mStress[idx] / this.materialConstant.ultimateStrenght))
    }
    throw new StressError('Unable to calculate Soderberg stress. Missing information about material yield strength')
  }

  private gerberStress () {
    return this.altStress.map((item, idx) => item / (1 - this.mStress[idx] / this.materialConstant.ultimateStrenght) ** 2)
  }

  calculate () {
    switch (this.fatigueModel) {
      case 'GOODMAN':
        return this.goodmanStress()
      case 'GERBER':
        return this.gerberStress()
      case 'SODEBERG':
        return this.sodebergStress()
      default:
        throw new StressError('Invalid fatigue model selected')
    }
  }
}

const fatigueStress = (minStress:number[], maxStress:number[], fatigueModel:FatigueModel, materialConstant:MaterialConstant) => {
  const stress = new FatigueStress(fatigueModel, minStress, maxStress, materialConstant)
  return stress.calculate()
}

export default fatigueStress
