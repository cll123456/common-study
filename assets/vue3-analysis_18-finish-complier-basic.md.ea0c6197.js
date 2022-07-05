import{_ as s,c as n,o as a,b as p}from"./app.b67c8124.js";const d=JSON.parse('{"title":"\u5F15\u8A00","description":"","frontmatter":{"theme":"qklhk-chocolate"},"headers":[{"level":2,"title":"\u6D41\u7A0B","slug":"\u6D41\u7A0B"},{"level":2,"title":"\u6D4B\u8BD5\u7528\u4F8B","slug":"\u6D4B\u8BD5\u7528\u4F8B"},{"level":2,"title":"\u5206\u6790","slug":"\u5206\u6790"},{"level":3,"title":"updateComponent","slug":"updatecomponent"},{"level":3,"title":"updatePreRender","slug":"updateprerender"},{"level":3,"title":"\u8C03\u7528render","slug":"\u8C03\u7528render"},{"level":2,"title":"\u7F16\u7801","slug":"\u7F16\u7801"}],"relativePath":"vue3-analysis/16-finish-comp-update.md"}'),l={name:"vue3-analysis/16-finish-comp-update.md"},o=p(`<h1 id="\u5F15\u8A00" tabindex="-1">\u5F15\u8A00 <a class="header-anchor" href="#\u5F15\u8A00" aria-hidden="true">#</a></h1><p>&lt;&lt;\u5F80\u671F\u56DE\u987E&gt;&gt;</p><ol><li><a href="https://juejin.cn/post/7111682377507667999" title="https://juejin.cn/post/7111682377507667999" target="_blank" rel="noopener noreferrer">vue3\u6E90\u7801\u5206\u6790\u2014\u2014\u5B9E\u73B0\u7EC4\u4EF6\u901A\u4FE1provide,inject</a></li><li><a href="https://juejin.cn/post/7112349410528329758" title="https://juejin.cn/post/7112349410528329758" target="_blank" rel="noopener noreferrer">vue3\u6E90\u7801\u5206\u6790\u2014\u2014\u5B9E\u73B0createRenderer\uFF0C\u589E\u52A0runtime-test</a></li><li><a href="https://juejin.cn/post/7114203851770560525" title="https://juejin.cn/post/7114203851770560525" target="_blank" rel="noopener noreferrer">vue3\u6E90\u7801\u5206\u6790\u2014\u2014\u5B9E\u73B0element\u5C5E\u6027\u66F4\u65B0\uFF0Cchild\u66F4\u65B0</a></li><li><a href="https://juejin.cn/post/7114966648309678110" target="_blank" rel="noopener noreferrer">vue3\u6E90\u7801\u5206\u6790\u2014\u2014\u624B\u5199diff\u7B97\u6CD5</a></li></ol><p>\u524D\u9762\u7684\u4E24\u671F\u4E3B\u8981\u662F\u5B9E\u73B0<code>element\u7684\u66F4\u65B0</code>,<code>vue</code>\u7684\u66F4\u65B0\u9664\u4E86<code>element</code>\u7684\u66F4\u65B0\u5916,\u8FD8\u6709<code>component</code>\u7684\u66F4\u65B0\u54E6,\u672C\u671F\u5C31\u5E26\u5927\u5BB6\u4E00\u8D77\u6765\u770B\u770B,\u672C\u671F\u6240\u6709\u7684<a href="https://github.com/cll123456/common-study/tree/master/vue3-analysis/16-finish-comp-update" target="_blank" rel="noopener noreferrer">\u6E90\u7801\u8BF7\u67E5\u770B</a></p><h1 id="\u6B63\u6587" tabindex="-1">\u6B63\u6587 <a class="header-anchor" href="#\u6B63\u6587" aria-hidden="true">#</a></h1><p>vue3\u5728\u66F4\u65B0element\u7684\u65F6\u5019,\u9664\u4E86\u9700\u8981<strong>\u5206\u60C5\u51B5\u8BA8\u8BBA\u66F4\u65B0children\u5916,\u8FD8\u9700\u8981\u6765\u770Bvue3\u7684\u5C5E\u6027</strong>\u6709\u6CA1\u6709\u53D8\u5316;\u90A3\u4E48\u540C\u6837\u7684\u9053\u7406,\u5BF9\u4E8E<strong>\u7EC4\u4EF6\u7684\u66F4\u65B0,\u4E5F\u662F\u9700\u8981\u6765\u66F4\u65B0\u5C5E\u6027,\u63D2\u69FD</strong>\u7B49</p><h2 id="\u6D41\u7A0B" tabindex="-1">\u6D41\u7A0B <a class="header-anchor" href="#\u6D41\u7A0B" aria-hidden="true">#</a></h2><p><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea4d6010dd2d4846b8e6f71deae72b08~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"></p><blockquote><p>\u770B\u5230\u8FD9\u4E2A\u6D41\u7A0B,\u662F\u4E0D\u662F\u611F\u89C9\u6BD4<strong>element\u7684\u66F4\u65B0</strong>\u7B80\u5355\u8BB8\u591A(\u2741\xB4\u25E1\`\u2741)</p></blockquote><h2 id="\u6D4B\u8BD5\u7528\u4F8B" tabindex="-1">\u6D4B\u8BD5\u7528\u4F8B <a class="header-anchor" href="#\u6D4B\u8BD5\u7528\u4F8B" aria-hidden="true">#</a></h2><p>\u6839\u636E\u4E0A\u9762\u7684\u6D41\u7A0B\u56FE,\u53EF\u4EE5\u5199\u51FA\u8FD9\u6837\u7684\u6D4B\u8BD5\u7528\u4F8B</p><div class="language-ts line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#393A34;"> </span><span style="color:#6C7834;">test</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;test comp update by Child&#39;</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">()</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">let</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">click</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">Child</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#B58451;">name</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#B56959;">&#39;Child&#39;</span><span style="color:#8E8F8B;">,</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#6C7834;">setup</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">props</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">emit</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">})</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#6C7834;">click</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">()</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">          </span><span style="color:#6C7834;">emit</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;click&#39;</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#1C6B48;">return</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">          </span><span style="color:#8C862B;">click</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8E8F8B;">},</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#6C7834;">render</span><span style="color:#8E8F8B;">()</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#1C6B48;">return</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">h</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;div&#39;</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{},</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">this</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">$props</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">a</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">app</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">createApp</span><span style="color:#8E8F8B;">({</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#B58451;">name</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#B56959;">&#39;App&#39;</span><span style="color:#8E8F8B;">,</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#6C7834;">setup</span><span style="color:#8E8F8B;">()</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">a</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">ref</span><span style="color:#8E8F8B;">(</span><span style="color:#296AA3;">1</span><span style="color:#8E8F8B;">);</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">changeA</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">()</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">          </span><span style="color:#8C862B;">a</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">value</span><span style="color:#AB5959;">++</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#1C6B48;">return</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">          </span><span style="color:#8C862B;">a</span><span style="color:#8E8F8B;">,</span></span>
<span class="line"><span style="color:#393A34;">          </span><span style="color:#8C862B;">changeA</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8E8F8B;">},</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#6C7834;">render</span><span style="color:#8E8F8B;">()</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">        </span><span style="color:#1C6B48;">return</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">h</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;div&#39;</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span><span style="color:#393A34;"> </span><span style="color:#B58451;">class</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#B56959;">&#39;container&#39;</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">},</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">[</span><span style="color:#6C7834;">h</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;p&#39;</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{},</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">this</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">a</span><span style="color:#8E8F8B;">),</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">h</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">Child</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span><span style="color:#393A34;"> </span><span style="color:#B58451;">a</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">this</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">a</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#B58451;">onClick</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">this</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">changeA</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">})])</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8E8F8B;">})</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">appDoc</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">document</span><span style="color:#8E8F8B;">.</span><span style="color:#6C7834;">querySelector</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;#app&#39;</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">app</span><span style="color:#8E8F8B;">.</span><span style="color:#6C7834;">mount</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">appDoc</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u9ED8\u8BA4\u5F00\u59CB\u6302\u8F7D\u4E25\u91CD</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">containerDom</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">document</span><span style="color:#8E8F8B;">.</span><span style="color:#6C7834;">querySelector</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;.container&#39;</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#6C7834;">expect</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">containerDom</span><span style="color:#8E8F8B;">?.</span><span style="color:#8C862B;">innerHTML</span><span style="color:#8E8F8B;">).</span><span style="color:#6C7834;">toBe</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;&lt;p&gt;1&lt;/p&gt;&lt;div&gt;1&lt;/div&gt;&#39;</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u8C03\u7528click</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#6C7834;">click</span><span style="color:#8E8F8B;">()</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#6C7834;">expect</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">containerDom</span><span style="color:#8E8F8B;">?.</span><span style="color:#8C862B;">innerHTML</span><span style="color:#8E8F8B;">).</span><span style="color:#6C7834;">toBe</span><span style="color:#8E8F8B;">(</span><span style="color:#B56959;">&#39;&lt;p&gt;2&lt;/p&gt;&lt;div&gt;2&lt;/div&gt;&#39;</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br></div></div><h2 id="\u5206\u6790" tabindex="-1">\u5206\u6790 <a class="header-anchor" href="#\u5206\u6790" aria-hidden="true">#</a></h2><p>\u6839\u636E\u4E0A\u9762\u7684\u6D41\u7A0B\u56FE,\u53EF\u4EE5\u5206\u6790\u51FA\u4E0B\u9762\u7684\u9700\u6C42</p><ol><li><code>updateComponent</code>\u91CC\u9762\u9700\u8981\u5B9E\u73B0\u5565;</li><li><code>updatePreRender</code>\u51FD\u6570\u91CC\u9762\u53C8\u662F\u9700\u8981\u505A\u5565;</li><li>\u600E\u4E48\u8C03\u7528<code>render</code>\u51FD\u6570\u5462?</li></ol><p>\u95EE\u9898\u89E3\u51B3:</p><h3 id="updatecomponent" tabindex="-1">updateComponent <a class="header-anchor" href="#updatecomponent" aria-hidden="true">#</a></h3><p><code>updateComponent</code>\u65B9\u6CD5\u7684\u8C03\u7528\u80AF\u5B9A\u662F\u5728<code>processComponent</code>\u4E2D\u7684<code>\u65E7vnode</code>\u5B58\u5728\u7684\u65F6\u5019\u6765\u8C03\u7528,\u91CC\u9762\u9700\u8981\u8FDB\u884C\u65B0\u8001\u8282\u70B9\u7684\u5BF9\u6BD4,\u5224\u65AD\u662F\u5426\u9700\u8981\u8FDB\u884C\u66F4\u65B0.\u66F4\u65B0\u5219\u8C03\u7528<code>updateComponentPreRender</code>\u53BB\u66F4\u65B0vnode\u7684props,slots\u7B49.\u8FD9\u91CC\u4F1A\u8FD8\u9700\u8981\u628A<strong>\u65B0vnode</strong>\u7ED9\u4FDD\u5B58\u5728\u5B9E\u4F8B\u5F53\u4E2D\u65B9\u4FBF\u540E\u7EED\u7684\u4F7F\u7528,\u6700\u540E\u8FD8\u9700\u8981\u5728<strong>\u5F53\u524D\u7684vnode\u5F53\u4E2D\u4FDD\u5B58\u5F53\u524D\u7EC4\u4EF6\u7684\u5B9E\u4F8B</strong>,\u65B9\u4FBF\u540E\u7EED\u4EA4\u6362\u65B0\u8001vnode\u7684\u65F6\u5019\u8C03\u7528.</p><h3 id="updateprerender" tabindex="-1">updatePreRender <a class="header-anchor" href="#updateprerender" aria-hidden="true">#</a></h3><p>\u8FD9\u4E2A\u51FD\u6570\u5C31\u662F\u53EA\u8981\u5904\u7406\u66F4\u65B0\u7684\u903B\u8F91\u5373\u53EF</p><h3 id="\u8C03\u7528render" tabindex="-1">\u8C03\u7528render <a class="header-anchor" href="#\u8C03\u7528render" aria-hidden="true">#</a></h3><p><code>render</code>\u7684\u8C03\u7528\u662F\u5728 <code>setupRenderEffect</code>\u4E2D\u8C03\u7528\u7684,\u662F\u4E0D\u662F\u53EF\u4EE5\u91CD\u590D\u5229\u7528\u4E0B\u8FD9\u4E2A\u529F\u80FD\u5462? \u5F53\u7136\u53EF\u4EE5,<strong>effect\u51FD\u6570\u662F\u9ED8\u8BA4\u8FD4\u56DE\u4E00\u4E2Arunner\u7684,\u53EF\u4EE5\u624B\u52A8\u8C03\u7528runner\u6765\u6267\u884Ceffect\u91CC\u9762\u7684\u65B9\u6CD5</strong>. \u90A3\u4E48\u53EF\u4EE5\u5728\u5F53\u524D\u7684\u5B9E\u4F8B\u5F53\u4E2D\u4FDD\u5B58\u4E00\u4E2A<code>update</code>\u65B9\u6CD5,\u7528\u4E8E\u9700\u8981\u8C03\u7528<code>render</code>\u7684\u65F6\u5019\u6765\u8FDB\u884C\u8C03\u7528\u5373\u53EF.</p><h2 id="\u7F16\u7801" tabindex="-1">\u7F16\u7801 <a class="header-anchor" href="#\u7F16\u7801" aria-hidden="true">#</a></h2><div class="language-ts line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A0ADA0;">// \u5728\u521B\u5EFAvnode\u5F53\u4E2D,\u6DFB\u52A0component\u5C5E\u6027</span></span>
<span class="line"><span style="color:#1C6B48;">export</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">createVNode</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">type</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">props</span><span style="color:#AB5959;">?</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">children</span><span style="color:#AB5959;">?</span><span style="color:#8E8F8B;">)</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">vnode</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">...</span><span style="color:#8C862B;">\u7701\u7565\u5176\u4ED6\u5C5E\u6027</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u5F53\u524D\u7EC4\u4EF6\u7684\u5B9E\u4F8B</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">component</span><span style="color:#393A34;">: </span><span style="color:#A65E2B;">null</span><span style="color:#8E8F8B;">,</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#8E8F8B;">}</span><span style="color:#393A34;">  </span></span>
<span class="line"><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#A0ADA0;">// \u5728instance\u4E2D\u6DFB\u52A0 next\u5C5E\u6027\u548Cupdate\u65B9\u6CD5,\u65B9\u4FBF\u540E\u7EED\u4F7F\u7528</span></span>
<span class="line"></span>
<span class="line"><span style="color:#1C6B48;">export</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">createComponentInstance</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">vnode</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">parent</span><span style="color:#8E8F8B;">)</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">instance</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// ... \u7701\u7565\u5176\u4ED6\u5C5E\u6027 </span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u66F4\u65B0\u540E\u7EC4\u4EF6\u7684vnode</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B58451;">next</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">null</span><span style="color:#8E8F8B;">,</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u5F53\u524D\u7EC4\u4EF6\u7684\u66F4\u65B0\u51FD\u6570\uFF0C\u8C03\u7528\u540E\uFF0C\u81EA\u52A8\u6267\u884Crender\u51FD\u6570</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B58451;">update</span><span style="color:#8E8F8B;">:</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">null</span><span style="color:#8E8F8B;">,</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#8C862B;">vnode</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">component</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">instance</span></span>
<span class="line"><span style="color:#8E8F8B;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A0ADA0;">// \u7ED1\u5B9Ainsance.update,\u5728setupRenderEffect\u4E2D\u8C03\u7528effect\u7684\u65F6\u5019\u7ED1\u5B9A</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A0ADA0;">// \u5B9E\u73B0updateComponent,\u5E76\u4E14\u5728processComponent\u6EE1\u8DB3n1\u7684\u65F6\u5019\u6765\u8FDB\u884C\u8C03\u7528</span></span>
<span class="line"><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">updateComponent</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">n1</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">n2</span><span style="color:#8E8F8B;">)</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u66F4\u65B0\u7EC4\u4EF6</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#AB5959;">const</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">instance</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">n2</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">component</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">n1</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">component</span><span style="color:#8E8F8B;">)</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u5224\u65AD\u662F\u5426\u9700\u8981\u66F4\u65B0</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#1C6B48;">if</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">(</span><span style="color:#6C7834;">\u9700\u8981\u66F4\u65B0</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">n1</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">n2</span><span style="color:#8E8F8B;">))</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">next</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">n2</span><span style="color:#8E8F8B;">;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#6C7834;">update</span><span style="color:#8E8F8B;">();</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8E8F8B;">}</span><span style="color:#393A34;"> </span><span style="color:#1C6B48;">else</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u4E0D\u9700\u8981\u66F4\u65B0\u5219\u8D4B\u503C</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8C862B;">n2</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">el</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">n1</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">el</span><span style="color:#8E8F8B;">;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">vnode</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">n2</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">}</span><span style="color:#393A34;"> </span></span>
<span class="line"><span style="color:#393A34;"> </span></span>
<span class="line"><span style="color:#8E8F8B;"> </span><span style="color:#A0ADA0;">// \u5728setupRenderEffect\u4E2D\u5BF9\u66F4\u65B0\u90E8\u5206\u8FDB\u884C\u6539\u9020,\u5B58\u5728next\u7684\u65F6\u5019\u6765\u8C03\u7528updateComponentPreRender</span></span>
<span class="line"><span style="color:#393A34;"> </span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#6C7834;">updateComponentPreRender</span><span style="color:#8E8F8B;">(</span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">,</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">nextVNode</span><span style="color:#8E8F8B;">)</span><span style="color:#393A34;"> </span><span style="color:#8E8F8B;">{</span></span>
<span class="line"><span style="color:#8E8F8B;">  </span><span style="color:#A0ADA0;">// \u628A\u5F53\u524D\u5B9E\u4F8B\u8D4B\u503C\u7ED9\u66F4\u65B0\u7684vnode</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">nextVNode</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">component</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">;</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u66F4\u65B0\u5F53\u524D\u5B9E\u4F8B\u7684vode</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">vnode</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">nextVNode</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u7F6E\u7A7AnewVnode</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">next</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#A65E2B;">null</span><span style="color:#8E8F8B;">;</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u66F4\u65B0\u5C5E\u6027</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">props</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">nextVNode</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">props</span><span style="color:#8E8F8B;">;</span></span>
<span class="line"><span style="color:#8E8F8B;">    </span><span style="color:#A0ADA0;">// \u66F4\u65B0\u63D2\u69FD</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#8C862B;">instance</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">slots</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">=</span><span style="color:#393A34;"> </span><span style="color:#8C862B;">nextVNode</span><span style="color:#8E8F8B;">.</span><span style="color:#8C862B;">slots</span><span style="color:#8E8F8B;">;</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#8E8F8B;">}</span></span>
<span class="line"><span style="color:#393A34;"> </span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br></div></div><h1 id="\u603B\u7ED3" tabindex="-1">\u603B\u7ED3 <a class="header-anchor" href="#\u603B\u7ED3" aria-hidden="true">#</a></h1><p>\u672C\u671F\u4E3B\u8981\u5B9E\u73B0\u4E86vue3\u7684\u7EC4\u4EF6\u66F4\u65B0,\u5728\u7EC4\u4EF6\u66F4\u65B0\u4E2D,\u4E3B\u8981\u7684\u6D41\u7A0B\u662F <code>updateComponent--&gt; updateComponentPreRender --&gt; render</code>, \u5728\u8FD9\u4E09\u4E2A\u51FD\u6570\u4E2D\u4EA4\u6362\u65B0\u8001vnode\u7684\u5C5E\u6027,\u7ED9\u628A\u5F53\u524D\u7684vnode\u7ED9\u66F4\u65B0\u6389\u5373\u53EF</p>`,26),e=[o];function r(c,t,y,i,B,A){return a(),n("div",null,e)}var u=s(l,[["render",r]]);export{d as __pageData,u as default};
