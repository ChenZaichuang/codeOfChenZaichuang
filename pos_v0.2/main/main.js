'use strict';

function sortInfo(){
  var itemInfo = {};
  var allItem=loadAllItems();

  for (var i = 0; i < allItem.length; i++){
    var obj = {};
    obj.name =  allItem[i].name;
    obj.unit =  allItem[i].unit;
    obj.price = allItem[i].price;
    obj.num = 0;
    obj.pay = 0;
    itemInfo[allItem[i].barcode] = obj;
  }

  return itemInfo;
}

function calculateInfo(itemInfo,inputs){
  var buyInfo = [];
  var paySum = 0;

  for (var i = 0; i < inputs.length; i++){
    itemInfo[inputs[i]].num++;
    if(itemInfo[inputs[i]].num <2){
      buyInfo.push(inputs[i]);
    }
  }

  for (var i = 0; i < buyInfo.length; i++){
    itemInfo[buyInfo[i]].pay = itemInfo[buyInfo[i]].price * itemInfo[buyInfo[i]].num;
    paySum += itemInfo[buyInfo[i]].pay;
  }

  itemInfo['list'] = buyInfo;
  itemInfo['paySum'] = paySum;

  return itemInfo;
}

function showInfo(itemInfo){
  var string='***<没钱赚商店>收据***\n';

  for (var i = 0; i < itemInfo.list.length; i++){
    string += '名称：'+ itemInfo[itemInfo.list[i]].name + '，数量：' 
                     + itemInfo[itemInfo.list[i]].num  
                     + itemInfo[itemInfo.list[i]].unit +'，单价：'
                     + itemInfo[itemInfo.list[i]].price.toFixed(2) + '(元)，小计：'
                     + itemInfo[itemInfo.list[i]].pay.toFixed(2) + '(元)\n';
  }

  string += '----------------------\n总计：' + itemInfo['paySum'].toFixed(2) + '(元)\n**********************';

  return string;
}

function printReceipt(inputs) {
  var itemInfo = sortInfo();
  var string='';

  itemInfo = calculateInfo(itemInfo,inputs);
  string += showInfo(itemInfo);
  console.log(string);
}


