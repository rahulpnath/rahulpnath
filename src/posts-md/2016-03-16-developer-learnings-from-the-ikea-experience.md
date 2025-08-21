---
title: Developer Learnings from the IKEA Experience
slug: developer-learnings-from-the-ikea-experience
date_published: 2016-03-16T05:44:03.000Z
date_updated: 2016-03-16T05:44:03.000Z
tags: Programming, Thoughts
---

When we moved over to Sydney, last year, we had to start over with all the home furnishings. Since we were just starting out, didn't want to spent a lot on furnishings, so decided to go with [IKEA](http://www.ikea.com/au/en/?cid=au%7Cps%7Cbranded%7Cbrand%7Cgoogle%7Cikea_australia) for its cost effectiveness and value for money.

> *IKEA is a multinational group of companies that designs and sells ready-to-assemble furniture (such as beds, chairs and desks), appliances, small motor vehicles and home accessories. Wiki*

Right from the in-shop experience to setting it up, I found many similarities with the IKEA experience and Software Development. Visiting IKEA is an experience in itself and totally wow's you. If not for any of the displayed items, the '*Self Serve Furniture Area*' surely will. The sheer size and setup there was breath-taking for me and my wife!
![IKEA Self Serve Furniture Area, Ikea Tempe](__GHOST_URL__/content/images/ikea_self_serve_furniture_area.jpg)*This is just one of the aisle and there were around 35 of them!*
## Code Management & Inventory Management

