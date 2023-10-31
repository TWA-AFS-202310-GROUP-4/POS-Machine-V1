import { error } from 'console'
import { loadAllItems } from './Dependencies'
import { ItemInfo } from './model/itemInfo'
import { ParsedInfo } from './model/parsedInfo'
import { PromotionInfo } from './model/promotionInfo'

export class PrintReceipt {
  public printReceipt(productList: string[]):string|null {

    const parsedInfo = this.aggregateProductInfo(productList)
    if (parsedInfo === null)
      return null
    console.log(parsedInfo)
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

  private caculateProductDetail(parsedInfoList:ParsedInfo[]){

  }

  private caculateProductItem(items:ItemInfo[],promotionInfo:PromotionInfo,parsedItem:ParsedInfo){

  }

  private isInPromotion(promotionInfo:PromotionInfo,parsedItem:ParsedInfo){
    return promotionInfo.barcodes.includes(parsedItem.barcode)
  }
}
