describe('尝试使用cypress来测试项目', () => {
  // 在窗口打开本地项目的连接
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('测试一个小demo', () => {
    // 做一个这样demo, 一个输入框，一个按钮，输入框输入数据后，点击按钮，输入框的内容消息，下面的数据列表展示对应的数据
    // 拿到输入框，输入对应的数据
    cy.get('[data-test=testMessage]').type('hello cypress');
    // 拿到按钮，并且点击按钮
    cy.get('[data-test=testButton]').click();
    // 输入框的值是空
    cy.get('[data-test=testMessage]').should('have.value', '');
    // 下面的数据列表展示对应的数据
    cy.get('[data-test=testList] li').should('have.length', 1);
    // ul li显示的数据
    cy.get('[data-test=testList] li').first().should('have.text', 'hello cypress');
  })
})