Throughout the [Showroom](https://shoutsfromtheabyss.files.wordpress.com/2013/06/ikea-map.jpg) you see an *Aisle number* and the *Location* displayed under the displayed items. For the items interested in, one can note those numbers on paper or use the mobile application to [scan the QR code of the product](http://www.ikea.com/ms/en_KR/customer-service/apps/mobile_app_14.html) for reference. In the checkout area, you can find the item at the said aisle/location number. Finding and picking up the item from the aisle is easy and joyful.

Code management is an important aspect in Software development, as code bases can get quite large. Setting up a [version control](https://github.com/) to manage code bases have become a norm and is a good practice to follow even on your side projects. Few other things to follow include

- Maintain a project structure, naming conventions and code conventions.
- Code Navigability and discoverability are important for fast and smooth development. Good and descriptive class names allow us to navigate easily based on the application functionality.
- [Organizing Namespace](https://msdn.microsoft.com/en-us/library/893ke618(v=vs.71).aspx)
- Remove unused code and not comment it out. Let the version control system take care of file history.

## Manual

The assembly instructions that comes with each package is clear and expressive. It's mostly [conveyed through pictures](http://www.ikea.com/au/en/assembly_instructions/malm-desk__AA-516949-7_pub.pdf) and easy to follow through. The manual is up to date with the packaged product and matched exactly with the contents.

This shows the importance of having a [README](https://en.wikipedia.org/wiki/README) file or software manuals or in context help for users to use the application. Feedback messages and keeping the user always connected with the system is also important. Long wait times, unresponsive progress bars, silent suppression of error messages are not acceptable. Error messages are for the application user and the level and kind of details differs based on who the user is:

- For business/non-technical users, mostly of Front-end applications, Business error messages makes more value than technical errors
- For developers consuming an API, detailed technical error messages add value than just returning a '500 - Internal Server Error'

Error messages must be relevant and up to date with the current functionality. Always review messages for appropriateness.

Code comments used for communicating intent mostly gets out of sync with what the code actually does. So it's a better practice to avoid comments in code and break code into descriptive function and classes to convey the intent.

> *[A comment is an apology](http://butunclebob.com/ArticleS.TimOttinger.ApologizeIncode) for not choosing a more clear name or a more reasonable set of parameters, or for the failure to use explanatory variables and explanatory functions.*

## Tools
![IKEA Tools](__GHOST_URL__/content/images/ikea_tools.jpg)
The [FIXA 17-piece tool kit](http://www.ikea.com/us/en/catalog/products/00169254/), is all that you need for fitting all the furniture. Some products have an [Allen Key](https://en.wikipedia.org/wiki/Hex_key) packaged along with them, but otherwise, most of the time the FIXA toolkit is all that one needs.

Having the [right set of tools](__GHOST_URL__/blog/tools-that-I-use/) for assisting in the development and being familiar with it is important. It's not just about having the best/costliest tools, but about knowing them well. Taking some time out to understand the tools that you use daily is important. By tools, I include keyboard, mouse, programming languages, IDE's and other support software that you use daily.

> *[We are Typists First, Programmers Second](http://blog.codinghorror.com/we-are-typists-first-programmers-second/): The keyboard is one of the most important tools for a developer - learn it well*

## Componentization

The furniture comes as separate pieces that can be easily assembled, with all the screw holes of perfect size. All the different pieces fit perfectly and right even when done by an amateur. Though some of the pieces required two people to fix, I could fix them up myself. It was all cut to perfection with all the holes right in place and fits perfectly the first time.

Having well-defined interfaces that interact with each other seamlessly is important in software development. Any application should be composed of smaller parts that can fit together well. Adhering to good design principles and design patterns helps us to achieve this.

> *One of the most important principles while using Object Oriented languages is **[SOLID](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)**:*
> *Single Responsibility, Open-Closed, Liskov Substitution, Interface segregation and Dependency Injection*

![IKEA Components](__GHOST_URL__/content/images/ikea_components.jpg)
Interfaces should be well-defined and not [leak abstractions](https://en.wikipedia.org/wiki/Leaky_abstraction). The name and parameters(input/return) should completely abstract the 'how' part of the functionality and expose only the 'what'. This helps to build more robust interfaces.

## Packaging and Shipping

[IKEA's efficiency in packaging](http://www.wsj.com/articles/ikea-cant-stop-obsessing-about-its-packaging-1434533401) is one of the reasons that enables them to sell at a low-cost and they keep improving at it. Compact and small packages make it easy to handle right from 'self-checkout' to unpacking it at your home. It also helps in optimizing transportation costs for IKEA which in turn enables them to reduce prices.
![IKEA Packaging](__GHOST_URL__/content/images/ikea_packed.jpg)*King size bed frame with storage, extendable dining table and four chairs!*
Deployment in software development is a key part and having the entire pipeline automated is essential for a smooth delivery. [Setting up a build server, automated building, running tests](__GHOST_URL__/blog/automated-clickonce-deployment-of-a-wpf-application-using-appveyor/) etc are some of the starting points to move towards [Continuous Delivery](http://martinfowler.com/bliki/ContinuousDelivery.html). Deployment needs to be scripted and be possible to deploy to any environment at the click of a button. If it is a distributable software then easily accessible delivery mechanisms should be available and preferably offer multiple options (like distributable media, server hosted images etc like Windows)

> *The package has just the right number of screws, nails and other assembly accessories - not one less, not one more!*

![IKEA Components](__GHOST_URL__/content/images/ikea_assembly_accessories.jpg)
This shows IKEA's confidence in the shipped product and the self-belief of nothing going wrong. For a software product to be shipped with this level of confidence it should be thoroughly tested - preferably automated, which allows verifying each time we make a release and allows us to release more often.

## Cost Effective

Having always bought pre-assembled furniture I have never had to think about anything - it was always just about the money. But with IKEA being self-assembled, you get the flexibility to choose the components/features that you need for the furniture like you could choose to have a [headboard for the bed](http://www.ikea.com/au/en/catalog/products/20228714/) or not, which obviously implies a reduced price. You could choose to self-checkout and pay nothing, but also do a paid checkout, where an IKEA member would get all the items out for you to the billing counter. You could transport it yourself to your home or [get it delivered](http://www.ikea.com/ms/en_AU/customer_service/ikea_services/home_delivery.html). So it's all about giving you the options to choose what you want and really keep the cost low.

Keeping the cost low is an important aspect in software industry too and at various levels

- Development and Licensing costs - Try to keep these costs low, by looking for open source alternatives and choosing your technology wisely and not just looking for the 'cool and latest'.
- Deployment/Infrastructure costs - Build applications for scale and as independent services so that they can be turned on and off as required. [The cloud](https://azure.microsoft.com/en-us/) has greatly reduced the infrastructure setup costs and provides an easy way for setup. Make sure you understand well the pricing models offered by various cloud providers.
- Software Costs/Subscription Costs: Give flexibility to your consumers in how they can consume your software. Keeping functionality loosely coupled and pluggable allows to offer various subscription plans or selling model.

## Value Added Services

It's not just in the home furnishings and their core business that IKEA has taken great care for. The other [Value Added Services](http://www.ikea.com/ms/en_SG/service-offer/) they offer like Delivery, Assembly, Planning Tools, Gift Cards, Children's Services and Return Policy are top-notch.

> *Users are happy when the expected works, and wowed when it goes beyond expectations.*

The [food at IKEA](http://www.ikea.com/au/en/catalog/categories/departments/food/) is worth mentioning (and a picture) - low-priced and tasty! It caters for the needs of all kinds of people and age. The value for money attracts people to IKEA just for the food.
![IKEA Components](__GHOST_URL__/content/images/ikea_food.jpg)
Any product should deliver what it's supposed to anyways, but it's in providing a bit extra that really matters. Like the few examples below,that gave a better experience to me

- When you hit Ctrl + V with an image in clipboard on Facebook it automatically uploads the image
- When Amazon sent a replacement for my broken Kindle (all the way from the US to India) for free
- When Google Now showed the [parking location](https://support.google.com/websearch/answer/6015842?hl=en).
- The IKEA Experience!

Strive to look for cases where you can delight your customers every time you deliver a product. The IKEA has made me think about delivering products and the need for constantly improving at it. We often need to take a stop, look at what we are doing and correct things and move forward.

> *The only way to make the deadline—the only way to go fast—is to keep the [code as clean](http://www.amazon.com/gp/product/0132350882/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=0132350882&amp;linkCode=as2&amp;tag=rahulpnath-20&amp;linkId=CVCVZFAR5SBYVMJW) as possible at all times.*

Head off to an IKEA store if there is one [near you](http://www.ikea.com/) and get wowed!
