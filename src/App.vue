<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { mainCard, weekCart, dayCard } from "./components";

const key = import.meta.env.VITE_API_KEY;
const base_url = import.meta.env.VITE_BASE_URL;
const cityName = ref("Paris");
const onSearch = (value: string) => {
  cityName.value = value;
};
const weatherInfo = ref(null);
const error = ref(null);

function getWeather() {
  const url = `${base_url}?q=${cityName.value}&appid=${key}`;
  axios
    .get(url)
    .then(res => {
      weatherInfo.value = res.data.list;
      error.value = null;
    })
    .catch(err => (error.value = err.message));
}

onMounted(getWeather);
</script>

<template>
  <section class="vh-100" style="background-color: #c1cfea">
    <div class="container py-5 h-100">
      <div
        class="row d-flex justify-content-center align-items-center h-100"
        style="color: #282828"
      >
        <div class="col-md-9 col-lg-7 col-xl-5">
          <mainCard
            :onSearch="onSearch"
            :cityName="cityName"
            :error="error"
            :weatherInfo="weatherInfo"
            :getWeather="getWeather"
          />

          <dayCard />

          <weekCart />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gradient-custom {
  /* fallback for old browsers */
  background: #ffffff;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to right,
    rgba(255, 255, 255, 1),
    rgba(255, 236, 210, 1)
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1),
    rgba(255, 236, 210, 1)
  );
}

.carousel-indicators li {
  background-color: #282828;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
</style>
