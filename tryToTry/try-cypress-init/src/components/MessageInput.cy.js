import MessageInput from './MessageInput.vue'
describe('<MessageInput>', () => {
  // 挂载组件
  it('mount component', () => {
    cy.mount(MessageInput)
  })

  it('MessageInput在数据输入，点击功能测试', () => {
    const onMessageInput = cy.spy().as('onMessageInputSpy')
    cy.mount(MessageInput, { props: { onSendMessage: onMessageInput } })
    // 找到input输入内容
    cy.get('[data-test=testMessage]').type('hello cypress');
    // 找到按钮并且点击
    cy.get('[data-test=testButton]').click();
    // 触发事件onSendMessage，并且值是hello cypress
    cy.get('@onMessageInputSpy').should('be.calledWith', 'hello cypress')
    // 验证输入框是否为空
    cy.get('[data-test=testMessage]').should('have.value', '')
  })
})
