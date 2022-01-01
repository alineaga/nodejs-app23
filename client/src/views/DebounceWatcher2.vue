<template>
  <input v-on:input="handler" type="text" />
  <p>Value: {{ value }}</p>
</template>

<script>
export default {
  name: "DebounceWatcher2",
  data() {
    return {
      value: "",
      args: 500,
    };
  },

  // watch: {
  //   value(newValue, oldValue) {
  //     console.log("Value changed: ", newValue);
  //   },
  // },

  methods: {
    handler(event) {
      console.log("New value:", event.target.value);
    },
  },
};
</script>
