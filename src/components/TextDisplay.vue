<template>
    <div class="w-1/2 p-5 flex flex-wrap bg-yellow-50 drop-shadow-lg my-5 px-10 py-20">
        <Word v-on:selected="handleSelected(i)" v-for="word, i in metadataArr" :key="word.word"
            :highlighted="highlighted(word.word,i)" :highlightSimilar="highlightSimilar(word.word)"
            :word="word.word"></Word>
    </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, ref} from "vue";
import type { Reactive } from "vue";
import Word from "./Word.vue";

const props = defineProps<{
    metadataArr: Reactive<{
        word: string;
        id: string;
        definition: string;
        partOfSpeech: string;
        dictionaryForm: string;
        meaning: string;
        formHere: string;
        notes: string;
    }[]>;
    handleSelected: (i: number) => void;
    currentWordIndex: number;
    mode: string;
    chunkLength: number;
    currentData: {
        word: string;
        id: string;
        definition: string;
        partOfSpeech: string;
        dictionaryForm: string;
        meaning: string;
        formHere: string;
        notes: string;
    };
}>();

const selection = ref([]);

const { metadataArr, handleSelected, currentWordIndex, currentData, mode, chunkLength } = toRefs(props);


const highlightSimilar = (word: string) => {
    // const { mode, currentData } = toRefs(props);
    if (mode.value == 'word')
        return word == currentData.value.word;
}

const highlighted = (word: string, index: number) => {
    // const { mode, currentData, chunkLength, currentWordIndex } = toRefs(props);
    if (mode.value == 'word')
        return word == currentData.value.definition;
    else if(mode.value == 'chunk'){
        return index >= currentWordIndex.value && index < currentWordIndex.value + chunkLength.value;
    }
}

</script>