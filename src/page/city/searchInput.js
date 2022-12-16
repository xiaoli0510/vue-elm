import {
    ref
} from 'vue';

export function useSearchInput() {
    let inputValue = ref('');

    function handleSearch(inputValue, callback) {
        if (inputValue) {
            callback();
        }
    }

    return {
        inputValue,
        handleSearch
    }

}