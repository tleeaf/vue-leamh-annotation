<template>
    <h1 class="font-bold text-3xl my-10 text-center">Word-by-Word Annotation</h1>
       <div class="flex justify-between my-5">
                    <Button @click="$emit('prevWord')" class="p-2 border-2 border-gray-300 rounded-lg">Previous
                        Word</Button>
                    <!-- <h1 class="text-3xl font-bold text-center">
                        {{ arr[currentWordIndex] }}
                    </h1> -->
                    <Button @click="$emit('nextWord')" class="p-2 border-2 border-gray-300 rounded-lg">Next
                        Word</Button>
                </div>
                <!-- <div class="flex justify-between my-5" v-if="numberOfInstances > 1">
                    <Button @click="goToPreviousInstance" class="p-2 border-2 border-gray-300 rounded-lg">Previous '{{
                        currentWord }}'</Button>

                    <Button @click="goToNextInstance" class="p-2 border-2 border-gray-300 rounded-lg">Next '{{
                        currentWord }}'</Button>
                </div> -->
    <div class="grid gap-3 items-center my-5 border-2 border-gray-300 rounded-lg p-3 shadow-md">
        <div class="flex gap-5 justify-between">
            <Button class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use Last (All fields)</Button>
            <Button @click="$emit('clearAllFields')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Clear All Fields</Button>
            <Button @click="$emit('applyToAllInstances')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All Instances</Button>
        </div>
        <div class="flex justify-between">
            <label for="definition" class="text-lg font-bold pr-5">Definition</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.definition" placeholder="Definition" aria-label="Definition"
                label="Definition" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
        <div class="flex justify-between">

            <label for="partOfSpeech" class="text-lg font-bold pr-5">Part of Speech</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <Select class="flex-grow" v-model="currentData.partOfSpeech" :options="partsOfSpeech" placeholder="Select a Part of Speech"
                aria-label="Part of Speech" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
     
        <div class="flex justify-between">
            <label for="dictionaryForm" class="text-lg font-bold pr-5">Dictionary Form</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText  class="flex-grow" type="text" v-model="currentData.dictionaryForm" placeholder="Dictionary Form"
                aria-label="Dictionary Form" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
        <div class="flex justify-between">
            <label for="meaning" class="text-lg font-bold pr-5">Meaning</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.meaning" placeholder="Meaning" aria-label="Meaning" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
        <div class="flex justify-between">
            <label for="formHere" class="text-lg font-bold pr-5">Form Here</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.formHere" placeholder="Form Here" aria-label="Form Here" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
        <div class="flex justify-between">
            <label for="notes" class="text-lg font-bold pr-5">Notes</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.notes" placeholder="Notes" aria-label="Notes" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
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
    // currentWordIndex: {
    //     type: Number,
    //     required: true
    // };
    
    generateJSONFile: () => void;
}>();
defineEmits(['useLast', 'clearAllFields', 'applyToAllInstances', 'generateJSONFile','nextWord','prevWord']);
const partsOfSpeech = reactive(['Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Copula', 'Demonstrative', 'Possessive Pronoun', 'Vocative Particle', 'Negative Conjunct Particle']);
const { currentData, generateJSONFile } = toRefs(props);
</script>