import { error } from 'console'
import { loadAllItems, loadPromotions } from './Dependencies'
import { ItemInfo } from './model/itemInfo'
import { ParsedInfo } from './model/parsedInfo'
import { PromotionInfo } from './model/promotionInfo'
import { ReceiptItem } from './model/receipt'
import { QuantityInfo } from './model/quantityInfo'

export class PrintReceipt {
  public printReceipt(productList: string[]):string|null {

    const parsedInfo = this.aggregateProductInfo(productList)
    if (parsedInfo === null)
      return null
    //console.log(parsedInfo)
    const receipt=this.caculateProductDetail(parsedInfo)
    console.log(receipt)
    return "ssss"
  }

  private isProductInfoValid(itemList: ItemInfo[], productionList: string[]): boolean {
    const tagList = Array.from(itemList, item => item.barcode)
    for (let i = 0; i < productionList.length; i++) {
      if (!tagList.includes(productionList[i].slice(0, 10))) {
        return false
      }
    }
    return true
  }

  private aggregateProductInfo(productList: string[]): ParsedInfo[] | null {
    const parsedResult: ParsedInfo[] = []
    const itemList = loadAllItems()
    if (!this.isProductInfoValid(itemList, productList))
      return null
    productList.map(item =>
      this.caculateProductQuantity(parsedResult, item)
    )

    return parsedResult

  }

  private caculateProductQuantity(currentParsedInfo: ParsedInfo[], productItem: string): ParsedInfo[] {
    const index = currentParsedInfo.findIndex(item => item.barcode === productItem)
    if (index === -1) {
      currentParsedInfo.push({ barcode: productItem.slice(0, 10), quantity: this.parseProductQuantity(productItem) })
    } else {
      currentParsedInfo[index].quantity += this.parseProductQuantity(productItem)
    }
    return currentParsedInfo
  }

  private parseProductQuantity(productItem: string): number {
    if (!productItem.includes('-'))
      return 1
    return Number(productItem.slice(productItem.indexOf('-') + 1))
  }

  private caculateProductDetail(parsedInfoList:ParsedInfo[]):ReceiptItem[]{
    const itemList = loadAllItems()
    const promoteInfo=loadPromotions()[0]
    const receiptList:ReceiptItem[]=[]
    for(let i=0;i<parsedInfoList.length;i++){
      receiptList.push(this.caculateProductItem(itemList,promoteInfo,parsedInfoList[i]))
    }
    return receiptList
  }

  private caculateProductItem(items:ItemInfo[],promotionInfo:PromotionInfo,parsedItem:ParsedInfo):ReceiptItem{
    const index=items.findIndex(item=>item.barcode===parsedItem.barcode)
    const quantityInfo:QuantityInfo={value:parsedItem.quantity,quantifier: items[index].unit+'s'}
    const receiptItem:ReceiptItem={
      name: '',
      quantity: quantityInfo,
      unitPrice: 0,
      subTotal: 0,
      discountTotal: 0
    }
    receiptItem.name=items[index].name
    receiptItem.unitPrice=items[index].price
    receiptItem.discountTotal=this.caculateSubDiscount(parsedItem,this.isInPromotion(promotionInfo,parsedItem),receiptItem.unitPrice)
    receiptItem.subTotal=this.caculateSubTotal(parsedItem,receiptItem.unitPrice,receiptItem.discountTotal)
    return receiptItem
  }

  private isInPromotion(promotionInfo:PromotionInfo,parsedItem:ParsedInfo){
    return promotionInfo.barcodes.includes(parsedItem.barcode)
  }

  private caculateSubDiscount(parsedItem:ParsedInfo,promoted:boolean,unitPrice:number):number{
    if(!promoted) return 0
    return parsedItem.quantity/3*unitPrice
  }

  private caculateSubTotal(parsedItem:ParsedInfo,unitPrice:number,subTotalDiscount:number){
    return parsedItem.quantity*unitPrice-subTotalDiscount
  }

  private CaculateProductsTotalExpense()
}
