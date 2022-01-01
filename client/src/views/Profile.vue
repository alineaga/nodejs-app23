<template>
  <div class="profile">
    <h3>This is an profile page of {{ user_name }}</h3>

    <button type="submit" @click.prevent="getPosts">Get posts</button>
    <br /><br />
    <button v-on:click="testEvent">Emit Event</button>
    <!-- <label>
      <input type="checkbox" checked="!checked" name="remember" /> Remember me
    </label> 
    {{ posts }} 
    <br />
    {{ posts[0] }} -->
    <!-- <ul>
      <li v-for="(post, id) in posts" :key="id">
        <br />
        <div class="tile">
          {{ post.post_title }}
          <br />
          <img :src="img_src" alt="Avatar" style="width: 50%" />
          <div class="container">
            <h4>
              <b>{{ post.post_content }}</b>
            </h4>
            <p>Author: {{ post.post_author }}</p>
          </div>
        </div>
      </li>
    </ul> -->

    <tr v-for="(post, id) in posts" :key="id">
      <td>
        <br />
        <div class="tile">
          {{ post.post_title }}
          <br />
          <!-- <img :src="img_src2" alt="Avatar" style="width: 50%" /> -->
          <div class="container">
            <h4>
              <b>{{ post.post_content }}</b>
            </h4>
            <h5>Author: {{ post.post_author }}</h5>
          </div>
        </div>
      </td>
    </tr>

    <table v-show="posts.length">
      <thead>
        <tr>
          <th>Titlu</th>
          <th>Continut</th>
          <th>Autor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, id) in posts" :key="id">
          <td>{{ post.post_title }}</td>
          <td>{{ post.post_content }}</td>
          <td>{{ post.post_author }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import axios from "axios";
//import useEmitter from "@/composables/useEmitter";
export default {
  props: {
    //msg: String,
    //user_name: String,
  },
  data() {
    return {
      isOpen: true,
      i: 1,
      verifyToken: false,
      user_name: "",
      posts: [],
      img_src1: "",
      img_src2: "",
      //img_src1: "https://picsum.photos/id/1005/600/200",
      //img_src2: "https://images.unsplash.com/photo-1464054313797-e27fb58e90a9?dpr=1&auto=format&crop=entropy&fit=crop&w=1500&h=996&q=80'/",
    };
  },

  methods: {
    testEvent() {
      this.emitter.on("testEvent", (isOpen) => {
        this.isOpen = isOpen;
      });
    },

    getPosts: function () {
      axios({
        url: "http://localhost:5000/api/posts",
        method: "GET",
        withCredentials: true,
      })
        .then((resp) => {
          console.log("resp_getPosts0: ", resp);
          console.log("resp_getPosts1 ", resp.data);
          console.log("resp_getPosts2 ", resp.data.posts);
          this.posts = resp.data.posts;
          if (resp.data.error) {
            this.$router.push("/login2");
          }
        })
        .catch((err) => {
          console.log("err_getPosts: ", err);
        });
    },

    verifyLogin: function () {
      axios
        .create({ withCredentials: true })
        .get("http://localhost:5000/api/verify")
        .then((resp) => {
          console.log("resp_verify0: ", resp);
          this.user_name = resp.data.user_name;
          //console.log("resp_verify1: ", resp.data);
          //console.log("resp_verify2: ", resp.data.cookieVerify);
          if (resp.data.error) {
            alert("profile Sesiunea a expirat! Va rugam sa va logati!");
            this.$router.push("/login2");
          }
        })
        .catch((err) => {
          console.log("err_verify: ", err);
        });
    },

    verifyCsrf: function () {
      axios
        .create({ withCredentials: true })
        .get("http://localhost:5000/api/csrf")
        .then((response) => {
          //console.log("response_verifyCsrf:", response.data.message);
          console.log(response.data.message);
        })
        .catch((err) => {
          console.log("err_verifyCsrf: ", err);
        });
    },
  },
  beforeMount() {
    //this.verifyLogin();
    this.verifyCsrf();
  },
  created() {
    this.verifyLogin();
  },
  mounted() {
    setTimeout(() => {
      this.i++;
      window.addEventListener("click", this.verifyLogin);
      console.log("resp_setTimeout: ", this.i);
    }, 1000 * 60 * 14);
  },
};
</script>


<style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 40%;
}

.card2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card3 {
  /* other default style */
  grid-row: 2/3;
  grid-column: 2/3;
  margin: 0 auto;
  display: grid;
  grid-template-rows: 1fr 6fr 1fr;
}

.card3 div {
  grid-row: 2/3;
}

.card4 {
  position: relative;
  top: 50%;
  left: 20%;
  transform: translateX(-50%) translateY(-50%);
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.container {
  padding: 2px 16px;
}

.wrap {
  margin: 50px auto 0 auto;
  width: 100%;
  display: flex;
  align-items: space-around;
  max-width: 1200px;
}
.tile {
  width: 550px;
  height: 200px;
  margin: 10px;
  background-color: #99aeff;
  display: inline-block;
  background-size: cover;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease-out;
  box-shadow: 0px 35px 77px -17px rgba(0, 0, 0, 0.44);
  overflow: hidden;
  color: white;
  font-family: "Roboto";
}
.tile img {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  transition: all 0.4s ease-out;
}
.tile .text {
  /*   z-index:99; */
  position: absolute;
  padding: 30px;
  height: calc(100% - 60px);
}
.tile h1 {
  font-weight: 300;
  margin: 0;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
.tile h2 {
  font-weight: 100;
  margin: 20px 0 0 0;
  font-style: italic;
  transform: translateX(200px);
}
.tile p {
  font-weight: 300;
  margin: 20px 0 0 0;
  line-height: 25px;
  /*   opacity:0; */
  transform: translateX(-200px);
  transition-delay: 0.2s;
}
.animate-text {
  opacity: 0;
  transition: all 0.6s ease-in-out;
}
.tile:hover {
  /*   background-color:#99aeff; */
  box-shadow: 0px 35px 77px -17px rgba(0, 0, 0, 0.64);
  transform: scale(1.05);
}
.tile:hover img {
  opacity: 0.2;
}
.tile:hover .animate-text {
  transform: translateX(0);
  opacity: 1;
}
.dots {
  position: absolute;
  bottom: 20px;
  right: 30px;
  margin: 0 auto;
  width: 30px;
  height: 30px;
  color: currentColor;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.dots span {
  width: 5px;
  height: 5px;
  background-color: currentColor;
  border-radius: 50%;
  display: block;
  opacity: 0;
  transition: transform 0.4s ease-out, opacity 0.5s ease;
  transform: translateY(30px);
}

.tile:hover span {
  opacity: 1;
  transform: translateY(0px);
}

.dots span:nth-child(1) {
  transition-delay: 0.05s;
}
.dots span:nth-child(2) {
  transition-delay: 0.1s;
}
.dots span:nth-child(3) {
  transition-delay: 0.15s;
}
</style>