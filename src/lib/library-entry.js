/**
LibraryEntry

Resembles the properties and status of a library entry.

Object structure:
LibraryEntry {
  id:             (Integer) ID, used for PK and wihtin URLs.
  names:          (Array of String) Names of the entry, first element of the
                  array is the default name, multiple names can be given to
                  single entry to enhance search. Should not clash with other
                  entries.
  status:         (String) Can be one of 'current', 'planned', 'completed',
                  'on_hold' or 'dropped'. See src/lib/library-entry-statuses.js.
  completedTimes: (Integer) Times the entry has been completed.
  mediaType:      (String) Can be 'book' or 'series', affects wording in UI,
                  e.g. 'read' or 'watch', 'chapter' or 'episode'.
  picture:        (String) URI (http, https, data) of the cover picture.
  chapters:       (Array of Chapter) Chapters the entry have, each chapter has
                  its own status. See src/lib/chapter.js.
}
*/

import requireArgument from './require-argument.js';
import LibraryEntryStatuses from './library-entry-statuses.js';
import Chapter from './chapter.js';
import ActionUnapplicableError from './action-unapplicable-error.js';

class LibraryEntry {

  constructor(options) {
    const self = this;

    let id = requireArgument(options.id, 'id');

    let names = options.names;
    if (!(names instanceof Array)) {
      names = [];
      if (options.name) {
        names.push(options.name);
      }
    }

    let status = requireArgument(options.status,
      'status should be one of current, planned, completed, on_hold or dropped',
      (a) => LibraryEntryStatuses.selections.includes(a));

    let completedTimes = options.completedTimes || 0;

    let mediaType = requireArgument(options.mediaType,
      'mediaType should be one of book or series',
      (a) => ['book', 'series'].includes(a));

    let picture = options.picture;

    let chapters = (options.chapters || []).map((chapter) => {
      if (chapter instanceof Chapter) {
        return chapter;
      } else {
        return new Chapter(chapter);
      }
    });

    Object.assign(self, { id, names, status, completedTimes, mediaType, picture, chapters });
  }

  get name() {
    return this.names[0];
  }

  get totalChapters() {
    return this.chapters.length;
  }

  get completedChapters() {
    return this.chapters.filter((ch) => ch.completed).length;
  }

  get haveContinuousProgress() {
    const self = this;

    let haveIncompletedChapters = false;

    for (let i = 0; i < self.chapters.length; i++) {
      let chapter = self.chapters[i];
      if (chapter.completed || chapter.current) {
        if (haveIncompletedChapters) {
          return false;
        }
      }
      if (!chapter.completed) {
        haveIncompletedChapters = true;
      }
    }

    return true;
  }

  startConsuming() {
    const self = this;

    if (self.status === 'planned') {
      self.status = 'current';
    } else {
      throw new ActionUnapplicableError(self, `Can not startConsuming a LibraryEntry with status ${self.status}`);
    }
  }

  increaseProgress(n) {
    const self = this;

    if (self.status !== 'current') {
      throw new ActionUnapplicableError(self, `Can not increaseProgress a LibraryEntry with status ${self.status}`);
    }
    if (!self.haveContinuousProgress) {
      throw new ActionUnapplicableError(self, 'Can not increaseProgress a LibraryEntry with discontinuous progress');
    }

    self.completedChapters += n;
  }

  decreaseProgress(n) {
    const self = this;

    if (self.status !== 'current') {
      throw new ActionUnapplicableError(self, `Can not decreaseProgress a LibraryEntry with status ${self.status}`);
    }
    if (!self.haveContinuousProgress) {
      throw new ActionUnapplicableError(self, 'Can not decreaseProgress a LibraryEntry with discontinuous progress');
    }

    self.completedChapters -= n;
  }

}

module.exports = LibraryEntry;
