<template>
    <div class="w-screen px-24 max-h-1/2">
        <h1 class="my-10 text-3xl font-bold text-center">Léamh Annotation Editor</h1>
        <div v-if="!text" class="h-screen text-center">
            <div class="flex flex-col gap-5 mx-auto my-10 text-xl w-96">
                <h2 class="text-2xl font-bold">Introduction</h2>
                <p>Léamh Annotation Editor is a tool for preparing and editing annotations for <a
                        href="https://leamh.org" class="font-bold text-blue-500 blue-500">leamh.org</a></p>
                <h2 class="text-2xl font-bold">How to use this tool:</h2>
                <p>1. Upload a text file (.txt, .docx, .doc). Indicate whether this is original plain text or an
                    existing leamh annotation file.</p>
                <p>2. Select the mode you want to use (Word, Chunk, or Review)</p>
                <p>3. Start annotating!</p>
            </div>
            <FileUpload accept=".txt,.docx,.doc,.rtf" mode="basic" class="p-2" :customUpload="true"
                @select="handleFileUpload">
            </FileUpload>
            <!-- <Button @click="console.log(text)" icon="pi pi-upload" label="Upload"></Button> -->
        </div>
        <div v-else>
            <Menubar v-if="text" :model="menuItems" class="p-2"></Menubar>
            <main class="flex justify-around gap-10">
                <TextDisplay :words="arr" :debug="debug" :metadataArr="metadataArr" :mode="mode"
                    :handleSelected="handleSelected" :currentWordIndex="currentWordIndex" :currentData="currentData"
                    :chunkLength="chunkLength" :chunks="chunks"> </TextDisplay>

                <div class="w-1/2 p-5">
                    <AnnotationForm v-if="mode == 'word'" @prev-word="previous" @next-word="next"
                        :currentData="currentData" @clear-all-fields="clearAllFields"
                        @apply-to-all-instances="applyCurrentToAllInstances" @use-last="useLast"></AnnotationForm>

                    <ChunkAnnotationForm v-if="mode == 'chunk'" @prev-chunk="toPrevChunk" @next-chunk="toNextChunk"
                        :currentChunkData="currentChunkData" @decrease-chunk-length="candidateChunkLength--"
                        @increase-chunk-length="candidateChunkLength++" @save-chunk="saveChunk" :chunks="chunks"
                        :chunksDefined="chunksDefined"></ChunkAnnotationForm>

                    <Review v-if="mode == 'review'" :metadataArr="metadataArr"></Review>
                </div>

            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextDisplay from './TextDisplay.vue'
import Review from './Review.vue'
import { useStorage } from '@vueuse/core';
import { ref, reactive, computed } from 'vue'
import AnnotationForm from './AnnotationForm.vue';
import FileUpload from 'primevue/fileupload';
import ChunkAnnotationForm from './ChunkAnnotationForm.vue';
import Menubar from 'primevue/menubar';
import type { Chunk, Metadata } from '../types/Types';
import * as mammoth from 'mammoth';

const menuItems = [
    {
        label: 'File', icon: 'pi pi-fw pi-file', items: [
            { label: 'Upload Annotation File', icon: 'pi pi-fw pi-upload', command: () => { selectAnnotationFile() } },
        ]
    },
    { label: 'Review', icon: 'pi pi-w pi-eye', command: () => { mode.value = 'review' } },
    { label: 'Word', icon: 'pi pi-fw pi-pencil', command: () => { mode.value = 'word' } },
    { label: 'Chunk', icon: 'pi pi-fw pi-arrows-h', command: () => { mode.value = 'chunk' } },
    { label: 'Export', icon: 'pi pi-fw pi-download', command: () => { generateJSONFile() } },
];
const mode = useStorage('mode', ref('word'));

const text = ref('')
const arr = computed<string[]>(() => text.value.split(/[ \n]+/).filter((word: string) => word.length > 0).map(w => w === '7' ? '⁊' : w));
const numWords = computed(() => arr.value.length);
// .map(word => word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')); 

