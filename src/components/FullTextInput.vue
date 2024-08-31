<template>
    <div>
        <h1>Léamh JSON Annotation Generator</h1>
        <Textarea rows="5" cols="30" v-model="value" placeholder="Type here..."></Textarea>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const value = ref('');

   

</script>

<style scoped>

</style>