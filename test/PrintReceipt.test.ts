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

// describe('printReceipt', () => {
//   it('should print parsed Info', () => {
//     const basic = new PrintReceipt()
//     const tags = [
//       'ITEM000001',
//       'ITEM000001',
//       'ITEM000001',
//       'ITEM000001',
//       'ITEM000001',
//       'ITEM000003-2.5',
//       'ITEM000005',
//       'ITEM000005-2',
//     ]

//     expect(basic.printReceipt(tags)).toEqual("{ barcode: 'ITEM000001', quantity: 5 },{ barcode: 'ITEM000003', quantity: 2.5 },{ barcode: 'ITEM000005', quantity: 1 },{ barcode: 'ITEM000005', quantity: 2 }")
//   })
// })
