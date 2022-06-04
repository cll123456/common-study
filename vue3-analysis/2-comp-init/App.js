import { h, ref } from "./min-vue-code.esm.js";

export default {
  name: 'App',
  setup() {
    const count = ref(0);

    return {
      count
    };
  },
  render() {
    return h('div', { pId: '"helloWorld"' }, [
      h('p', {}, 'hello world'),
      h('p', {}, `count的值是： ${this.count}`),
    ])
  }
}
