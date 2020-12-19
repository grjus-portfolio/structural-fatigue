"use strict";

function Person(name, surname) {
  this.name = name;
  this.surname = surname;
  //   this.age = this._age;

  Object.defineProperties(this, {
    age: {
      get: function () {
        return this._age;
      },
      set: function (newAge) {
        if (newAge < 18) {
          this._age = "INMATURE_USER";
          return false;
        }
        this._age = newAge;
      },
    },
  });
}

const person = new Person("Grzegorz", "Juszkiewicz");
person.age = 3;
console.log(JSON.stringify(person, null, 2));
console.log(person.age);
