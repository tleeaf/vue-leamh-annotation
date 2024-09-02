<template>
    <div class="max-h-screen min-h-full p-10 overflow-hidden border-2 border-gray-200">
        <h1 class="text-3xl font-bold text-center ">Chunk Annotation <i class="px-5 text-xl pi pi-arrows-h"></i></h1>
    <ChunkDefinition v-if="!chunksDefined" :chunksDefined="chunksDefined" @decrease-chunk-length="$emit('decreaseChunkLength')" @increase-chunkLength="$emit('increaseChunkLength')" @save-chunk="$emit('saveChunk')" :chunks="chunks"></ChunkDefinition>

        <div v-if="chunksDefined"
            class="grid items-center gap-10 p-5 my-5 border-2 border-gray-300 rounded-lg shadow-md">
            <div class="flex justify-start gap-5">
                <Button @click="$emit('prevChunk')" class="p-2 border-2 border-gray-300 rounded-lg">Previous
                    Chunk</Button>
                <Button @click="$emit('nextChunk')" class="p-2 border-2 border-gray-300 rounded-lg">Next Chunk</Button>
            </div>
            <div class="flex justify-between">
                <label for="meaning" class="pr-5 text-lg font-bold">Translation</label>

                <InputText class="flex-grow" type="text" v-model="currentChunkData.translation"
                    placeholder="Translation" aria-label="Translation" />

            </div>

            <div class="flex justify-between">
                <label for="notes" class="pr-5 text-lg font-bold">Notes</label>

                <InputText class="flex-grow" type="text" v-model="currentChunkData.notes" placeholder="Notes"
                    aria-label="Notes" />

            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import ChunkDefinition from './ChunkDefinition.vue'
import Button from "primevue/button";
import { toRefs, } from "vue";
import InputText from "primevue/inputtext";

const props = defineProps<{
    currentChunkData: {
        startIndex: number;
        length: number;
        translation: string;
        notes: string;
    };
    chunkLength: number;
    chunksDefined: boolean;
    chunks: Chunk[];
}>();

const { currentChunkData } = toRefs(props);
</script>