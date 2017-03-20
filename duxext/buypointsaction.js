var env = 'prod';
// sandbox doesn't work at all :(
//var env = 'sandbox';

function populateSKUs(){
    google.payments.inapp.getSkuDetails({
    'parameters': {'env': env},
    'success': onSkuDetails,
    'failure': populateSKUs
    });
    addTradeToUI();
}
function onSkuDetails(skus) {
  var products = skus.response.details.inAppProducts;
  var count = products.length;
  for (var i = 0; i < count; i++) {
    addProductToUI(products[i]);
  }
}
function addProductToUI(product){
    var row = document.getElementById(product.sku);
    row.querySelector(".dstitle").innerText = product.localeData[0].title;
    row.querySelector(".dsbuy").value="Buy for "+formatPrice(product.prices[0].currencyCode, product.prices[0].valueMicros);
    row.querySelector(".dsbuy").onclick=function(){buyPoints(product.sku)};
    row.querySelector(".dsdesc").innerText = product.localeData[0].description;
}
function addTradeToUI(){
    var row = document.getElementById("trade");
    row.querySelector(".dstitle").innerText = "Trade-in your own emails";
    row.querySelector(".dsbuy").value="Exchange 2 for 1";
    row.querySelector(".dsbuy").onclick=function(){tradeContacts()};
    row.querySelector(".dsdesc").innerText = "Receive 1 Dux-Soup Point for every 2 contributed email address.";
}
function formatPrice(currencycode, value){
    var amount = (parseInt(value)/10000)/100;
    return amount.toLocaleString(window.navigator.language, { style: 'currency', currency: currencycode, maximumFractionDigits: 2 });
}
function onPurchase(sku){
    // consume the purchase.
    google.payments.inapp.consumePurchase({
        'parameters': {'env': env},
        'sku': sku,
        'success': onConsume,
        'failure': onPurchaseFail
    });
    console.log(result);
}
function onConsume(sku){
    // update backend credit count 
    google.payments.inapp.consumePurchase({
        'parameters': {'env': env},
        'sku': sku,
        'success': onCreditsAdded,
        'failure': onPurchaseFail
    });
}
function onPurchaseFail(msg){
    alert('Your purchased failed, you have not been charged.');
}
function onCreditsAdded(result){
    sendMessage({command:"getpointsbalance", updateledger:true}, function(result){
        // result can be null when initialisation is ongoing, or has failed.
        if (result!=null){
            setElementProperty("currentmailbalance", "textContent", "Your points balance: "+result.pointsbalance+(result.pointsbalance==1?" Dux-Soup Point":" Dux-Soup Points"));            
        }
        alert("Your purchase was successful, Thank You. Your balance has been updated.");
    });
}
function onCreditsFailed(result){
    console.log(result);
}
function tradeContacts(){
    if (document.getElementById("tandcs").checked == true){
        // TODO : send to contribution pagea
        alert("Coming soon!");
    }else{
        alert("Please confirm you have read, and agree to, the Dux-Soup Points Terms & Conditions. You can do this by checking the box at the bottom of this page before proceeding.");
        document.getElementById("tandcs").focus();
    }
}
function buyPoints(sku){
    if (document.getElementById("tandcs").checked==true){
        google.payments.inapp.buy({
            'parameters': {'env': env},
            'sku': sku,
            'success': function(){checkPurchase(sku);},
            'failure': function(){checkPurchase(sku);} 
        });
    }else{
        alert("Please confirm you have read, and agree to, the Dux-Soup Points Terms & Conditions. You can do this by checking the box at the bottom of this page before proceeding.");
        document.getElementById("tandcs").focus();
    }
};
function displayBalance(){
    // updateledger to false in production, this is just for development
    sendMessage({command:"getpointsbalance", updateledger:true}, function(result){
        // result can be null when initialisation is ongoing, or has failed.
        if (result!=null){
            setElementProperty("currentmailbalance", "textContent", "Your current balance: "+result.pointsbalance+(result.pointsbalance==1?" Dux-Soup Point":" Dux-Soup Points"));            
        }
    });
}
function checkPurchase(sku){
    google.payments.inapp.getPurchases({
        'parameters': {'env': env},
        'success': function(result){
            var handled = false;
            for (var i=0; i<result.response.details.length; i++){
                if (result.response.details[i].sku == sku){
                    handled = true;
                    if (result.response.details[i].state == "ACTIVE"){
                        onConsume(sku);
                    }else if (result.response.details[i].state == "PENDING" ||
                    result.response.details[i].state == "CANCELLED_BY_DEVELOPER"){
                        setTimeout(function(){
                            // transaction pending, wait and try again.
                            checkPurchase(sku);
                        }, 1000);
                    }else{
                        onPurchaseFail(result.response.details[i].state)
                    }
                }
            }
            if (!handled){
                onPurchaseFail('Purchased Cancelled');
            }
        },
        'failure': function(result){
            onPurchaseFail(result.response.errorType);
        }
    });
}
function logit(data){
    console.log(JSON.stringify(data));
}
populateSKUs();
displayBalance();
//      google.payments.inapp.getPurchases({
//    'parameters': 
//         {
//             'env': env,
//             'projection':'PLAY_STORE'
//         },
//    'success': logit,
//    'failure': logit
//  });

// google.payments.inapp.consumePurchase({
//     'parameters': {'env': 'prod'},
//     'sku': '1_point',
//     'success': logit,
//     'failure': logit
// });