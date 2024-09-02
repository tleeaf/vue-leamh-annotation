<template>
    <span @click="$emit('selected')" class="grid items-center h-10 min-w-0 px-2 my-2 text-xl font-bold hover:bg-slate-200"
        :class="dynamicClass">{{ word
        }}<span v-if="debug" class="text-xs text-center">{{ index }}</span></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    word: String,
    highlighted: Boolean,
    highlightSimilar: Boolean,
    index: Number,
    debug: Boolean,
    chunkHighlight: Boolean,
    chunkHighlightInner: Boolean,
    chunkLeft: Boolean,
    chunkRight: Boolean, 
    mode: String
})

const dynamicClass = computed(() => {
    let result = '';
    if(props.highlighted) {
            result += ' bg-purple-600 text-white border-1 border-black ';
        }
    if(props.mode== 'word') {
       
        if(props.highlightSimilar) {
            result += ' bg-purple-200 ';
        }
    }
     if(props.mode== 'chunk') {
        // if(props.chunkHighlight) {
        //     result += 'bg-purple-600 text-white border-1 border-black';
        // }
        if(props.chunkHighlightInner) {
            result+= ' border-b-2 border-gray-400 ';
        }
        if(props.chunkLeft) {
            result+=' border-l-2 border-gray-400 border-b-2 ml-2 ';   
        }
        if(props.chunkRight) {
            result += ' border-r-2 border-b-2 border-gray-400 mr-2 ';
        }
    }
   return result;
})
</script>

<style scoped>
span {
    cursor: pointer;
    font-family: 'Celtic';
}
</style>
