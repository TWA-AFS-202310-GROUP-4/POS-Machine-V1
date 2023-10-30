
import { loadAllItems, loadPromotions } from './Dependencies'


interface ReceiptItem {
  barcode: string
  name: string
  unit: string
  price: number
}
interface Promotion {
  type: string
  barcodes: string[]
}

const receiptItemList: ReceiptItem[] = loadAllItems()
const promotionList: Promotion[] = loadPromotions()
let total = 0
let savings = 0
let itemsMap: { [key: string]: { product: ReceiptItem, quantity: number } } = {}


export function printReceipt(tags: string[]): string {
  itemsMap = {}
  total = 0
  savings = 0
  if (!isValidTag(tags)) return `Invalid tag`
  const receiptLines: string[] = []
  processTags(tags)
  for (const itemBarcode in itemsMap) {
    receiptLines.push(generateReceiptLine(itemBarcode))
  }
  return renderReceipt(receiptLines)
}
function generateReceiptLine(barcode: string): string{
  const { product, quantity } = itemsMap[barcode]
  const subtotal = handlePromotion(product,quantity)
  total += subtotal
  let unit = product.unit
  if (quantity > 1 || (quantity > 0 && quantity < 1) ){
    unit += 's'
  }
  const line = `Name：${product.name}，Quantity：${quantity} ${unit}，Unit：${product.price.toFixed(2)}(yuan)，Subtotal：${subtotal.toFixed(2)}(yuan)`
  return line
}
function handlePromotion(product: ReceiptItem,quantity: number): number{
  let subtotal = product.price * quantity
  const promo = promotionList.find(item => item.barcodes.includes(product.barcode))
  // Handle promotions
  if (promo && promo.type === 'BUY_TWO_GET_ONE_FREE') {
    const freeItems = Math.floor(quantity / 3)
    savings += freeItems * product.price
    subtotal -= freeItems * product.price
    return subtotal
  }
  return subtotal

}
function isValidTag(tags: string[]): boolean {
  for (const tag of tags) {
    const [barcode, quantityStr] = tag.split('-')
    if(!receiptItemList.some(p => p.barcode === barcode)){
      return false
    }
    if(quantityStr && isNaN(parseFloat(quantityStr))){
      return false
    }
  }
  return true
}
function processTags(tags: string[]): void {
  for (const tag of tags) {
    const [itemBarcode, quantityStr] = tag.split('-')
    const quantity = quantityStr ? parseFloat(quantityStr) : 1
    const product = receiptItemList.find(p => p.barcode === itemBarcode)

    if (!product) continue
    if (itemsMap[product.barcode]) {
      itemsMap[product.barcode].quantity += quantity
    } else {
      itemsMap[product.barcode] = { product, quantity }
    }
  }
}


function renderReceipt(receiptLines: string[]): string {

  let receiptStr = "***<store earning no money>Receipt ***\n"
  receiptStr += receiptLines.join('\n')
  receiptStr += "\n----------------------\n"
  receiptStr += `Total：${total.toFixed(2)}(yuan)\n`
  receiptStr += `Discounted prices：${savings.toFixed(2)}(yuan)\n`
  receiptStr += "**********************"

  return receiptStr
}

// const tags = [
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000003-0.5',
//   'ITEM000005',
//   'ITEM000005-2',
// ]
// console.log(printReceipt(tags))
