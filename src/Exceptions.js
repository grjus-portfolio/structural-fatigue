export function FatigueException(message, name) {
  this.message = message;
  this.name = name || "Exception";
}

export const DamageException = "DamageException";
