interface Chunk {
    startIndex: number;
    length: number;
    text: string;
    translation: string;
    notes: string;
}

interface Metadata {
    word: string;
    definition: string;
    partOfSpeech: string;
    dictionaryForm: string;
    meaning: string;
    formHere: string;
    notes: string;
}

export type { Chunk, Metadata };