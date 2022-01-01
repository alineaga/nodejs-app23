<template>
  <div id="container">
    {{ msg }}
    <form>
      <div class="container">
        <label for="uname"><b>Username</b></label>
        <input
          type="text"
          placeholder="Enter Username"
          name="user_name"
          v-model="user_name"
          required
        />

        <label for="uname"><b>Email</b></label>
        <input
          type="text"
          placeholder="Enter Email"
          name="uname"
          v-model="user_email"
          required
        />

        <label for="psw"><b>Password</b></label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          v-model="user_password"
          required
        />

        <button type="submit" @click.prevent="register">Register</button>
        <!-- <label>
          <input type="checkbox" checked="!checked" name="remember" /> Remember
          me
        </label> -->
      </div>
    </form>
  </div>
</template>

<script>
//import Swal from "sweetalert2";
import axios from "axios";
import qs from "qs";
export default {
  props: {
    msg: String,
    // user_name: String,
  },
  data() {
    return {
      user_name: "",
      checked: false,
      linktermeni: "Termeni_si_conditii_de_utilizare",
      errors: "",
      user_name: "",
      user_email: "",
      user_password: "",
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      select: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
      ex4: [
        "red",
        "indigo",
        "orange",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "red darken-3",
        "indigo darken-3",
        "orange darken-3",
      ],
      loader: null,
      loading: false,
      loading2: false,
    };
  },
  // beforeDestroy () {
  //     clearInterval(this.interval)
  // },
  // mounted () {
  //   this.interval = setInterval(() => {
  //     if (this.value === 100) {
  //       return (this.value = 0)
  //     }
  //     this.value += 10
  //   }, 1000)
  // },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => ((this[l] = false), this.login()), 2000);

      this.loader = null;
    },
  },
  methods: {
    loadOnce: function () {
      //location.reload();
      this.loading = true;
      setTimeout(() => this.login(), 2000);
    },
    //  async recaptcha() {
    //   // (optional) Wait until recaptcha has been loaded.
    //   await this.$recaptchaLoaded()

    //   // Execute reCAPTCHA with action "login".
    //   const token = await this.$recaptcha('login')

    //   // Do stuff with the received token.
    // },
    register: function () {
      let user_email = this.user_email;
      let user_password = this.user_password;
      let user_name = this.user_name;
      let user = {
        user_email,
        user_password,
        user_name,
      };
      if (
        user_email &&
        user_password &&
        user_name &&
        user_email.length &&
        user_password.length
      ) {
        return new Promise((resolve, reject) => {
          axios({
            url: "http://localhost:5000/api/register",
            data: qs.stringify(user),
            method: "POST",
            withCredentials: true,
          })
            .then((resp) => {
              console.log("resp/login: ", resp);
              console.log("resp/login: ", resp.data);
              // commit("auth_success", token, user);
              // resolve(resp);
              if (resp.data.error) {
                this.$router.push("/login2");
              } else {
                this.$router.push("/profile");
              }
            })
            .catch((err) => {
              localStorage.removeItem("token");
              reject(err);
            });
        });
      }
    },

    login: function () {
      let email = this.email;
      let password = this.password;
      let user = {
        email,
        password,
      };
      console.log("email_password: ", email + " : " + password);
      if (email && password && email.length && password.length) {
        return new Promise((resolve, reject) => {
          axios({
            url: "http://localhost:5000/login",
            data: qs.stringify(user),
            method: "POST",
            withCredentials: true,
          })
            .then((resp) => {
              console.log("resp/login: ", resp);
              console.log("resp/login: ", resp.data);
              // commit("auth_success", token, user);
              // resolve(resp);
              if (resp.data.error) {
                this.$router.push("/login2");
              } else {
                const token = resp.data.token;
                // this.props.user_name = resp.data.user_name;
                axios.defaults.headers.common["Authorization"] = token;
                this.$router.push("/profile");
              }
            })
            .catch((err) => {
              localStorage.removeItem("token");
              reject(err);
            });
        });
      }
    },
    getRandomNumber: function () {
      this.codsig = this.generateNumber();
    },
    generateNumber: function () {
      return Math.floor(Math.random() * (999999999 - 10000000 + 1) + 10000000);
    },
    verifyCode: function () {
      if (this.codsig == this.codsigverif) {
        this.isCodeCorect = true;
        //console.log(this.codsig);
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only 
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
-->

<style scoped>
/* Add padding to containers */
container {
  padding: 16px;
  width: 400px;
  margin: 0 auto;
}
/* Bordered form */
form {
  border: 3px solid #f1f1f1;
  width: 400px;
  margin: 0 auto;
}

/* Full-width inputs */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

/* Set a style for all buttons */
button {
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

/* Add a hover effect for buttons */
button:hover {
  opacity: 0.8;
}

/* Extra style for the cancel button (red) */
.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

/* Center the avatar image inside this container */
.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
}

/* Avatar image */
img.avatar {
  width: 40%;
  border-radius: 50%;
}

/* Add padding to containers */
.container {
  padding: 16px;
}

/* The "Forgot password" text */
span.psw {
  float: right;
  padding-top: 16px;
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
    display: block;
    float: none;
  }
  .cancelbtn {
    width: 100%;
  }
}
</style>
