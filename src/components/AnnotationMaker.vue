<template>
    <div class="w-screen px-24 max-h-1/2">
        <h1 class="my-10 text-3xl font-bold text-center">Léamh Annotation Editor</h1>
        <FileUpload v-if="!text" accept=".txt,.docx,.doc" mode="basic" @upload="handleFileUpload" class="p-2">
        </FileUpload>
        <Menubar v-if="text" :model="menuItems" class="p-2"></Menubar>
        <main class="flex justify-around gap-10">
            <TextDisplay :debug="debug" :metadataArr="metadataArr" :mode="mode" :handleSelected="handleSelected"
                :currentWordIndex="currentWordIndex" :currentData="currentData" :chunkLength="chunkLength" :chunks="chunks" />  

            <div class="w-1/2 p-5">
                <AnnotationForm v-if="mode == 'word'" @prev-word="previous" @next-word="next" :currentData="currentData"
                    @clearAllFields="clearAllFields" @apply-to-all-instances="applyCurrentToAllInstances"
                    @use-last="useLast"></AnnotationForm>

                <ChunkAnnotationForm v-if="mode == 'chunk'" :chunkLength="chunkLength" @prev-chunk="toPrevChunk"
                    @next-chunk="toNextChunk" :currentChunkData="currentChunkData" @decrease-chunk-length="candidateChunkLength--"
                    @increase-chunk-length="candidateChunkLength++" @save-chunk="saveChunk" :chunks="chunks" :chunksDefined="chunksDefined"></ChunkAnnotationForm>

                <Review v-if="mode == 'review'" :metadataArr="metadataArr"></Review>
            </div>

        </main>
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

interface Chunk {
    startIndex: number;
    length: number;
    text: string;
    translation: string;
    notes: string;
}

interface Metadata {
    word: string;
    id: string;
    definition: string;
    partOfSpeech: string;
    dictionaryForm: string;
    meaning: string;
    formHere: string;
    notes: string;
}

const menuItems = [
    { label: 'File', icon: 'pi pi-fw pi-file', command: () => { } },
    { label: 'Review', icon: 'pi pi-w pi-eye', command: () => { mode.value = 'review' } },
    { label: 'Word', icon: 'pi pi-fw pi-pencil', command: () => { mode.value = 'word' } },
    { label: 'Chunk', icon: 'pi pi-fw pi-arrows-h', command: () => { mode.value = 'chunk' } },
    { label: 'Export', icon: 'pi pi-fw pi-download', command: () => { generateJSONFile() } },
];
const mode = useStorage('mode', ref('word'));

const text = ref('Is ann sin do thrialladar tar a n-ais, 7 ní haithristear a n-eachtra nó a n-imtheachta go rángadar mar a raibh fiana Éireann, 7 an uair do-chonncadar Bodach an Chóta Lachtna ar an inneall 7 ar an ordughadh-sin a raibh sé, ní raibh duine aca nach raibh iongnadh aige a shamhail do dhuine d’fhaicsin, óir ní fhacadar a shamhail a-riamh roimhe, 7 budh lúthgháireach lánmheanmnach leó Fionn do theacht tar ais. Is ann sin do tháinig Caol an Iarainn do láthair Fhinn, 7 d’fhiafraigh dhe an dtug leis an fear do rithfeadh ris féin. D’innis Fionn dho go dtug, 7 go raibh sé ar an láthair-sin aige, 7 do thaisbéin sé an Bodach do Chaol an Iarainn 7 iar bhfaicsin Bodaigh an Chóta Lachtna don ghaisgeadhach dob iongnadh adhbhal 7 budh machtna meanman leis a shamhail d’fhaicsin, 7 a-dubhairt nach rachadh féin do chommóradh gaisgidh nó reatha lena shamhail do bhodach smearaighthe ghránna choidhche. Arna chlos sin don bhodach do-rinne glafar garbhgháire 7 a-dubhairt re Caol an Iarainn: ‘A-tá tú meallta dom thaoibh-se a ghaisgidhigh,’ ar sé, ‘óir ní mé an duine shaoileas tú do bheith agad, 7 do-ghéabha tú cruthadh fírinneach mo ghlóir-se sul dtí tráthnóna ᾽márach, 7 tabhair sgéala damhsa céard é fad na sgríbe is mian leat do chur romhad dochum reatha, 7 mur siubhla mise an tslighe-sin leatsa is cosmhail gur leat breith do ghill; mar an gcéadna, má tá go mbeidh geall reatha agamsa uaitse, is deimhin gurab ortsa caill do ghill.’ ‘Táim sásda go leór,’ ar Caol an Iarainn, ‘ara labhrann tú, acht ní háil liom níos lugha ná trí fichid míle do bhealach a bheith do sgríb reatha againn.’ ‘Is maith mar a-tá,’ ar Bodach an Chóta Lachtna, ‘trí fichid míle go cinnte ó Shliabh Luachra na Mumhan go Binn Éadair, 7 mur bhfaice tusa go rithfe mise an tslighe-sin leatsa, 7 tuilleadh más í do thoil é, is leatsa breith do ghill gan imreas.');
const numWords = computed(() => text.value.split(' ').length);
const arr = text.value.split(' ').map(word => word == '7' ? '⁊' : word)
// .map(word => word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')); 

