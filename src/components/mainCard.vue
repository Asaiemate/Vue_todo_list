<script setup lang="ts">
import { cities } from "../constants";
import { useDebounce } from "../hooks";
import { Ref, ref, watch } from "vue";
import { ICity } from "../models";

const props = defineProps<{
  onSearch: Function;
  cityName: string;
  error: string | null;
  weatherInfo: object | null;
  getWeather: () => void;
}>();

let filteredItems: Ref<ICity[]> = ref(cities);
let isOpen: Ref<boolean> = ref(false);

const openDropDown = () => {
  isOpen.value = true;
  filterItems();
};

const closeDropDown = () => {
  console.log("closeDropDown");
  isOpen.value = false;
  props.getWeather();
};

const filterItems = () => {
  console.log("filterItems");
  filteredItems.value = cities
    .filter(item => item.name.includes(props.cityName))
    .slice(0, 10);
};

const debounceFunction = () => {
  console.log("debounceFunction");
  useDebounce(() => {
    filterItems();
    console.log("useDebounce");
  }, 1000);
};

const searchChange = (event: Event) => {
  const inputValue = (event.target as HTMLInputElement).value;
  props.onSearch?.(inputValue);
};

const selectItem = (item: ICity) => {
  props.onSearch?.(item.name);
};

watch(() => props.cityName, debounceFunction);
</script>

<template>
  <div class="card mb-4 gradient-custom" style="border-radius: 25px">
    <div class="card-body p-4">
      <div class="input-group mb-3">
        <input
          @keyup.enter="closeDropDown"
          :value="cityName"
          @input="searchChange"
          @blur="closeDropDown"
          @focus="openDropDown"
          type="text"
          class="form-control"
          placeholder="City"
          aria-label="City"
          aria-describedby="basic-addon1"
        />
      </div>
      <ul v-if="isOpen" class="dropdown-list">
        <li
          v-for="(item, index) in filteredItems"
          :key="index"
          @click="selectItem(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <p v-if="error" class="text-danger font-italic">City not found</p>
      <div id="demo1" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ul class="carousel-indicators mb-0">
          <li data-target="#demo1" data-slide-to="0" class="active"></li>
          <li data-target="#demo1" data-slide-to="1"></li>
          <li data-target="#demo1" data-slide-to="2"></li>
        </ul>
        <!-- Carousel inner -->
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="d-flex justify-content-between mb-4 pb-2">
              <div>
                <h2 class="display-2"><strong>23°C</strong></h2>
                <p class="text-muted mb-0">Coimbra, Portugal</p>
              </div>
              <div>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp"
                  width="150px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
