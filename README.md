# Assessment Target
To develop checkout page that have a dynamic promo code application logic

---
# Things to take note and understand before setting up workspace
1. Please make sure that you have / install the neccesary tools
    * node [Click here to download the LTS version](https://nodejs.org/en/download/)
    * angular [Click here for guide to install angular](https://angular.io/guide/setup-local)
2. Go to the root folder
3. npm install <- To install all dependencies of the project
4. ng serve --open <- To open the app on browser

---
# Guide for testing the promo code logic
1. Please play around with the test data under src/assets/json
2. The product-list.json is self explanatory
3. The promo-list.json is a bit tricky, to make it more dynamic, some properties can be used to alter the logic

## Promo Code Model
1. promoType = There's 2 logic *price-reduction*(Immediate price reduction) and *percentage-cut* (Percentage cut from the original price)
2. percentageDiscount = The amount used for *percentage-cut*
3. priceReduction = The amount used for *price-reduction*
4. minUnit = Minimum order to trigger the promo
5. maxUnit = Maximum order to trigger the promo
6. requiredUnit = Required unit to trigger the promo. Value is *(productId)|(minUnit)* | for separator and minUnit is to count the minimum required unit
7. minPrice = Minimum price to trigger the promo (Based on total price)
8. maxPrice = Maximum price to trigger the promo (Based on total price)
9. applicableProduct = The target of the price to reduce or cut