class StressError extends Error {
  constructor (message:string) {
    super(message)
    this.message = message
    this.name = 'StressError'
  }
}

class RangeError extends Error {
  constructor (message:string) {
    super(message)
    this.message = message
    this.name = 'RangeError'
  }
}

export { StressError, RangeError }
