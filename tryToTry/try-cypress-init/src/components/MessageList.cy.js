import MessageList from './MessageList.vue';
describe('<MessageList>', () => {
  it('mount component', () => {
    cy.mount(MessageList)
  })

  it('test show dataList', () => {
    // 传入数据
    cy.mount(MessageList, { props: { messageList: ['hello cypress'] } })
    // ul元素下的li元素个数为1
    cy.get('[data-test=testList] li').should('have.length', 1);
    // ul li显示的数据
    cy.get('[data-test=testList] li').first().should('have.text', 'hello cypress');
  })
})
