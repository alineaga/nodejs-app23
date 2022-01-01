<template>
  <input v-model="value" type="text" />
  <p>{{ value }}</p>
</template>

<script>
import debounce from "lodash.debounce";

export default {
  name: "DebounceWatcher0",

  data() {
    return {
      value: "",
    };
  },

  // watch: {
  //   value(newValue, oldValue) {
  //     console.log("Value changed: ", newValue);
  //   },
  // },
  watch: {
    value(...args) {
      this.debouncedWatch(...args);
    },
  },
  create() {
    this.debouncedWatch = debounce((newValue, oldValue) => {
      console.log("New value:", newValue);
    }, 500);
  },
  beforeUnmount() {
    this.debouncedWatch.cancel();
  },
};
</script>