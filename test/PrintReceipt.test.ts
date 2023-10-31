import {printReceipt} from '../src/PrintReceipt'

describe('printReceipt', () => {
  it('should print receipt with promotion when print receipt', async () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000002-5',
      'ITEM000003-2',
      'ITEM000004-1.5'
    ];

    const expected = `***<store earning no money>Receipt ***
Name: Coca-Cola, Quantity: 3 bottles, Unit: 3.00(yuan), Subtotal: 6.00(yuan)
Name: Badminton, Quantity: 5 , Unit: 1.00(yuan), Subtotal: 4.00(yuan)
Name: Apples, Quantity: 2 poundss, Unit: 5.50(yuan), Subtotal: 11.00(yuan)
Name: Oranges, Quantity: 1.5 poundss, Unit: 5.50(yuan), Subtotal: 8.25(yuan)
----------------------
Total: 29.25(yuan)
Discounted prices: 4.00(yuan)
**********************`;

    const result = await printReceipt(tags);
    expect(result).toEqual(expected);
  });
});
