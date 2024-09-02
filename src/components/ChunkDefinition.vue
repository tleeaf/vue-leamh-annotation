<template>
    <div v-if="!chunksDefined" class="flex flex-col h-screen my-5">
        <section>
            <h2 class="my-5">Please define the chunks for the text before beginning to annotate.</h2>
            <div class="flex justify-between">
                <div class="flex gap-5">
                    <Button @click="$emit('decreaseChunkLength')" class="p-2 border-2 border-gray-300 rounded-lg">
                        -</Button>
                    <Button @click="$emit('increaseChunkLength')" class="p-2 border-2 border-gray-300 rounded-lg">
                        +</Button>
                    <Button class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200" label="Save Chunk"
                        icon="pi pi-check" @click="$emit('saveChunk')"></Button>
                </div>
            </div>
        </section>
        <!-- <section class="">
            <div class="px-5 my-5 border-2 border-gray-200">
                <h2 class="py-5 text-2xl font-bold">Chunk List</h2>
                <ol class="flex-wrap px-5 overflow-y-scroll text-xl list-disc max-h- ">
                    <li v-for="(chunk, i) in chunks" class="py-1">{{ chunk.text }}</li>
                </ol>
            </div>
        </section> -->
        <h2 class="my-5 text-xl font-bold">Chunk List</h2>
        <section class="flex-grow overflow-y-auto">
            <p v-for="(chunk, i) in chunks" class="py-1">{{ chunk.text }}</p>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import Button from "primevue/button";
import type { Chunk } from "./AnnotationMaker.vue";
import ScrollPanel from "primevue/scrollpanel";

const props = defineProps<{
    chunksDefined: boolean;
    chunks: Chunk[];
}>();
const { chunksDefined, chunks } = toRefs(props);
</script>