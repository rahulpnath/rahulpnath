---
author: [Rahul Nath]
title: "TypeScript: Use Sum Types To Your Advantage When Modelling Data"
  
date: 2020-02-24
tags:
  - TypeScript
thumbnail: ../images/typescript_sum_types.jpg
---

Recently I was working at a client, and we had to take online payment for the service they provide. There were two options to pay - either in part or in full. When paying in full, the payment included a total amount and a refundable amount. When paying in partial, there is a minimum amount required to be paid at the time of purchase, the remaining amount with a surcharge (optional based on the card used for payment) amount, and a refundable amount.

Initially, I started modeling the data using one interface as below - _PaymentOptions_. It has a type to indicate partial or full payment. The properties totalRental, payNow and refundableBond are applicable in both scenarios. However, payNow and totalRental are the same in the case of 'full' payment. The properties balance, balanceSurcharge, and payLater are only applicable when the payment option is of type 'partial'.

```ts
export interface PaymentOption {
  type: "partial" | "full";
  totalRental: number;
  payNow: number;
  refundableBond: number;
  balance?: number;
  balanceSurcharge?: number;
  payLater?: number;
}
```

You can see the problem - I had to explain a lot and is still confusing. It needs a lot of back and forth to understand how these data fit together.

**_It is not expressive enough!_**

I am sure when I go back to this code a couple of weeks from now, it will be hard to understand. I bet this will be the same, if not harder, for anyone new who has to look into the same code and maintain it.

I decided to split out the payment options into two different definitions. [Sum Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions) (or Discriminated Union or Algebraic Data Types) are a great way to represent data when they can take multiple options. We have a 'PaymentOption' type which can either be a 'FullPaymentOption or a 'PartPaymentOption'. We can now have the properties that apply to each scenario together.

> You can combine singleton types, union types, type guards, and type aliases to build an advanced pattern called discriminated unions, also known as tagged unions or algebraic data types Or Sum Types.

```ts
export type PaymentOption = FullPaymentOption | PartPaymentOption;

export interface FullPaymentOption {
  type: "full";
  totalRental: number;
  payNow: number;
  refundableBond: number;
}

export interface PartPaymentOption {
  type: "partial";
  totalRental: number;
  payNow: number;
  refundableBond: number;
  balance: number;
  balanceSurcharge?: number;
  payLater: number;
}
```

The data is now expressive and indicates what fields apply to the relevant payment option. Since 'balanceSurcharge' is optional based on the card type used for payment, I have it as optional on 'PartPaymentOption' type.

When using the PaymentOption Sum Type we can conditionally check for the type of option it represents using the 'type' property, also referred to as the '_discriminant_'. Once we case it to a specific type, TypeScript is intelligent enough to restrict us to the properties that type has defined. For, e.g. if it a 'full' payment, refundableBond (or any of the other properties that are only applicable to a 'part' payment option) cannot be accessed. It makes it extremely useful when consuming Sum types and makes it less error-prone.

No longer do we need to keep track of when data will and will not be populated. Having conditional properties on an interface or a class creates confusion. It makes it harder to deal with the data and the various combinations it can take. Tend to avoid this as much as possible. I hope this gives you an idea to take away and implement for your problem.

<iframe
     src="https://codesandbox.io/embed/using-sum-types-to-model-data-esl5j?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Using Sum Types to Model Data"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>
