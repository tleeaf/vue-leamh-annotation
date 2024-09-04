<template>
    <div class="flex flex-wrap w-1/2 max-h-screen p-10 my-5 overflow-auto align-top bg-yellow-50 drop-shadow-lg">
        <Word v-on:selected="handleSelected(i)" v-for="word, i in words" :key="word" :index="i"
            :highlighted="highlighted(word,i)" :highlightSimilar="highlightSimilar(word)" :mode="mode"
            :word="word" :debug="debug" :chunkHighlight="chunkHighlight(i)" :chunkHighlightInner="chunkHighlightInner(i)" :chunkLeft="chunkLeft(i)" :chunkRight="chunkRight(i)"></Word>
    </div>
</template>

<script lang="ts" setup>
//TODO: Add an outline for saved chunks.
import { toRefs, defineProps, ref, computed} from "vue";
import type { Reactive } from "vue";
import Word from "./Word.vue";
import type { Chunk, Metadata } from "../types/Types";

const props = defineProps<{
    // metadataArr: Reactive<{
    //     word: string;
    //     id: string;
    //     definition: string;
    //     partOfSpeech: string;
    //     dictionaryForm: string;
    //     meaning: string;
    //     formHere: string;
    //     notes: string;
    // }[]>;
    metadataArr: Metadata[];
    handleSelected: (i: number) => void;
    currentWordIndex: number;
    mode: string;
    chunkLength: number;
    chunks:  Chunk[]; 
    words: string[];
    currentData: Metadata;
    debug: boolean;
}>();

const selection = ref([]);

const { metadataArr, handleSelected, currentWordIndex, currentData, mode, chunkLength } = toRefs(props);


const highlightSimilar = (word: string) => {
    if (mode.value == 'word')
        return word == currentData.value.word;
}

const highlighted = (word: string, index: number) => {
    // const { mode, currentData, chunkLength, currentWordIndex } = toRefs(props);
    if (mode.value == 'word')
        return index == currentWordIndex.value;
    else if(mode.value == 'chunk'){
        return index >= currentWordIndex.value && index < currentWordIndex.value + chunkLength.value;
    }
}

const chunkHighlight = (index: number) => {
    return !!props.chunks.find(chunk => chunk.startIndex <= index && chunk.startIndex + chunk.length > index);
}

const chunkHighlightInner = (index: number) => {
    return !!props.chunks.find(chunk => chunk.startIndex < index && chunk.startIndex + chunk.length > index);
}
const chunkLeft = (index: number) => {
    return !!props.chunks.find(chunk => chunk.startIndex == index);
}
const chunkRight = (index: number) => {
    return !!props.chunks.find(chunk => chunk.startIndex + chunk.length - 1 == index);
}
</script>

