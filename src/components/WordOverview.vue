<template>
    <main>
        //TODO: Add a list showing completion progress of the annotation, word by word.
        <div v-for="(word, i) in metadataArr" :key="word.word">
            <div class="flex justify-between">
                <span class="text-lg font-bold">{{ word.word }}</span>
                <span class="text-lg font-bold">{{ word.definition }}</span>
            </div>

        </div>
    </main>
</template>

<script setup lang="ts">
const props = defineProps<{
    metadataArr: any;
}>();
</script>

<style scoped></style>