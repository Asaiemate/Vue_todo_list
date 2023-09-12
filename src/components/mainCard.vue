<script setup lang="ts">
import { cities } from "../constants";
import { useDebounce } from "../hooks";
import { Ref, ref, watch } from "vue";
import { ICity, IWeather } from "../models";
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
  onSearch: Function;
  cityName: string;
  error: string | null;
  weatherInfo: IWeather[] | null;
  getWeather: () => void;
}>();

let filteredItems: Ref<ICity[]> = ref(cities);
let isOpen: Ref<boolean> = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const openDropDown = () => {
  isOpen.value = true;
  filterItems();
};

const closeDropDown = () => {
  isOpen.value = false;
  props.getWeather();
};

const filterItems = (value?: string) => {
  const text = value ?? props.cityName;
  filteredItems.value = cities
    .filter(item =>
      item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    )
    .slice(0, 10);
};

const debounceFunction = () => {
  useDebounce(() => {
    filterItems();
  }, 1000);
};

const searchChange = (event: Event) => {
  const inputValue = (event.target as HTMLInputElement).value;
  props.onSearch?.(inputValue);
  filterItems(inputValue);
};

const selectItem = (item: ICity) => {
  props.onSearch?.(item.name);
};

const handleGlobalClick = (event: MouseEvent) => {
  if (!dropdownRef?.value?.contains(event.target as Node)) {
    closeDropDown();
  }
};

onMounted(() => {
  window.addEventListener("click", handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener("click", handleGlobalClick);
});

watch(() => props.cityName, debounceFunction);
</script>

<template>
  <div class="card mb-4 gradient-custom" style="border-radius: 25px">
    <div class="card-body p-4 dropdown">
      <div class="input-group mb-3" id="dropdown" ref="dropdownRef">
        <input
          @keyup.enter="closeDropDown"
          :value="cityName"
          @input="searchChange"
          @focus="openDropDown"
          type="text"
          class="form-control"
          placeholder="City"
          aria-label="City"
          aria-describedby="basic-addon1"
        />
        <ul v-if="isOpen" class="list-group">
          <li
            v-for="(item, index) in filteredItems"
            :key="index"
            @click="
              selectItem(item);
              closeDropDown();
            "
            class="list-group-item"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
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

          <a
            class="carousel-control-prev"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a
            class="carousel-control-next"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.list-group {
  position: absolute;
  width: 100%;
  top: 40px;
  left: 0;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: #fff;
}

/* Стиль для элементов списка */
.list-group-item {
  cursor: pointer; /* Добавление указателя мыши для элементов списка */
  /* Дополнительные стили по вашему желанию */
}
</style>
