import {loadAllItems, loadPromotions} from './Dependencies'

interface Promotion{
  type: string
  barcodes: string[]
}

interface ItemBasicInfo{
  barcode: string
  name: string
  unit:string
  price: number
}

interface ItemInfo{
  barcode: string
  name: string
  unit: string
  price: number
  quantity: number
  promotion: string
  subtotal: number
}

interface Receipt{
  total: number
  discountedPrice: number
  itemInfos: ItemInfo[]
}

export function printReceipt(tags: string[]): string {
  const itemInfos = parseAndValidate(tags)
  const receipt: Receipt = generateReceipt(itemInfos)
  return renderReceipt(receipt)
}

function parseAndValidate(tags: string[]): ItemInfo[] {
  const items = loadAllItems()
  const promotions = loadPromotions()

  const itemInfos: ItemInfo[] = []

  for(const tag of tags){
    const splitRes = tag.split('-')
    const barcode = splitRes[0]

    const itemBasicInfo = getInfoByBarCode(barcode,items)
    if (itemBasicInfo === undefined){
      throw new Error(`${barcode} not exist!`)
    }

    let quantity = 1.0
    if (splitRes.length === 2){
      quantity = parseFloat(splitRes[1])
    }

    const itemInfo = itemInfos.find((v,i,o) => v.barcode === barcode)
    if (itemInfo === undefined){
      itemInfos.push(
        {
          "barcode": barcode,
          "name": itemBasicInfo.name,
          "price": itemBasicInfo.price,
          "quantity": quantity,
          "subtotal": 0.0,
          "unit": itemBasicInfo.unit,
          "promotion": getPromotionTypeByBarCode(barcode, promotions)
        }
      )
    }else{
      itemInfo.quantity += quantity
    }
  }

  return itemInfos
}

function getInfoByBarCode(barcode: string, items: ItemBasicInfo[]): ItemBasicInfo | undefined{
  return items.find((v,i,o) => v.barcode === barcode)
}

function getPromotionTypeByBarCode(barcode: string, promotions: Promotion[]): string{

  const promotionsFilted = promotions.filter(
    (v,i,a) => v.barcodes.findIndex((v,i,o)=>v===barcode) !== -1
  )

  if (promotionsFilted.length > 0){
    return promotionsFilted[0].type
  }else{
    return ''
  }
}

function generateReceipt(itemInfos: ItemInfo[]): Receipt {
  let total = 0.0
  let discountedPrice = 0.0
  for (const itemInfo of itemInfos){
    let number = itemInfo.quantity
    if (itemInfo.promotion === "BUY_TWO_GET_ONE_FREE"){
      number = getAccountNeedToPay(itemInfo.quantity)
      discountedPrice += (itemInfo.quantity - number) * itemInfo.price
    }

    itemInfo.subtotal = itemInfo.price * number
    total += itemInfo.subtotal
  }

  return {
    "discountedPrice": discountedPrice,
    "itemInfos": itemInfos,
    "total": total
  }
}

function getAccountNeedToPay(quantity: number): number{
  for(let x = 1;;x++){
    if (x + Math.floor(x/2) >= quantity){
      return x
    }
  }
}

function renderReceipt(receipt: Receipt): string{
  const middle = receipt.itemInfos.map(
    itemInfo => `Name：${itemInfo.name}，Quantity：${itemInfo.quantity} ${itemInfo.unit}s，Unit：${itemInfo.price.toFixed(2)}(yuan)，Subtotal：${itemInfo.subtotal.toFixed(2)}(yuan)`
  ).join('\n')

  return `***<store earning no money>Receipt ***\n${middle}
----------------------
Total：${receipt.total.toFixed(2)}(yuan)
Discounted prices：${receipt.discountedPrice.toFixed(2)}(yuan)
**********************`
}
