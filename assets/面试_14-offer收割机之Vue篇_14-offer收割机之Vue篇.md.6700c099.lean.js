import{_ as p,c as r,a as s,t as e,b as a,d as n,o}from"./app.279bf150.js";const q=JSON.parse('{"title":"Vue\u9762\u8BD5\u9898\u63A8\u8350\u914D\u5408\u9CA8\u9C7C\u54E5\u6398\u91D1\u6587\u7AE0-\u6700\u5168\u7684Vue\u9762\u8BD5\u9898 \u4E00\u8D77\u770B","description":"","frontmatter":{},"headers":[{"level":2,"title":"Vue\u9762\u8BD5\u9898\u63A8\u8350\u914D\u5408\u9CA8\u9C7C\u54E5\u6398\u91D1\u6587\u7AE0-\u6700\u5168\u7684Vue\u9762\u8BD5\u9898 \u4E00\u8D77\u770B","slug":"vue\u9762\u8BD5\u9898\u63A8\u8350\u914D\u5408\u9CA8\u9C7C\u54E5\u6398\u91D1\u6587\u7AE0-\u6700\u5168\u7684vue\u9762\u8BD5\u9898-\u4E00\u8D77\u770B"},{"level":2,"title":"\u4E00\u3001Vue \u57FA\u7840","slug":"\u4E00\u3001vue-\u57FA\u7840"},{"level":3,"title":"1. Vue\u7684\u57FA\u672C\u539F\u7406","slug":"_1-vue\u7684\u57FA\u672C\u539F\u7406"},{"level":3,"title":"2. \u53CC\u5411\u6570\u636E\u7ED1\u5B9A\u7684\u539F\u7406","slug":"_2-\u53CC\u5411\u6570\u636E\u7ED1\u5B9A\u7684\u539F\u7406"},{"level":3,"title":"3. \u4F7F\u7528 Object.defineProperty() \u6765\u8FDB\u884C\u6570\u636E\u52AB\u6301\u6709\u4EC0\u4E48\u7F3A\u70B9\uFF1F","slug":"_3-\u4F7F\u7528-object-defineproperty-\u6765\u8FDB\u884C\u6570\u636E\u52AB\u6301\u6709\u4EC0\u4E48\u7F3A\u70B9\uFF1F"},{"level":3,"title":"4. MVVM\u3001MVC\u3001MVP\u7684\u533A\u522B","slug":"_4-mvvm\u3001mvc\u3001mvp\u7684\u533A\u522B"},{"level":3,"title":"5. Computed \u548C Watch \u7684\u533A\u522B","slug":"_5-computed-\u548C-watch-\u7684\u533A\u522B"},{"level":3,"title":"6. Computed \u548C Methods \u7684\u533A\u522B","slug":"_6-computed-\u548C-methods-\u7684\u533A\u522B"},{"level":3,"title":"7. slot\u662F\u4EC0\u4E48\uFF1F\u6709\u4EC0\u4E48\u4F5C\u7528\uFF1F\u539F\u7406\u662F\u4EC0\u4E48\uFF1F","slug":"_7-slot\u662F\u4EC0\u4E48\uFF1F\u6709\u4EC0\u4E48\u4F5C\u7528\uFF1F\u539F\u7406\u662F\u4EC0\u4E48\uFF1F"},{"level":3,"title":"8. \u8FC7\u6EE4\u5668\u7684\u4F5C\u7528\uFF0C\u5982\u4F55\u5B9E\u73B0\u4E00\u4E2A\u8FC7\u6EE4\u5668","slug":"_8-\u8FC7\u6EE4\u5668\u7684\u4F5C\u7528\uFF0C\u5982\u4F55\u5B9E\u73B0\u4E00\u4E2A\u8FC7\u6EE4\u5668"},{"level":3,"title":"9. \u5982\u4F55\u4FDD\u5B58\u9875\u9762\u7684\u5F53\u524D\u7684\u72B6\u6001","slug":"_9-\u5982\u4F55\u4FDD\u5B58\u9875\u9762\u7684\u5F53\u524D\u7684\u72B6\u6001"},{"level":3,"title":"10. \u5E38\u89C1\u7684\u4E8B\u4EF6\u4FEE\u9970\u7B26\u53CA\u5176\u4F5C\u7528","slug":"_10-\u5E38\u89C1\u7684\u4E8B\u4EF6\u4FEE\u9970\u7B26\u53CA\u5176\u4F5C\u7528"},{"level":3,"title":"11. v-if\u3001v-show\u3001v-html \u7684\u539F\u7406","slug":"_11-v-if\u3001v-show\u3001v-html-\u7684\u539F\u7406"},{"level":3,"title":"13. v-if\u548Cv-show\u7684\u533A\u522B","slug":"_13-v-if\u548Cv-show\u7684\u533A\u522B"},{"level":3,"title":"14. v-model \u662F\u5982\u4F55\u5B9E\u73B0\u7684\uFF0C\u8BED\u6CD5\u7CD6\u5B9E\u9645\u662F\u4EC0\u4E48\uFF1F","slug":"_14-v-model-\u662F\u5982\u4F55\u5B9E\u73B0\u7684\uFF0C\u8BED\u6CD5\u7CD6\u5B9E\u9645\u662F\u4EC0\u4E48\uFF1F"},{"level":3,"title":"15. v-model \u53EF\u4EE5\u88AB\u7528\u5728\u81EA\u5B9A\u4E49\u7EC4\u4EF6\u4E0A\u5417\uFF1F\u5982\u679C\u53EF\u4EE5\uFF0C\u5982\u4F55\u4F7F\u7528\uFF1F","slug":"_15-v-model-\u53EF\u4EE5\u88AB\u7528\u5728\u81EA\u5B9A\u4E49\u7EC4\u4EF6\u4E0A\u5417\uFF1F\u5982\u679C\u53EF\u4EE5\uFF0C\u5982\u4F55\u4F7F\u7528\uFF1F"},{"level":3,"title":"16. data\u4E3A\u4EC0\u4E48\u662F\u4E00\u4E2A\u51FD\u6570\u800C\u4E0D\u662F\u5BF9\u8C61","slug":"_16-data\u4E3A\u4EC0\u4E48\u662F\u4E00\u4E2A\u51FD\u6570\u800C\u4E0D\u662F\u5BF9\u8C61"},{"level":3,"title":"17. \u5BF9keep-alive\u7684\u7406\u89E3\uFF0C\u5B83\u662F\u5982\u4F55\u5B9E\u73B0\u7684\uFF0C\u5177\u4F53\u7F13\u5B58\u7684\u662F\u4EC0\u4E48\uFF1F","slug":"_17-\u5BF9keep-alive\u7684\u7406\u89E3\uFF0C\u5B83\u662F\u5982\u4F55\u5B9E\u73B0\u7684\uFF0C\u5177\u4F53\u7F13\u5B58\u7684\u662F\u4EC0\u4E48\uFF1F"},{"level":3,"title":"18. $nextTick \u539F\u7406\u53CA\u4F5C\u7528","slug":"_18-nexttick-\u539F\u7406\u53CA\u4F5C\u7528"},{"level":3,"title":"19. Vue \u4E2D\u7ED9 data \u4E2D\u7684\u5BF9\u8C61\u5C5E\u6027\u6DFB\u52A0\u4E00\u4E2A\u65B0\u7684\u5C5E\u6027\u65F6\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F\u5982\u4F55\u89E3\u51B3\uFF1F","slug":"_19-vue-\u4E2D\u7ED9-data-\u4E2D\u7684\u5BF9\u8C61\u5C5E\u6027\u6DFB\u52A0\u4E00\u4E2A\u65B0\u7684\u5C5E\u6027\u65F6\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F\u5982\u4F55\u89E3\u51B3\uFF1F"},{"level":3,"title":"20. Vue\u4E2D\u5C01\u88C5\u7684\u6570\u7EC4\u65B9\u6CD5\u6709\u54EA\u4E9B\uFF0C\u5176\u5982\u4F55\u5B9E\u73B0\u9875\u9762\u66F4\u65B0","slug":"_20-vue\u4E2D\u5C01\u88C5\u7684\u6570\u7EC4\u65B9\u6CD5\u6709\u54EA\u4E9B\uFF0C\u5176\u5982\u4F55\u5B9E\u73B0\u9875\u9762\u66F4\u65B0"},{"level":3,"title":"21. Vue \u5355\u9875\u5E94\u7528\u4E0E\u591A\u9875\u5E94\u7528\u7684\u533A\u522B","slug":"_21-vue-\u5355\u9875\u5E94\u7528\u4E0E\u591A\u9875\u5E94\u7528\u7684\u533A\u522B"},{"level":3,"title":"22. Vue template \u5230 render \u7684\u8FC7\u7A0B","slug":"_22-vue-template-\u5230-render-\u7684\u8FC7\u7A0B"},{"level":3,"title":"23. Vue data \u4E2D\u67D0\u4E00\u4E2A\u5C5E\u6027\u7684\u503C\u53D1\u751F\u6539\u53D8\u540E\uFF0C\u89C6\u56FE\u4F1A\u7ACB\u5373\u540C\u6B65\u6267\u884C\u91CD\u65B0\u6E32\u67D3\u5417\uFF1F","slug":"_23-vue-data-\u4E2D\u67D0\u4E00\u4E2A\u5C5E\u6027\u7684\u503C\u53D1\u751F\u6539\u53D8\u540E\uFF0C\u89C6\u56FE\u4F1A\u7ACB\u5373\u540C\u6B65\u6267\u884C\u91CD\u65B0\u6E32\u67D3\u5417\uFF1F"},{"level":3,"title":"24. \u7B80\u8FF0 mixin\u3001extends \u7684\u8986\u76D6\u903B\u8F91","slug":"_24-\u7B80\u8FF0-mixin\u3001extends-\u7684\u8986\u76D6\u903B\u8F91"},{"level":3,"title":"25. \u63CF\u8FF0\u4E0BVue\u81EA\u5B9A\u4E49\u6307\u4EE4","slug":"_25-\u63CF\u8FF0\u4E0Bvue\u81EA\u5B9A\u4E49\u6307\u4EE4"},{"level":3,"title":"26. \u5B50\u7EC4\u4EF6\u53EF\u4EE5\u76F4\u63A5\u6539\u53D8\u7236\u7EC4\u4EF6\u7684\u6570\u636E\u5417\uFF1F","slug":"_26-\u5B50\u7EC4\u4EF6\u53EF\u4EE5\u76F4\u63A5\u6539\u53D8\u7236\u7EC4\u4EF6\u7684\u6570\u636E\u5417\uFF1F"},{"level":3,"title":"27. Vue\u662F\u5982\u4F55\u6536\u96C6\u4F9D\u8D56\u7684\uFF1F","slug":"_27-vue\u662F\u5982\u4F55\u6536\u96C6\u4F9D\u8D56\u7684\uFF1F"},{"level":3,"title":"28. \u5BF9 React \u548C Vue \u7684\u7406\u89E3\uFF0C\u5B83\u4EEC\u7684\u5F02\u540C","slug":"_28-\u5BF9-react-\u548C-vue-\u7684\u7406\u89E3\uFF0C\u5B83\u4EEC\u7684\u5F02\u540C"},{"level":3,"title":"29. Vue\u7684\u4F18\u70B9","slug":"_29-vue\u7684\u4F18\u70B9"},{"level":3,"title":"30. assets\u548Cstatic\u7684\u533A\u522B","slug":"_30-assets\u548Cstatic\u7684\u533A\u522B"},{"level":3,"title":"31. delete\u548CVue.delete\u5220\u9664\u6570\u7EC4\u7684\u533A\u522B","slug":"_31-delete\u548Cvue-delete\u5220\u9664\u6570\u7EC4\u7684\u533A\u522B"},{"level":3,"title":"32. vue\u5982\u4F55\u76D1\u542C\u5BF9\u8C61\u6216\u8005\u6570\u7EC4\u67D0\u4E2A\u5C5E\u6027\u7684\u53D8\u5316","slug":"_32-vue\u5982\u4F55\u76D1\u542C\u5BF9\u8C61\u6216\u8005\u6570\u7EC4\u67D0\u4E2A\u5C5E\u6027\u7684\u53D8\u5316"},{"level":3,"title":"33. \u4EC0\u4E48\u662F mixin \uFF1F","slug":"_33-\u4EC0\u4E48\u662F-mixin-\uFF1F"},{"level":3,"title":"34. Vue\u6A21\u7248\u7F16\u8BD1\u539F\u7406","slug":"_34-vue\u6A21\u7248\u7F16\u8BD1\u539F\u7406"},{"level":3,"title":"35. \u5BF9SSR\u7684\u7406\u89E3","slug":"_35-\u5BF9ssr\u7684\u7406\u89E3"},{"level":3,"title":"36. Vue\u7684\u6027\u80FD\u4F18\u5316\u6709\u54EA\u4E9B","slug":"_36-vue\u7684\u6027\u80FD\u4F18\u5316\u6709\u54EA\u4E9B"},{"level":3,"title":"37. \u5BF9 SPA \u5355\u9875\u9762\u7684\u7406\u89E3\uFF0C\u5B83\u7684\u4F18\u7F3A\u70B9\u5206\u522B\u662F\u4EC0\u4E48\uFF1F","slug":"_37-\u5BF9-spa-\u5355\u9875\u9762\u7684\u7406\u89E3\uFF0C\u5B83\u7684\u4F18\u7F3A\u70B9\u5206\u522B\u662F\u4EC0\u4E48\uFF1F"},{"level":3,"title":"38. template\u548Cjsx\u7684\u6709\u4EC0\u4E48\u5206\u522B\uFF1F","slug":"_38-template\u548Cjsx\u7684\u6709\u4EC0\u4E48\u5206\u522B\uFF1F"},{"level":3,"title":"39. vue\u521D\u59CB\u5316\u9875\u9762\u95EA\u52A8\u95EE\u9898","slug":"_39-vue\u521D\u59CB\u5316\u9875\u9762\u95EA\u52A8\u95EE\u9898"},{"level":3,"title":"40. extend \u6709\u4EC0\u4E48\u4F5C\u7528","slug":"_40-extend-\u6709\u4EC0\u4E48\u4F5C\u7528"},{"level":3,"title":"41. mixin \u548C mixins \u533A\u522B","slug":"_41-mixin-\u548C-mixins-\u533A\u522B"},{"level":3,"title":"42. MVVM\u7684\u4F18\u7F3A\u70B9?","slug":"_42-mvvm\u7684\u4F18\u7F3A\u70B9"},{"level":3,"title":"43. Vue.use\u7684\u5B9E\u73B0\u539F\u7406","slug":"_43-vue-use\u7684\u5B9E\u73B0\u539F\u7406"},{"level":2,"title":"\u4E8C\u3001\u751F\u547D\u5468\u671F","slug":"\u4E8C\u3001\u751F\u547D\u5468\u671F"},{"level":3,"title":"1. \u8BF4\u4E00\u4E0BVue\u7684\u751F\u547D\u5468\u671F","slug":"_1-\u8BF4\u4E00\u4E0Bvue\u7684\u751F\u547D\u5468\u671F"},{"level":3,"title":"2. Vue \u5B50\u7EC4\u4EF6\u548C\u7236\u7EC4\u4EF6\u6267\u884C\u987A\u5E8F","slug":"_2-vue-\u5B50\u7EC4\u4EF6\u548C\u7236\u7EC4\u4EF6\u6267\u884C\u987A\u5E8F"},{"level":3,"title":"3. created\u548Cmounted\u7684\u533A\u522B","slug":"_3-created\u548Cmounted\u7684\u533A\u522B"},{"level":3,"title":"4. \u4E00\u822C\u5728\u54EA\u4E2A\u751F\u547D\u5468\u671F\u8BF7\u6C42\u5F02\u6B65\u6570\u636E","slug":"_4-\u4E00\u822C\u5728\u54EA\u4E2A\u751F\u547D\u5468\u671F\u8BF7\u6C42\u5F02\u6B65\u6570\u636E"},{"level":3,"title":"5. keep-alive \u4E2D\u7684\u751F\u547D\u5468\u671F\u54EA\u4E9B","slug":"_5-keep-alive-\u4E2D\u7684\u751F\u547D\u5468\u671F\u54EA\u4E9B"},{"level":2,"title":"\u4E09\u3001\u7EC4\u4EF6\u901A\u4FE1","slug":"\u4E09\u3001\u7EC4\u4EF6\u901A\u4FE1"},{"level":3,"title":"\uFF081\uFF09 props  /  $emit","slug":"\uFF081\uFF09-props-emit"},{"level":3,"title":"\uFF082\uFF09eventBus\u4E8B\u4EF6\u603B\u7EBF\uFF08$emit / $on\uFF09","slug":"\uFF082\uFF09eventbus\u4E8B\u4EF6\u603B\u7EBF\uFF08-emit-on\uFF09"},{"level":3,"title":"\uFF083\uFF09\u4F9D\u8D56\u6CE8\u5165\uFF08provide / inject\uFF09","slug":"\uFF083\uFF09\u4F9D\u8D56\u6CE8\u5165\uFF08provide-inject\uFF09"},{"level":3,"title":"\uFF083\uFF09ref / $refs","slug":"\uFF083\uFF09ref-refs"},{"level":3,"title":"\uFF084\uFF09$parent / $children","slug":"\uFF084\uFF09-parent-children"},{"level":3,"title":"\uFF085\uFF09$attrs / $listeners","slug":"\uFF085\uFF09-attrs-listeners"},{"level":3,"title":"\uFF086\uFF09\u603B\u7ED3","slug":"\uFF086\uFF09\u603B\u7ED3"},{"level":2,"title":"\u56DB\u3001\u8DEF\u7531","slug":"\u56DB\u3001\u8DEF\u7531"},{"level":3,"title":"1. Vue-Router \u7684\u61D2\u52A0\u8F7D\u5982\u4F55\u5B9E\u73B0","slug":"_1-vue-router-\u7684\u61D2\u52A0\u8F7D\u5982\u4F55\u5B9E\u73B0"},{"level":3,"title":"2. \u8DEF\u7531\u7684hash\u548Chistory\u6A21\u5F0F\u7684\u533A\u522B","slug":"_2-\u8DEF\u7531\u7684hash\u548Chistory\u6A21\u5F0F\u7684\u533A\u522B"},{"level":3,"title":"3. \u5982\u4F55\u83B7\u53D6\u9875\u9762\u7684hash\u53D8\u5316","slug":"_3-\u5982\u4F55\u83B7\u53D6\u9875\u9762\u7684hash\u53D8\u5316"},{"level":3,"title":"4. $route \u548C$router \u7684\u533A\u522B","slug":"_4-route-\u548C-router-\u7684\u533A\u522B"},{"level":3,"title":"5. \u5982\u4F55\u5B9A\u4E49\u52A8\u6001\u8DEF\u7531\uFF1F\u5982\u4F55\u83B7\u53D6\u4F20\u8FC7\u6765\u7684\u52A8\u6001\u53C2\u6570\uFF1F","slug":"_5-\u5982\u4F55\u5B9A\u4E49\u52A8\u6001\u8DEF\u7531\uFF1F\u5982\u4F55\u83B7\u53D6\u4F20\u8FC7\u6765\u7684\u52A8\u6001\u53C2\u6570\uFF1F"},{"level":3,"title":"6. Vue-router \u8DEF\u7531\u94A9\u5B50\u5728\u751F\u547D\u5468\u671F\u7684\u4F53\u73B0","slug":"_6-vue-router-\u8DEF\u7531\u94A9\u5B50\u5728\u751F\u547D\u5468\u671F\u7684\u4F53\u73B0"},{"level":3,"title":"7. Vue-router\u8DF3\u8F6C\u548Clocation.href\u6709\u4EC0\u4E48\u533A\u522B","slug":"_7-vue-router\u8DF3\u8F6C\u548Clocation-href\u6709\u4EC0\u4E48\u533A\u522B"},{"level":3,"title":"8. params\u548Cquery\u7684\u533A\u522B","slug":"_8-params\u548Cquery\u7684\u533A\u522B"},{"level":3,"title":"9. Vue-router \u5BFC\u822A\u5B88\u536B\u6709\u54EA\u4E9B","slug":"_9-vue-router-\u5BFC\u822A\u5B88\u536B\u6709\u54EA\u4E9B"},{"level":3,"title":"10. \u5BF9\u524D\u7AEF\u8DEF\u7531\u7684\u7406\u89E3","slug":"_10-\u5BF9\u524D\u7AEF\u8DEF\u7531\u7684\u7406\u89E3"},{"level":2,"title":"\u4E94\u3001Vuex","slug":"\u4E94\u3001vuex"},{"level":3,"title":"1. Vuex \u7684\u539F\u7406","slug":"_1-vuex-\u7684\u539F\u7406"},{"level":3,"title":"2. Vuex\u4E2Daction\u548Cmutation\u7684\u533A\u522B","slug":"_2-vuex\u4E2Daction\u548Cmutation\u7684\u533A\u522B"},{"level":3,"title":"3. Vuex \u548C localStorage \u7684\u533A\u522B","slug":"_3-vuex-\u548C-localstorage-\u7684\u533A\u522B"},{"level":3,"title":"4. Redux \u548C Vuex \u6709\u4EC0\u4E48\u533A\u522B\uFF0C\u5B83\u4EEC\u7684\u5171\u540C\u601D\u60F3","slug":"_4-redux-\u548C-vuex-\u6709\u4EC0\u4E48\u533A\u522B\uFF0C\u5B83\u4EEC\u7684\u5171\u540C\u601D\u60F3"},{"level":3,"title":"5. \u4E3A\u4EC0\u4E48\u8981\u7528 Vuex \u6216\u8005 Redux","slug":"_5-\u4E3A\u4EC0\u4E48\u8981\u7528-vuex-\u6216\u8005-redux"},{"level":3,"title":"6. Vuex\u6709\u54EA\u51E0\u79CD\u5C5E\u6027\uFF1F","slug":"_6-vuex\u6709\u54EA\u51E0\u79CD\u5C5E\u6027\uFF1F"},{"level":3,"title":"7. Vuex\u548C\u5355\u7EAF\u7684\u5168\u5C40\u5BF9\u8C61\u6709\u4EC0\u4E48\u533A\u522B\uFF1F","slug":"_7-vuex\u548C\u5355\u7EAF\u7684\u5168\u5C40\u5BF9\u8C61\u6709\u4EC0\u4E48\u533A\u522B\uFF1F"},{"level":3,"title":"8. \u4E3A\u4EC0\u4E48 Vuex \u7684 mutation \u4E2D\u4E0D\u80FD\u505A\u5F02\u6B65\u64CD\u4F5C\uFF1F","slug":"_8-\u4E3A\u4EC0\u4E48-vuex-\u7684-mutation-\u4E2D\u4E0D\u80FD\u505A\u5F02\u6B65\u64CD\u4F5C\uFF1F"},{"level":3,"title":"9. Vuex\u7684\u4E25\u683C\u6A21\u5F0F\u662F\u4EC0\u4E48,\u6709\u4EC0\u4E48\u4F5C\u7528\uFF0C\u5982\u4F55\u5F00\u542F\uFF1F","slug":"_9-vuex\u7684\u4E25\u683C\u6A21\u5F0F\u662F\u4EC0\u4E48-\u6709\u4EC0\u4E48\u4F5C\u7528\uFF0C\u5982\u4F55\u5F00\u542F\uFF1F"},{"level":3,"title":"10. \u5982\u4F55\u5728\u7EC4\u4EF6\u4E2D\u6279\u91CF\u4F7F\u7528Vuex\u7684getter\u5C5E\u6027","slug":"_10-\u5982\u4F55\u5728\u7EC4\u4EF6\u4E2D\u6279\u91CF\u4F7F\u7528vuex\u7684getter\u5C5E\u6027"},{"level":3,"title":"11. \u5982\u4F55\u5728\u7EC4\u4EF6\u4E2D\u91CD\u590D\u4F7F\u7528Vuex\u7684mutation","slug":"_11-\u5982\u4F55\u5728\u7EC4\u4EF6\u4E2D\u91CD\u590D\u4F7F\u7528vuex\u7684mutation"},{"level":2,"title":"\u516D\u3001Vue 3.0","slug":"\u516D\u3001vue-3-0"},{"level":3,"title":"1. Vue3.0\u6709\u4EC0\u4E48\u66F4\u65B0","slug":"_1-vue3-0\u6709\u4EC0\u4E48\u66F4\u65B0"},{"level":3,"title":"2. defineProperty\u548Cproxy\u7684\u533A\u522B","slug":"_2-defineproperty\u548Cproxy\u7684\u533A\u522B"},{"level":3,"title":"3. Vue3.0 \u4E3A\u4EC0\u4E48\u8981\u7528 proxy\uFF1F","slug":"_3-vue3-0-\u4E3A\u4EC0\u4E48\u8981\u7528-proxy\uFF1F"},{"level":3,"title":"4.  Vue 3.0 \u4E2D\u7684 Vue Composition API\uFF1F","slug":"_4-vue-3-0-\u4E2D\u7684-vue-composition-api\uFF1F"},{"level":3,"title":"5. Composition API\u4E0EReact Hook\u5F88\u50CF\uFF0C\u533A\u522B\u662F\u4EC0\u4E48","slug":"_5-composition-api\u4E0Ereact-hook\u5F88\u50CF\uFF0C\u533A\u522B\u662F\u4EC0\u4E48"},{"level":2,"title":"\u4E03\u3001\u865A\u62DFDOM","slug":"\u4E03\u3001\u865A\u62DFdom"},{"level":3,"title":"1. \u5BF9\u865A\u62DFDOM\u7684\u7406\u89E3\uFF1F","slug":"_1-\u5BF9\u865A\u62DFdom\u7684\u7406\u89E3\uFF1F"},{"level":3,"title":"2. \u865A\u62DFDOM\u7684\u89E3\u6790\u8FC7\u7A0B","slug":"_2-\u865A\u62DFdom\u7684\u89E3\u6790\u8FC7\u7A0B"},{"level":3,"title":"3. \u4E3A\u4EC0\u4E48\u8981\u7528\u865A\u62DFDOM","slug":"_3-\u4E3A\u4EC0\u4E48\u8981\u7528\u865A\u62DFdom"},{"level":3,"title":"4. \u865A\u62DFDOM\u771F\u7684\u6BD4\u771F\u5B9EDOM\u6027\u80FD\u597D\u5417","slug":"_4-\u865A\u62DFdom\u771F\u7684\u6BD4\u771F\u5B9Edom\u6027\u80FD\u597D\u5417"},{"level":3,"title":"5. DIFF\u7B97\u6CD5\u7684\u539F\u7406","slug":"_5-diff\u7B97\u6CD5\u7684\u539F\u7406"},{"level":3,"title":"6. Vue\u4E2Dkey\u7684\u4F5C\u7528","slug":"_6-vue\u4E2Dkey\u7684\u4F5C\u7528"},{"level":3,"title":"7. \u4E3A\u4EC0\u4E48\u4E0D\u5EFA\u8BAE\u7528index\u4F5C\u4E3Akey?","slug":"_7-\u4E3A\u4EC0\u4E48\u4E0D\u5EFA\u8BAE\u7528index\u4F5C\u4E3Akey"}],"relativePath":"\u9762\u8BD5/14-offer\u6536\u5272\u673A\u4E4BVue\u7BC7/14-offer\u6536\u5272\u673A\u4E4BVue\u7BC7.md","lastUpdated":1659795884000}'),c={name:"\u9762\u8BD5/14-offer\u6536\u5272\u673A\u4E4BVue\u7BC7/14-offer\u6536\u5272\u673A\u4E4BVue\u7BC7.md"},t=a("",50),i=n("\u8FC7\u6EE4\u5668\u662F\u4E00\u4E2A\u51FD\u6570\uFF0C\u5B83\u4F1A\u628A\u8868\u8FBE\u5F0F\u4E2D\u7684\u503C\u59CB\u7EC8\u5F53\u4F5C\u51FD\u6570\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570\u3002\u8FC7\u6EE4\u5668\u7528\u5728"),u=s("strong",null,"\u63D2\u503C\u8868\u8FBE\u5F0F",-1),b=n(),d=n(" \u548C "),m=s("code",null,"**v-bind**",-1),y=n(),h=s("strong",null,"\u8868\u8FBE\u5F0F",-1),g=n(" \u4E2D\uFF0C\u7136\u540E\u653E\u5728\u64CD\u4F5C\u7B26\u201C "),v=s("code",null,"**|**",-1),f=n(" \u201D\u540E\u9762\u8FDB\u884C\u6307\u793A\u3002"),x=a("",275),A=a("",371);function _(l,V,B,E,M,C){return o(),r("div",null,[t,s("p",null,[i,u,b,s("code",null,"**"+e()+"**",1),d,m,y,h,g,v,f]),x,s("p",null,"\u4F7F\u7528vue\u5F00\u53D1\u65F6\uFF0C\u5728vue\u521D\u59CB\u5316\u4E4B\u524D\uFF0C\u7531\u4E8Ediv\u662F\u4E0D\u5F52vue\u7BA1\u7684\uFF0C\u6240\u4EE5\u6211\u4EEC\u5199\u7684\u4EE3\u7801\u5728\u8FD8\u6CA1\u6709\u89E3\u6790\u7684\u60C5\u51B5\u4E0B\u4F1A\u5BB9\u6613\u51FA\u73B0\u82B1\u5C4F\u73B0\u8C61\uFF0C\u770B\u5230\u7C7B\u4F3C\u4E8E"+e(l.message)+"\u7684\u5B57\u6837\uFF0C\u867D\u7136\u4E00\u822C\u60C5\u51B5\u4E0B\u8FD9\u4E2A\u65F6\u95F4\u5F88\u77ED\u6682\uFF0C\u4F46\u662F\u8FD8\u662F\u6709\u5FC5\u8981\u8BA9\u89E3\u51B3\u8FD9\u4E2A\u95EE\u9898\u7684\u3002",1),A])}var k=p(c,[["render",_]]);export{q as __pageData,k as default};
