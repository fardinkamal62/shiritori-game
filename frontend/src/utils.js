import axios from "axios";

export async function validWord(word) {
    try {
        const request = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        return true;
    } catch (e) {
        return false;
    }
}
