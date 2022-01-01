<template>
  <input v-model="value" type="text" />
  <p>{{ value }}</p>
</template>

<script>
export default {
  name: "DebounceWatcher1",

  data() {
    return {
      value: "",
    };
  },

  watch: {
    value(newValue, oldValue) {
      console.log("Value changed: ", newValue);
    },
  },
};
</script>