let metadataArr = reactive([] as Metadata[]);

// const currentWordIndex = useStorage('currentWordIndex', ref(0));
const currentWordIndex = ref(0);
const currentWord = computed(() => text.value.split(/[ \n]+/).filter((word: string) => word.length > 0)[currentWordIndex.value]);
const instances = computed(() => metadataArr.filter(word => word.word == currentWord.value));
const currentData = computed(() => metadataArr[currentWordIndex.value]);
const numberOfInstances = computed(() => instances.value.length);
const candidateChunkLength = ref(5);
const debug = useStorage('debug', ref(true));
const chunkLength = computed(() => {
    if (mode.value == 'chunk' && chunksDefined.value) {
        return currentChunkData.value?.length;
    }
    else {
        return candidateChunkLength.value;
    }
});
const chunks = useStorage('chunks', ref([] as Chunk[]));
const currentChunkData = computed(() => {
    return chunks.value.find(c => c.startIndex == currentWordIndex.value) as Chunk;
});
const chunkStarts = computed(() => chunks.value.map(chunk => chunk.startIndex));
const chunksDefined = computed(() => chunks.value.reduce((acc, chunk) => acc + chunk.length, 0) >= numWords.value);
const nextChunk = computed(() => chunks.value.find(c => c.startIndex == currentWordIndex.value + (chunkLength.value ?? 0)));

function reverseCollation(data) {
    return data.reduce((acc, item) => {
        // Use item.id as the key in the resulting object
        acc[item.id] = item;
        return acc;
    }, {});
}

function sortMetadata() {
    //sort metadataArr based on order in arr
    for (let i = 0; i < arr.value.length; i++) {
        const word = arr.value[i];
        const index = metadataArr.findIndex((item, ind) => item.word === word && ind > i);
        if (index !== -1 && index !== i) {
            const temp = metadataArr[i];
            metadataArr[i] = metadataArr[index];
            metadataArr[index] = temp;
        }
    }
}

function selectAnnotationFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt'; // Changed to .json to match the data format
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const data = JSON.parse(text);
            const mArr: any[] = [];
            console.log(data)
            data.forEach((item: any) => {
                if (!item.notes) return
                // For each word and its metadata, distribute over all instances
                const notes = item.notes;
                // Assuming occurrences array holds the number of word instances
                for (let i = 0; i < notes.length; i++) {
                    const instanceMetadata = {
                        word: item.id,
                        notes: Array.isArray(item.notes) ? item.notes[i] : item.notes,
                        dictionaryForm: item.dictionary,
                        form: Array.isArray(item.form) ? item.form[i] : item.form,
                    };
                    mArr.push(instanceMetadata);
                }
            });

            metadataArr = mArr;
            sortMetadata();
        };
    };
    input.click();
}

function handleFileUpload(e: any) {
    const file = e.files[0];
    const extension = file.name.split('.').pop();
    if (extension == 'docx') {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                mammoth.extractRawText({ arrayBuffer: e.target.result as ArrayBuffer })
                    .then((result) => {
                        text.value = result.value;
                        metadataArr = arr.value.map(word => ({ word, definition: '', partOfSpeech: 'Noun', dictionaryForm: '', meaning: '', formHere: '', notes: '' }));
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
        reader.readAsArrayBuffer(file);
    }
    else if (extension == 'txt') {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                text.value = e.target.result as string;
                metadataArr = arr.value.map(word => ({ word, definition: '', partOfSpeech: 'Noun', dictionaryForm: '', meaning: '', formHere: '', notes: '' }));
            }
        }
        reader.readAsText(file);
    }
    else if (extension == 'doc') {
        alert('Please convert the file to .docx format before uploading.');
    }
    else {
        alert('Unsupported file format. Please upload a .txt or .docx file.');
    }
}
function useLast(key?: keyof Metadata) {
    const index = metadataArr
        .slice(0, currentWordIndex.value)
        .reverse()
        .findIndex((obj) => obj.word === currentWord.value);

    if (index === -1) return;

    const last = metadataArr[metadataArr.length - 1 - index];

    if (key) {
        currentData.value[key] = last[key];
    } else {
        let currentWord = metadataArr[currentWordIndex.value];
        currentWord = { ...currentData.value, ...last };
    }
}
function clearAllFields() {
    currentData.value.definition = '';
    currentData.value.partOfSpeech = 'Noun';
    currentData.value.dictionaryForm = '';
    currentData.value.meaning = '';
    currentData.value.formHere = '';
    currentData.value.notes = '';
}

