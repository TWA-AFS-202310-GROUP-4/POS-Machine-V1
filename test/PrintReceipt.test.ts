import { PrintReceipt } from '../src/PrintReceipt'

describe('printReceipt validation test', () => {
  it('should return null', () => {
    const basic = new PrintReceipt()
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000011',
      'ITEM000005-2',
    ]

    expect(basic.printReceipt(tags)).toBeNull()
  })
})

describe('printReceipt', () => {
  it('should print parsed Info', () => {
    const basic = new PrintReceipt()
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ]
    const expectText = `***<store earning no money>Receipt ***
Name:Sprite,Quantity:5 bottles,Unit:3.00(yuan),Subtotal:12.00(yuan)
Name:Litchi,Quantity:2.5 pounds,Unit:15.00(yuan),Subtotal:37.50(yuan)
Name:Instant Noodles,Quantity:3 bags,Unit:4.50(yuan),Subtotal:9.00(yuan)
----------------------
Total:58.50(yuan)
Discounted prices:7.50(yuan)
**********************`
    expect(basic.printReceipt(tags)).toEqual(expectText)
  })
})
