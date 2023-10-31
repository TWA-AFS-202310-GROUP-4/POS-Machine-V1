interface Item {
  barcode: string
  name: string
  unit: string
  price: number
}

interface Promotion {
  type: string
  barcodes: string[]
}

interface ReceiptItem {
  barcode: string
  quantity?: number
  itemInfo?: Item
  totalPrice?: number
  discount?: number
}

async function loadAllItems() : Promise<Item[]> {
  return [
    {
      barcode: 'ITEM000001',
      name: 'Coca-Cola',
      unit: 'bottle',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: 'Badminton',
      unit: '',
      price: 1.00
    },
    {
      barcode: 'ITEM000003',
      name: 'Apples',
      unit: 'pounds',
      price: 5.50
    },
    {
      barcode: 'ITEM000004',
      name: 'Oranges',
      unit: 'pounds',
      price: 5.50
    }
  ]
}

async function loadPromotions() : Promise<Promotion[]> {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000001',
        'ITEM000002'
      ]
    },
    {
     type: 'OTHER_PROMOTION',
     barcodes: [
       'ITEM000003'
     ]
   }
  ]
}

export async function printReceipt(items : string[]) : Promise<string> {
  const allItems = await loadAllItems();
  const promotions = await loadPromotions();
  
  const parsedItems = parseQuantity(items);
  const setItems = setItemsInfo(parsedItems, allItems);
  const totalPrice = calculateTotalPrice(setItems);
  const discounted = calculateDiscountedSubTotal(totalPrice, promotions);
  const receipt = generateReceipt(discounted);
  return receipt;
}

function parseQuantity(items: string[]): ReceiptItem[] {
  const quantityMap = new Map<string, number>();

  items.forEach(item => {
    const [barcode, quantity] = item.split('-');
    const parsedQuantity = Number(quantity) || 1;
    quantityMap.set(barcode, (quantityMap.get(barcode) || 0) + parsedQuantity);
  });

  return Array.from(quantityMap.entries(), ([barcode, quantity]) => ({ barcode, quantity }));
}


function setItemsInfo(items: ReceiptItem[], allItems: Item[]): ReceiptItem[] {
  const itemMap = new Map(allItems.map(item => [item.barcode, item]));
  return items.map(item => ({...item, itemInfo: itemMap.get(item.barcode)})).filter(item => item.itemInfo);
}

function calculateTotalPrice(receiptItems: ReceiptItem[]): ReceiptItem[] {
  return receiptItems.map(item => ({...item, totalPrice: item.itemInfo!.price * item.quantity!}));
}

function calculateDiscountedSubTotal(items: ReceiptItem[], promotions: Promotion[]): ReceiptItem[] {
  return items.map(item => {
    const promotion = promotions.find(promotion => promotion.barcodes.includes(item.barcode));
    if (promotion?.type === 'BUY_TWO_GET_ONE_FREE') {
      return {...item, discount: Math.floor(item.quantity! / 3) * item.itemInfo!.price};
    }
    return {...item, discount : 0};
  });
}

function generateReceipt(items: ReceiptItem[]): string {
  let receipt = '***<store earning no money>Receipt ***\n';
  items.forEach(item => {
    const unit = item.itemInfo!.unit;
    const unitText = item.quantity! > 1 ? (item.itemInfo!.unit !== '' ? `${unit}s` : unit) : (item.itemInfo!.unit !== '' ? `${unit}s` : unit);
    receipt += `Name: ${item.itemInfo!.name}, Quantity: ${item.quantity} ${unitText}, Unit: ${item.itemInfo!.price.toFixed(2)}(yuan), Subtotal: ${(item.totalPrice! - item.discount!).toFixed(2)}(yuan)\n`;
  });
  receipt += '----------------------\n';

  let total = 0;
  for (const item of items) {
    total += item.totalPrice! - item.discount!;
  }
  const totalFormatted = total.toFixed(2);
  receipt += `Total: ${totalFormatted}(yuan)\n`;

  let discountedPrices = 0;
  for (const item of items) {
    discountedPrices += item.discount!;
  }
  const discountedPricesFormatted = discountedPrices.toFixed(2);
  receipt += `Discounted prices: ${discountedPricesFormatted}(yuan)\n`;
  receipt += '**********************';
  return receipt;
}

const tags : string[] = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000002-5',
      'ITEM000003-2',
      'ITEM000004-1.5'
    ];

printReceipt(tags).then(receipt => {
    console.log(receipt);
  }).catch(error => {
    console.error('An error occurred:', error);
  });

// test
// describe('printReceipt', () => {
//   it('should print all receipt items', async () => {
//     const tags = [
//       'ITEM000001',
//       'ITEM000001',
//       'ITEM000001',
//       'ITEM000002-5',
//       'ITEM000003-2',
//       'ITEM000004-1.5'
//     ];

//     const expected = `***<store earning no money>Receipt ***
// Name: Coca-Cola, Quantity: 3 bottles, Unit: 3.00(yuan), Subtotal: 6.00(yuan)
// Name: Badminton, Quantity: 5 , Unit: 1.00(yuan), Subtotal: 4.00(yuan)
// Name: Apples, Quantity: 2 poundss, Unit: 5.50(yuan), Subtotal: 11.00(yuan)
// Name: Oranges, Quantity: 1.5 poundss, Unit: 5.50(yuan), Subtotal: 8.25(yuan)
// ----------------------
// Total: 29.25(yuan)
// Discounted prices: 4.00(yuan)
// **********************`;
// const result = await printReceipt(tags);
// expect(result).toEqual(expected);
// });
