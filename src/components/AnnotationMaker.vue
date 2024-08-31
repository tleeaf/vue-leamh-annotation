<template>
    <div class="h-screen w-screen p-24">
        <h1 class="font-bold text-3xl my-10 text-center">Léamh Annotation Editor</h1>
        <FileUpload v-if="!text" accept=".txt,.docx,.doc" mode="basic" @upload="handleFileUpload" class="p-2">
        </FileUpload>
        <Menubar v-if="text" :model="menuItems" class="p-2"></Menubar>
        <main class="flex gap-10 justify-around">
            <TextDisplay :metadataArr="metadataArr" :mode="mode" :handleSelected="handleSelected"
                :currentWordIndex="currentWordIndex" :currentData="currentData" :chunkLength="chunkLength" />

            <div class="w-1/2 p-5">
                <AnnotationForm v-if="mode == 'word'" @prevWord="previous" @nextWord="next" :currentData="currentData"
                    :generateJSONFile="generateJSONFile" @clearAllFields="clearAllFields"
                    @applyToAllInstances="applyCurrentToAllInstances" @useLast="useLast"></AnnotationForm>

                <ChunkAnnotationForm v-if="mode == 'chunk'" :chunkLength="chunkLength" @prevChunk="prevChunk" @nextChunk="nextChunk" :currentData="currentData"
                    :generateJSONFile="generateJSONFile" @clearAllFields="clearAllFields"></ChunkAnnotationForm>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
import TextDisplay from './TextDisplay.vue'
import { useStorage } from '@vueuse/core';
import { ref, reactive, computed } from 'vue'
import AnnotationForm from './AnnotationForm.vue';
import FileUpload from 'primevue/fileupload';
import ChunkAnnotationForm from './ChunkAnnotationForm.vue';
import Menubar from 'primevue/menubar';

const menuItems = [
    { label: 'File', icon: 'pi pi-fw pi-file', command: () => { } },
    { label: 'Word', icon: 'pi pi-fw pi-pencil', command: () => { mode.value = 'word' } },
    { label: 'Chunk', icon: 'pi pi-fw pi-arrows-h', command: () => { mode.value = 'chunk' } },
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
const currentWordIndex = useStorage('currentWordIndex', ref(0));
const currentWord = computed(() => arr[currentWordIndex.value]);
const instances = computed(() => metadataArr.value.filter(word => word.word == currentWord.value));
const numberOfInstances = computed(() => instances.value.length);
const chunkLength = ref(5);

function goToPreviousInstance() {
    const word = currentWord.value;
    const index = arr.slice(0, currentWordIndex.value).lastIndexOf(word);
    if (index != -1) {
        currentWordIndex.value = index;
    }
}
function goToNextInstance() {
    const word = currentWord.value;
    const index = arr.slice(currentWordIndex.value + 1).indexOf(word);
    if (index != -1) {
        currentWordIndex.value += index + 1;
    }
}
function next() {
    currentWordIndex.value++;
}
function previous() {
    currentWordIndex.value--;
}
function handleSelected(i: number) {
    currentWordIndex.value = i;
}
function handleFileUpload(e) {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target) {
            text.value = e.target.result as string;
        }
    }
    reader.readAsText(file);
}
function applyCurrentToAllInstances(key) {
    if (key) {
        let data = currentData.value;
        instances.value.forEach(instance => {
            instance[key] = data[key];
        });
        return;
    }
    let data = currentData.value;
    instances.value.forEach(instance => {
        instance.definition = data.definition;
        instance.partOfSpeech = data.partOfSpeech;
        instance.dictionaryForm = data.dictionaryForm;
        instance.meaning = data.meaning;
        instance.formHere = data.formHere;
        instance.notes = data.notes;
    });
}

function useLast(key) {
    if (key) {
        let last = metadataArr.value.slice(0, currentWordIndex.value).lastIndexOf(currentWord.value);
        currentData.value[key] = last[key];
        return;
    }
    const index = arr.slice(0, currentWordIndex.value).lastIndexOf(currentWord.value);
    let last = metadataArr.value[index];
    if (index != -1) {
        currentData.value.definition = last.definition;
        currentData.value.partOfSpeech = last.partOfSpeech;
        currentData.value.dictionaryForm = last.dictionaryForm;
        currentData.value.meaning = last.meaning;
        currentData.value.formHere = last.formHere;
        currentData.value.notes = last.notes;
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

function nextChunk() {
    currentWordIndex.value += chunkLength.value;
}

function prevChunk() {
    currentWordIndex.value -= chunkLength.value;
}   

function generateJSONFile() {
    const data = metadataArr.value.map(word => ({
        id: word.word,
        definition: word.definition,
        dictionary: word.dictionaryForm + ' __' + word.partOfSpeech + '__ ' + word.meaning,
        form: word.formHere,
        notes: word.notes
    }));
    console.log(data);
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
    const json = JSON.stringify(Object.values(collatedItems));
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