function next() {
    currentWordIndex.value++;
}
function previous() {
    currentWordIndex.value--;
}
function applyCurrentToAllInstances() {
    if (!currentData.value.dictionaryForm && !currentData.value.meaning && !currentData.value.formHere && !currentData.value.notes) {
        alert('No data to apply, please fill out the fields first.');
        return;
    }
    if (!currentData.value.dictionaryForm || !currentData.value.meaning || !currentData.value.formHere || !currentData.value.notes) {
        alert('Please fill out all fields before applying to all instances.');
        return;
    }
    const confirm = window.confirm('Are you sure you want to apply this data to all instances of this word? This will overwrite any existing data.');
    if (!confirm) return;
    instances.value.forEach(instance => {
        instance.definition = currentData.value.definition;
        instance.dictionaryForm = currentData.value.dictionaryForm;
        instance.meaning = currentData.value.meaning;
        instance.formHere = currentData.value.formHere;
        instance.notes = currentData.value.notes;
    });
}

function handleSelected(i: number) {
    currentWordIndex.value = i;
}

function toNextChunk() {
    if (!chunksDefined.value) {
        return;
    }
    else {
        currentWordIndex.value = (nextChunk ?? { value: { startIndex: currentWordIndex.value } }).value?.startIndex ?? currentWordIndex.value;
    }
}
function toPrevChunk() {
    if (!chunksDefined.value) {
        return;
    }
    else {
        const prevChunk = chunks.value.find(c => c.startIndex + c.length == currentWordIndex.value);
        currentWordIndex.value = prevChunk ? prevChunk.startIndex : currentWordIndex.value - (currentChunkData.value?.length ?? 0);
    }
}
function saveChunk() {
    const chunk = {
        startIndex: currentWordIndex.value,
        length: arr.value.length + candidateChunkLength.value > numWords.value ? numWords.value - currentWordIndex.value : candidateChunkLength.value,
        text: arr.value.slice(currentWordIndex.value, currentWordIndex.value + candidateChunkLength.value).join(' '),
        translation: '',
        notes: ''
    };
    chunks.value.push(chunk);
    currentWordIndex.value += candidateChunkLength.value;
    if (currentWordIndex.value >= numWords.value) {
        alert('Reached end of text.');
        currentWordIndex.value = 0;
        return;
    }
}

function generateJSONFile() {
    const data = metadataArr.map((word: Metadata) => ({
        id: word.word,
        definition: word.definition,
        dictionary: word.dictionaryForm + ' __' + word.partOfSpeech + '__ ' + word.meaning,
        form: word.formHere,
        notes: word.notes
    }));
    // console.log(data);
    const collatedItems = data.reduce((acc: { [key: string]: any }, item: any) => {
        // If the id doesn't exist in the accumulator, create an entry
        if (!acc[item.id]) {
            acc[item.id] = { id: item.id };
            // Initialize arrays for each property except 'id'
            for (let key in item) {
                if (key !== 'id') {
                    acc[item.id][key] = [];
                }
            }
        }

        // Push each value into the corresponding array
        for (let key in item) {
            if (key !== 'id') {
                acc[item.id][key as keyof typeof item].push(item as any);
            }
        }

        return acc;
    }, {});
    // console.log(Object.values(collatedItems));
    const result = Object.values(collatedItems).concat(chunks.value.map(c => ({ id: c.text, translation: c.translation, notes: c.notes })));
    console.log(result);
    const json = JSON.stringify(result);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.json.txt';
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<style scoped></style>