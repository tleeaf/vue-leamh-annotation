<template>
    <main class="overflow-auto h-screen">
        <DataTable :value="metadataArr" :paginator="true" :rows="20" :rowsPerPageOptions="[5, 10, 20]">
            <Column field="word" header="Word"></Column>
            <Column field="definition" header="Definition"></Column>
            <Column field="partOfSpeech" header="Part of Speech"></Column>
            <Column field="dictionaryForm" header="Dictionary Form"></Column>
            <Column field="meaning" header="Meaning"></Column>
            <Column field="formHere" header="Form Here"></Column>
            <Column field="notes" header="Notes"></Column>
        </DataTable>
    </main>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
const props = defineProps<{
    metadataArr: any;
}>();
</script>

<style scoped></style>