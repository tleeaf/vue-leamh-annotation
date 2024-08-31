<template>
    <span @click="$emit('selected')" class="px-2 text-lg min-w-0 hover:bg-slate-200" :class=" highlighted? 'bg-purple-600  text-white' : highlightSimilar ? 'bg-purple-200' : ''">{{ word }}</span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
    word: String,
    highlighted: Boolean,
    highlightSimilar: Boolean
})


</script>

<style scoped>
span{
    cursor: pointer;
}
</style>