<template>
    <h1 class="font-bold text-3xl my-10 text-center">Chunk Annotation</h1>
    <div class="flex justify-between">
        <Button @click="$emit('prevChunk')" class="p-2 border-2 border-gray-300 rounded-lg">Previous Chunk</Button>
        <Button @click="$emit('nextChunk')" class="p-2 border-2 border-gray-300 rounded-lg">Next Chunk</Button>
    </div>
    <div class="grid gap-10 items-center my-5 border-2 border-gray-300 rounded-lg p-5 shadow-md">
        <!-- <div class="flex gap-5 justify-between">
            <Button class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use Last Entry</Button>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div> -->

        <div class="flex justify-between">
            <label for="meaning" class="text-lg font-bold pr-5">Meaning</label>
            <!-- <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button> -->
            <InputText class="flex-grow" type="text" v-model="currentData.meaning" placeholder="Meaning" aria-label="Meaning" />
            <!-- <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button> -->
        </div>
    
        <div class="flex justify-between">
            <label for="notes" class="text-lg font-bold pr-5">Notes</label>
            <!-- <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button> -->
            <InputText class="flex-grow" type="text" v-model="currentData.notes" placeholder="Notes" aria-label="Notes" />
            <!-- <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button> -->
        </div>
        <Button @click="generateJSONFile" label="Generate JSON File" icon="pi pi-download"
            class="p-2 border-2 border-gray-300 rounded-lg">Generate JSON
            File</Button>
    </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, } from "vue";
import InputText from "primevue/inputtext";
import Select from "primevue/select";

const props = defineProps<{
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
    chunkLength: number;
    generateJSONFile: () => void;
}>();

const partsOfSpeech = reactive(['Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Copula', 'Demonstrative', 'Possessive Pronoun', 'Vocative Particle', 'Negative Conjunct Particle']);
const { currentData, generateJSONFile } = toRefs(props);
</script>