<template>
<div>
  <div :class="['library-sidebar', {'library-sidebar-opened': mobileSidebarOpened}]">
    <nav>
      <ul>
        <li v-for="link in sidebarLinks">
          <router-link :to="'/' + link">
            <i class="material-icons" aria-hidden="true">{{ statusIcons[link] }}</i>
            <span class="text-truncate">{{ $t(`library.common.status.${link}`) }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <button class="library-sidebar-toggle-button btn btn-light" @click="toggleSidebar"
      :aria-label="mobileSidebarOpened ? $t('application.close_sidebar') : $t('application.other_statuses_menu')">
      <i class="material-icons" aria-hidden="true">menu</i>
    </button>
  </div>
  <main class="library-main">
    <h1 class="library-title">{{ $t(`library.common.status.${activeListStatus}`) }}</h1>
    <ul class="library-list">
      <li v-for="entry in shownEntries">
        <router-link class="library-list-item-detail-link btn" :to="{ name: 'detail', params: { entryId: entry.id } }">
          <span class="library-list-item-picture">
            <img :src="entry.picture" :alt="$t(`library.${entry.mediaType}.cover_picture_of_name`, {name: entry.name})">
          </span>
          <span class="library-list-item-name text-truncate">{{ entry.name }}</span>
          <span class="library-list-item-status">
            <i class="material-icons" aria-hidden="true">{{ statusIcons[entry.status] }}</i>
            <span class="library-list-item-status-text">{{ $t(`library.${entry.mediaType}.status.${entry.status}`) }}</span>
          </span>
          <span class="library-list-item-progress">
            <span class="library-list-item-progress-text">{{ entry.completedChapters }}/{{ entry.totalChapters }}</span>
            <span class="progress">
              <span class="progress-bar" role="progressbar"
                :style="{ width: (entry.completedChapters / entry.totalChapters * 100).toFixed(2) + '%' }"
                :aria-valuenow="entry.completedChapters" aria-valuemin="0" :aria-valuemax="entry.totalChapters"></span>
            </span>
          </span>
        </router-link>
        <button v-if="actionsForEntry(entry).primary" class="library-list-item-button btn" :aria-label="$t(`library.${entry.mediaType}.${actionsForEntry(entry).primary.name}`)">
          <i class="material-icons" aria-hidden="true">{{ actionsForEntry(entry).primary.icon }}</i>
        </button>
        <button class="library-list-item-button btn" :aria-label="$t(`library.${entry.mediaType}.more_actions`)">
          <i class="material-icons" aria-hidden="true">more_vert</i>
        </button>
      </li>
    </ul>
  </main>
</div>
</template>

<script>
import LibraryEntry from '../lib/library-entry.js';
import LibraryEntryActions from '../lib/library-entry-actions.js';

export default {
  data: () => ({
    statusIcons: require('../lib/library-entry-statuses.js').icons,
    sidebarLinks: require('../lib/library-entry-statuses.js').list,
    mobileSidebarOpened: false,
    shownEntries: [
      new LibraryEntry({
        id: 1,
        name: 'Zero no Tsukaima',
        status: 'completed',
        completedTimes: 1,
        mediaType: 'series',
        picture: "https://myanimelist.cdn-dena.com/images/anime/8/20680l.jpg",
        chapters: Array.from(Array(13)).map((a, i) => ({
          number: i + 1,
          status: 'completed',
        }))
      }),
      new LibraryEntry({
        id: 2,
        name: 'Hayate the Combat Butler',
        status: 'planned',
        completedTimes: 0,
        mediaType: 'series',
        picture: "https://myanimelist.cdn-dena.com/images/anime/7/73932l.jpg",
        chapters: Array.from(Array(52)).map((a, i) => ({
          number: i + 1,
          status: 'planned'
        }))
      }),
      new LibraryEntry({
        id: 3,
        name: 'Toradora',
        status: 'current',
        completedTimes: 0,
        mediaType: 'series',
        picture: "https://myanimelist.cdn-dena.com/images/anime/13/22128l.jpg",
        chapters: Array.from(Array(25)).map((a, i) => ({
          number: i + 1,
          status: 'planned'
        }))
      }),
      new LibraryEntry({
        id: 4,
        name: 'Shakugan no Shana',
        status: 'current',
        completedTimes: 0,
        mediaType: 'series',
        picture: "https://myanimelist.cdn-dena.com/images/anime/8/21197l.jpg",
        chapters: Array.from(Array(24)).map((a, i) => ({
          number: i + 1,
          status: i < 12 ? 'completed' : 'planned'
        }))
      })
    ]
  }),
  props: ['listStatus'],
  computed: {
    activeListStatus() {
      return this.listStatus || 'all';
    },
    pageTitle() {
      if (this.listStatus) {
        return this.$t(`library.common.status.${this.listStatus}`)
      } else {
        return null;
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.mobileSidebarOpened = !this.mobileSidebarOpened;
    },
    actionsForEntry: LibraryEntryActions.actionsForEntry
  },
  beforeRouteLeave(to, from, next) {
    this.mobileSidebarOpened = false;
    next();
  }
};
</script>

<style lang="scss">
.library-sidebar {
  position: fixed;
  z-index: $zindex-fixed - 5;
  top: 4rem;
  left: 0;
  width: 20rem;
  height: calc(100vh - 4rem);

  nav {
    height: 100%;
    color: $gray-700;
    background: $gray-100;
    overflow-y: auto;

    ul {
      list-style: none;
      margin: 0;
      padding: 0.75rem 0;
    }

    a {
      display: flex;
      align-items: center;
      height: 3rem;
      padding: 0.75rem;
      white-space: nowrap;
      color: inherit;

      transition: background-color 0.15s ease-in-out;

      &:hover {
        color: inherit;
        text-decoration: none;
        background: $gray-200;
      }

      i.material-icons {
        margin-right: 0.75rem;
      }
    }
  }
}

.library-sidebar-toggle-button {
  display: none;
}

.library-main {
  margin-left: 20rem;
  padding: 3rem 2rem;
}

.library-title {
  margin-bottom: 2rem;
}

.library-list li, .library-list-item-detail-link, .library-list-item-button {
  display: flex;
  align-items: center;
  height: 4rem;
}

.library-list-item-detail-link, .library-list-item-button {
  color: inherit;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;

  &:first-child {
    margin-left: -1px;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  &:last-child {
    margin-right: -1px;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  &:hover {
    color: inherit;
    background: $gray-300;
  }
}

.library-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
    border: 1px solid $gray-300;
    border-radius: 0.25rem;
  }
}

.library-list-item-detail-link {
  flex-grow: 1;
  text-align: left;
}

.library-list-item-picture {
  width: 4rem;
  height: 4rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    overflow: hidden;
  }
}

.library-list-item-name {
  margin-right: 1rem;
  flex-grow: 1;
}

.library-list-item-status {
  display: flex;
  align-items: center;
  width: 12rem;
  margin-right: 0.75rem;

  i.material-icons {
    margin-right: 0.4rem;
  }
}

.library-list-item-progress {
  width: 5rem;
  margin-right: 0.75rem;
}

.library-list-item-progress-text {
  display: block;
  text-align: center;
  font-size: 0.75rem;
}

.library-list-item-button {
  width: 4rem;
  justify-content: center;
}

@include media-breakpoint-down(lg) {
  .library-sidebar {
    width: 26.6667vw;
  }

  .library-main {
    margin-left: 26.6667vw;
  }
}

@include media-breakpoint-down(sm) {
  .library-sidebar {
    width: 33.3333vw;
  }

  .library-main {
    margin-left: 33.3333vw;
    padding: 1.5rem;
  }
}

@include media-breakpoint-down(xs) {
  .library-sidebar {
    left: -100vw;
    width: 100vw;

    transition: left 0.15s ease-in-out;

    nav ul {
      padding-top: 4rem;
    }
  }

  .library-sidebar-toggle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1.8rem;
    left: 100vw;
    margin-left: 1.5rem;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;

    transition-property: top, left, margin-left;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
  }

  .library-sidebar-opened {
    left: 0;

    .library-sidebar-toggle-button {
      top: 0.75rem;
      left: 0;
      margin-left: 0.75rem;
    }
  }

  .library-main {
    margin-left: 0;
  }

  .library-title {
    margin-left: 3.5rem;
  }
}
</style>
