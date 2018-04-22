/**
Chapter

Resembles the properties and status of a chapter or an episode in a library entry.

Object structure:
Chapter {
  number: (String) The number of the chapter, does not limit to integers,
          possible values include '0', '-1', '1.5', 'Special 13' or
          'Epilogue 2'. This value is for show only, does not imply the order
          of the chapters, which is decided by order of the array containing
          this object. Should not clash with other chapters wihtin an entry.
  status: (String) Can be one of 'planned', 'current' or 'completed'.
          Independent from other chapters, e.g. completing a chapter should not
          assume the completion of previous chapters.
  names:  (Array of String) Names of the chapter, first element of the array is
          the default name, multiple names can be given to single chapter to
          enhance search. Should not clash with other chapters within an entry.
}
*/

import requireArgument from './require-argument.js';

class Chapter {

  constructor(options) {
    const self = this;

    let number = requireArgument(options.number, 'number').toString();

    let status = requireArgument(options.status,
      'status should be one of planned, current or completed',
      (a) => ['planned', 'current', 'completed'].includes(a));

    let names = options.names;
    if (!(names instanceof Array)) {
      names = [];
      if (options.name) {
        names.push(name);
      }
    }

    Object.assign(self, { number, status, names });
  }

  get planned() {
    return this.status === 'planned';
  }

  get current() {
    return this.status === 'current'
  }

  get completed() {
    return this.status === 'completed';
  }

  async setStatus(newStatus) {
    return this.status = requireArgument(newStatus,
      'status should be one of planned, current or completed',
      (a) => ['planned', 'current', 'completed'].includes(a));
  }

}

module.exports = Chapter;
