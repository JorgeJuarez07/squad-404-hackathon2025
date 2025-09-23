import { createAuthenticatedClient, isFinalizedGrant } from "@interledger/open-payments";

import readline from "readline/promises";

const KEY_ID = "03f94001-ff12-4bc9-a1f9-3ef0af7db36a";
const WALLET_ADDRESS = "https://ilp.interledger-test.dev/39d4e82c";


(async ()=>{
    
const client = await createAuthenticatedClient({
  walletAddressUrl: WALLET_ADDRESS,
  privateKey: "private.key",
  keyId: KEY_ID
});

const sendwalletAddress = await client.walletAddress.get({
    url: "https://ilp.interledger-test.dev/39d4e82c",
});

const receivwalletAddress = await client.walletAddress.get({
    url: "https://ilp.interledger-test.dev/vsdsd",
});

console.log(sendwalletAddress, receivwalletAddress);

const incomingPayment = await client.grant.request(
  {
    url: receivwalletAddress.authServer,
  },
  {
    access_token: {
      access: [
        {
          type: "incoming-payment",
          actions: ["create"], 
        },
      ],
    },
  }
);

if (!isFinalizedGrant(incomingPayment)) {
    throw new Error("Expected a finalized grant");
}

console.log({incomingPayment});

const incomingPaymentDetails = await client.incomingPayment.create({
    url: receivwalletAddress.resourceServer,
    accessToken: incomingPayment.access_token.value
},{
    walletAddress: receivwalletAddress.id,
    incomingAmount:{
        assetCode: receivwalletAddress.assetCode,
        assetScale: receivwalletAddress.assetScale,
        value: "10000"
    }
});
console.log({incomingPaymentDetails});

const quotegrant = await client.grant.request({
    url: sendwalletAddress.authServer,
},{
access_token: {
    access: [
    {
        type: "quote",
        actions: ["create"],
    },
    ],
},
});

if (!isFinalizedGrant(quotegrant)) {
    throw new Error("Expected a finalized grant"); 
}

console.log({quotegrant});

const quote = await client.quote.create({
    url: sendwalletAddress.resourceServer,
    accessToken: quotegrant.access_token.value
},{
    walletAddress: sendwalletAddress.id,
    receiver: incomingPaymentDetails.id,
    method: "ilp",  
});

console.log({quote});

const outgoingPayment = await client.grant.request({
    url: sendwalletAddress.authServer,
},
{
    access_token:{
        access:[
            {
                type: "outgoing-payment",
                actions: ["create"],
                limits:{
                    debitAmount:quote.debitAmount,
                    
                },
                identifier: sendwalletAddress.id
            }
        ]
    },
    interact:{
        start: ["redirect"],
    },
});
console.log({outgoingPayment});


await readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).question("Press Enter to continue...");

const finalizedOutgoingPayment = await client.grant.continue({
    url: outgoingPayment.continue.uri,
    accessToken: outgoingPayment.continue.access_token.value
})
if (!isFinalizedGrant(finalizedOutgoingPayment)) {
    throw new Error("Expected a finalized grant"); 
   }

   console.log({finalizedOutgoingPayment});

const outgoingPaymentDetails = await client.outgoingPayment.create({
    url: sendwalletAddress.resourceServer,
    accessToken: finalizedOutgoingPayment.access_token.value
},{
    walletAddress: sendwalletAddress.id,
    quoteId: quote.id
});

console.log({outgoingPaymentDetails});

})();