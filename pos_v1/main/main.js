'use strict';

function createItemIndex(){
    var itemInfo = {};
    var allItems = loadAllItems();
    
    for (var i = 0; i < allItems.length; i++){
        var object = {};
        object.name = allItems[i].name;
        object.unit = allItems[i].unit;
        object.price = allItems[i].price;
        object.buyNum = 0;
        object.pay = 0;
        itemInfo[allItems[i].barcode] = object;
    }

    return itemInfo;
}

function getBuyNumAndBuyList(itemInfo,tags){
    var bufInfo=[];
    for (var i = 0; i < tags.length; i++){

        var barcodeName = tags[i];

        if (barcodeName.indexOf('-') == -1){
            if(itemInfo[barcodeName].buyNum == 0){
                bufInfo.push(barcodeName);
            }
            itemInfo[barcodeName].buyNum++;
        }
        else{
            var strName = barcodeName.substring(0,barcodeName.indexOf('-'));
            var strNum = barcodeName.substring(barcodeName.indexOf('-')+1);

            if(itemInfo[strName].buyNum == 0){
                bufInfo.push(strName);
            }
            itemInfo[strName].buyNum+=Number(strNum);
        }
    }
    itemInfo['bufInfo'] = bufInfo;

    return itemInfo;
}

function calcutePay(itemInfo){
    var promotionItem = loadPromotions()[0].barcodes;
    var paySum=0; 
    var savePay=0;

    for (var i=0; i<itemInfo.bufInfo.length;i++){
        if(itemInfo[itemInfo.bufInfo[i]].buyNum >= 2 && promotionItem.indexOf(itemInfo.bufInfo[i]) !=-1){
            itemInfo[itemInfo.bufInfo[i]].pay = (itemInfo[itemInfo.bufInfo[i]].buyNum-Math.floor(itemInfo[itemInfo.bufInfo[i]].buyNum/3)) * itemInfo[itemInfo.bufInfo[i]].price;
            savePay += itemInfo[itemInfo.bufInfo[i]].price;
        }
        else {
            itemInfo[itemInfo.bufInfo[i]].pay = itemInfo[itemInfo.bufInfo[i]].buyNum * itemInfo[itemInfo.bufInfo[i]].price;
        }
        paySum += itemInfo[itemInfo.bufInfo[i]].pay;
    }
    itemInfo.paySum = paySum;
    itemInfo.savePay = savePay;

    return itemInfo;
}

function createShowString(itemInfo){
    var string = '***<没钱赚商店>收据***\n';

    for (var i = 0; i < itemInfo.bufInfo.length; i++){
        string +=   '名称：' + itemInfo[itemInfo.bufInfo[i]].name + '，数量：' +
                    itemInfo[itemInfo.bufInfo[i]].buyNum + 
                    itemInfo[itemInfo.bufInfo[i]].unit + '，单价：' +
                    itemInfo[itemInfo.bufInfo[i]].price.toFixed(2) + '(元)，小计：' +
                    itemInfo[itemInfo.bufInfo[i]].pay.toFixed(2) + '(元)\n';
    }
    string += '----------------------\n总计：' + itemInfo.paySum.toFixed(2) + '(元)\n节省：' + itemInfo.savePay.toFixed(2) + '(元)\n**********************';

    return string;
}

function printReceipt(tags){
    var itemInfo = createItemIndex();
    itemInfo = getBuyNumAndBuyList(itemInfo,tags);
    itemInfo = calcutePay(itemInfo);
    var string = createShowString(itemInfo);
    console.log(string);
}
