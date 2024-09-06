<template>
    <h1 class="my-10 text-3xl font-bold text-center">Word-by-Word Annotation</h1>
       <div class="flex justify-between my-5">
                    <Button @click="$emit('prevWord')" class="p-2 border-2 border-gray-300 rounded-lg">Previous
                        Word</Button>
                   
                    <Button @click="$emit('nextWord')" class="p-2 border-2 border-gray-300 rounded-lg">Next
                        Word</Button>
                </div>
                <!-- <div class="flex justify-between my-5" v-if="numberOfInstances > 1">
                    <Button @click="goToPreviousInstance" class="p-2 border-2 border-gray-300 rounded-lg">Previous '{{
                        currentWord }}'</Button>

                    <Button @click="goToNextInstance" class="p-2 border-2 border-gray-300 rounded-lg">Next '{{
                        currentWord }}'</Button>
                </div> -->
    <div class="grid items-center gap-3 p-3 my-5 border-2 border-gray-300 rounded-lg shadow-md">
        <div class="flex justify-between gap-5">
            <Button class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use Last (All fields)</Button>
            <Button @click="$emit('clearAllFields')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Clear All Fields</Button>
            <Button @click="$emit('applyToAllInstances')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All Instances</Button>
        </div>
        <div class="flex justify-between">
            <label for="definition" class="pr-5 text-lg font-bold">Definition</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.definition" placeholder="Definition" aria-label="Definition"
                label="Definition" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
        <!-- <div class="flex justify-between">

            <label for="partOfSpeech" class="pr-5 text-lg font-bold">Part of Speech</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <Select class="flex-grow" v-model="currentData.partOfSpeech" :options="partsOfSpeech" placeholder="Select a Part of Speech"
                aria-label="Part of Speech" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
      -->
        <div class="flex justify-between">
            <label for="dictionaryForm" class="pr-5 text-lg font-bold">Form Here</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText  class="flex-grow" type="text" v-model="currentData.dictionaryForm" placeholder="Dictionary Form"
                aria-label="Dictionary Form" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
        <!-- <div class="flex justify-between">
            <label for="meaning" class="pr-5 text-lg font-bold">Meaning</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.meaning" placeholder="Meaning" aria-label="Meaning" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div> -->
        <!-- <div class="flex justify-between">
            <label for="formHere" class="pr-5 text-lg font-bold">Form Here</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.formHere" placeholder="Form Here" aria-label="Form Here" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div> -->
        <div class="flex justify-between">
            <label for="notes" class="pr-5 text-lg font-bold">Notes</label>
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Use
                Last</Button>
            <InputText class="flex-grow" type="text" v-model="currentData.notes" placeholder="Notes" aria-label="Notes" />
            <Button @click="$emit('useLast')" class="p-2 border-2 border-gray-300 rounded-lg hover:bg-slate-200">Apply
                to All</Button>
        </div>
    
    </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, } from "vue";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";

const props = defineProps<{
    currentData: {
        word: string;
        definition: string;
        partOfSpeech: string;
        dictionaryForm: string;
        meaning: string;
        formHere: string;
        notes: string;
    };
}>();
defineEmits(['useLast', 'clearAllFields', 'applyToAllInstances', 'prevWord','nextWord']);
const partsOfSpeech = reactive(['Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Copula', 'Demonstrative', 'Possessive Pronoun', 'Vocative Particle', 'Negative Conjunct Particle']);
const { currentData, } = toRefs(props);
</script>