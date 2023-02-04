import { computed } from 'vue'
import { mapState, useStore } from 'vuex';
export default function useState(arr) {
    const store = useStore()
    const storeStateFns = mapState(arr)
    const storeState = {}
    Object.keys(storeStateFns).forEach(key => {
        const fn = storeStateFns[key].bind("$store", store)
        console.log(fn)
        //执行fn 实质上仍然 执行$store 但无法获取 只能useStore获取-》每个函数绑定this

        storeState[key] = computed(fn)
    })
    return storeState
};