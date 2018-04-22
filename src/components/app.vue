<template>
<div id="app">
  <header class="header">
    <div class="app-name"><router-link to="/">sedosipE</router-link></div>
    <form class="search-bar form-inline">
      <input type="search" aria-label="search" :placeholder="$t('application.search')" class="form-control">
      <button type="submit" class="hidden">{{ $t('application.search') }}</button>
    </form>
    <ul class="header-buttons">
      <li>
        <a @click.prevent="openSettings" href="#" role="button" :aria-label="$t('application.settings')">
          <i class="material-icons" aria-hidden="true">settings</i>
        </a>
      </li>
    </ul>
  </header>
  <div class="root-view">
    <router-view />
  </div>
</div>
</template>

<script>
export default {
  data: () => ({
    //
  }),
  methods: {
    openSettings() {
      //
    }
  }
};
</script>

<style lang="scss">
.header, .app-name a, .search-bar, .header-buttons, .header-buttons a {
  height: 4rem;
  display: flex;
  align-items: center;
}

.header {
  position: fixed;
  z-index: $zindex-fixed;
  top: 0;
  width: 100%;
  background-color: $primary;
  color: white;
}

.app-name a, .header-buttons a {
  color: inherit;

  transition: background-color 0.15s ease-in-out;

  &:hover {
    color: inherit;
    text-decoration: none;
    background: darken($primary, 15%);
  }
}

.app-name a {
  padding: 0 1rem;
  font-size: 1.2rem;
}

.search-bar {
  padding: 0 1rem;
  flex-grow: 1;
  max-width: 30rem;

  @include media-breakpoint-down(md) {
    padding: 0 0.5rem;
  }

  input[type="search"] {
    width: 100%;
    height: 2.6rem;
    border: 1px solid transparent;
    background: darken($primary, 5%);
    color: white;

    transition-property: border-color, background-color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;

    &::placeholder {
      color: lighten($primary, 20%);
    }

    &:hover {
      background: darken($primary, 10%);
    }

    &:focus {
      background: $primary;
      color: white;
      border: 1px solid darken($primary, 15%);
    }
  }

  button[type="submit"] {
    display: none;
  }
}

.header-buttons {
  list-style-type: none;
  margin: 0 0 0 auto;
  padding: 0;

  a {
    width: 4rem;
    justify-content: center;
  }
}

.root-view {
  margin-top: 4rem;
}
</style>
