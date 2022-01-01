<template>
  <div id="nav">
    <router-link to="/home">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/login2">Login2</router-link> |
    <button type="submit" @click.prevent="logout">Logout</button>

    <!-- <router-link to="/debounce0">Debounce0</router-link> |
    <router-link to="/debounce1">Debounce1</router-link> |
    <router-link to="/debounce2">Debounce2</router-link> -->
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    modalOpen: true,
  }),
  methods: {
    logout() {
      console.log("logout_function");
      axios({
        url: "http://localhost:5000/api/logout",
        method: "GET",
        withCredentials: true,
      })
        .then((resp) => {
          // console.log("resp/logout: ", resp);
          console.log("resp/login: ", resp.data);
          console.log("resp/login_token: ", resp.data.token);
          console.log("resp/login_user_name: ", resp.data.user_name);
          if (
            resp.data.token === null ||
            resp.data.user_name === "" ||
            resp.data.token === "" ||
            resp.data.user_name === null ||
            resp.data.error
          ) {
            this.$router.push("/login2");
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
