const LibraryEntryActions = {
  all: {
    start_consuming: {
      name: 'start_consuming',
      icon: 'play_arrow',
      execute: async function(entry) {
        return await entry.startConsuming();
      }
    },
    progress_plus_one: {
      name: 'progress_plus_one',
      icon: 'plus_one',
      execute: async function(entry) {}
    },
    set_complete: {
      name: 'set_complete',
      icon: 'done',
      execute: async function(entry) {}
    },
    drop: {
      name: 'drop',
      icon: 'close',
      execute: async function(entry) {}
    },
    hold: {
      name: 'hold',
      icon: 'pause',
      execute: async function(entry) {}
    },
    resume_consuming: {
      name: 'resume_consuming',
      icon: 'play_arrow',
      execute: async function(entry) {}
    },
    consume_again: {
      name: 'consume_again',
      icon: 'replay',
      execute: async function(entry) {}
    }
  },
  availableForStatus: {
    current: {
      primary: 'progress_plus_one',
      secondary: ['hold', 'drop']
    },
    current_full_progress: {
      primary: 'set_complete',
      secondary: []
    },
    planned: {
      primary: 'start_consuming',
      secondary: ['progress_plus_one', 'drop']
    },
    completed: {
      primary: 'consume_again',
      secondary: []
    },
    on_hold: {
      primary: 'resume_consuming',
      secondary: ['drop']
    },
    dropped: {
      primary: 'resume_consuming',
      secondary: []
    }
  },

  actionsForEntry(entry) {
    let statusInMindOfProgress = entry.status;
    if (entry.status === 'current' && entry.totalChapters === entry.completedChapters) {
      statusInMindOfProgress = 'current_full_progress';
    }

    return {
      primary: LibraryEntryActions.all[LibraryEntryActions.availableForStatus[statusInMindOfProgress].primary],
      secondary: LibraryEntryActions.availableForStatus[statusInMindOfProgress].secondary.map((a) => LibraryEntryActions.all[a])
    };
  }
};

module.exports = LibraryEntryActions;