const metadataArr = useStorage('metadataArr', reactive(new Array(numWords.value).fill(0).map((_, i) => ({
    word: arr[i],
    id: arr[i],
    definition: '',
    partOfSpeech: 'Noun',
    dictionaryForm: '',
    meaning: '',
    formHere: '',
    notes: ''
}))));

const currentData = computed(() => metadataArr.value[currentWordIndex.value]);
// const currentWordIndex = useStorage('currentWordIndex', ref(0));
const currentWordIndex = ref(0);    
const currentWord = computed(() => arr[currentWordIndex.value]);
const instances = computed(() => metadataArr.value.filter(word => word.word == currentWord.value));
const numberOfInstances = computed(() => instances.value.length);
const candidateChunkLength = ref(5);
const debug = useStorage('debug', ref(true));
const chunkLength = computed(() =>{
    if(chunksDefined.value){
        return currentChunkData.value.length;
    }
    else{
        return candidateChunkLength.value;
    }
});
const chunks = useStorage('chunks', ref([] as Chunk[]));
const currentChunkData: Ref<Chunk> = computed(() => {
   return chunks.value.find(c => c.startIndex == currentWordIndex.value); 
});
const chunkStarts = computed(() => chunks.value.map(chunk => chunk.startIndex));
const chunksDefined = computed(() => chunks.value.reduce((acc, chunk) => acc + chunk.length, 0) >= numWords.value);
const nextChunk = computed(() => chunks.value.find(c => c.startIndex == currentWordIndex.value + chunkLength.value));

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
    if(!chunksDefined.value){
        return;
    }
    else{
        currentWordIndex.value = nextChunk ? nextChunk.value.startIndex : currentWordIndex.value + currentChunkData.value.length;
    }
}
function toPrevChunk() {
    if(!chunksDefined.value){
        return;
    }
    else{
        const prevChunk = chunks.value.find(c => c.startIndex + c.length == currentWordIndex.value);
        currentWordIndex.value = prevChunk ? prevChunk.startIndex : currentWordIndex.value - currentChunkData.value.length;
    }
}
function saveChunk() {
    const chunk = {
        startIndex: currentWordIndex.value,
        length: arr.values.length + candidateChunkLength.value > numWords.value ? numWords.value - currentWordIndex.value : candidateChunkLength.value,
        text: arr.slice(currentWordIndex.value, currentWordIndex.value + candidateChunkLength.value).join(' '),
        translation: '',
        notes: '' 
    };
    chunks.value.push(chunk);
    currentWordIndex.value += chunkLength.value;
    if(currentWordIndex.value >= numWords.value){
        alert('Reached end of text.');
        currentWordIndex.value = 0;
        return;
    }
}

function generateJSONFile() {
    const data = metadataArr.value.map(word => ({
        id: word.word,
        definition: word.definition,
        dictionary: word.dictionaryForm + ' __' + word.partOfSpeech + '__ ' + word.meaning,
        form: word.formHere,
        notes: word.notes
    }));
    // console.log(data);
    const collatedItems = data.reduce((acc: { [key: string]: any }, item) => {
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
                acc[item.id][key as keyof typeof item].push(item[key]);
            }
        }

        return acc;
    }, {});
    // console.log(Object.values(collatedItems));
    const result = Object.values(collatedItems).concat(chunks.value.map(c => ({id:c.text, translation: c.translation, notes: c.notes})));
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