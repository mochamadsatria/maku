# MAKU (Makanan Ku)

## Background
There are over **192 million people** that do not have enough food to eat everyday according to what PBB reported. Especially with Covid-19 and war going on, it has been getting worse. It is reported that the number has **increased by 40 million people in the last year**. Hunger is a major issue in **53 countries** currently. Countries including Afghanistan,Republic Kongo, Ethiopia, Nigeria, South Sudan, Suriah and Yaman. Due to the prolonged drought, consistent violence and rising food prices, it is leading more than **6 million people** in Somalia in risk of hunger.

Indonesia itself disposes **36 million tons of food waste** per year in the period of 2000-2019. So how can we reduce that? **MAKU**, aims to reduce food waste in Indonesia and help lower income family backgrounds.

## What it does
**MAKU** for commercial aims to help those restaurants who have excess food _that is still good enough and doesn't exceed the expiration date_ to sell it on our platform at a reasonable price rather than being thrown away. While it is not fresh enough Maku will help the restaurant to recook the food to result in other dishes that are still fresh enough to sell _(ex: rice -> fried rice)_.

**MAKU** for individuals (not commercial) aims to help those, who have excess food _that is still good enough_ and wanna donate it (or even some people that just wanna share food), by advertising their food on our platform. That means Maku will help unite those people who wanna donate their food with some people that need it.

## How we built it

### Stack Overview
We built this app with [Remix.run](https://remix.run/). We choose this because currently, Remix is faster than [Next.js](https://nextjs.org/). That one consideration comes along with many other considerations like SSR and Static support, is this project needs SSG?, and many others. As for the backend, we use serverless service: [Firebase](https://firebase.google.com/) as the main frame because we think we do not have to reinvent the wheel for this small project. And for the map service, we use [Mapbox](https://www.mapbox.com/) API

### Design
Maku app is designed to be a PWA ***(Progressive Web Apps)*** to take advantage of mobile and web development at the same time.

### Development Process
**First**, we split the development process into 4 small stages, **in the first stage** we define data structure and create the basic feature the app needs like Find a Restaurant, Find a Donation, Create Donation, and Finding Nearby Donation. Currently, this is **the hardest stage** because we implement new things that don't have much community support and documentation, especially dealing with geolocation. The source we thanks the most will be [This Article](http://www.movable-type.co.uk/scripts/latlong.html). 

**Then we create additional** features such as Login, Register, History, etc. **In the third stage**, we focus on styling and improving our app visuals and some campaign about our goals. **In the last stage** we integrated services and fixed many bugs that were known on the manual A/B tests. 

## Challenges we ran into
- The app do not have clear error message ***(fixed)***
- Wrong name convention in the data structure ***(fixed)***
- There is no redirect withing auth stage, so it's not clear for user when the state is change ***(fixed)***
- The cart cannot working properly ***(fixed)***

After dealing with many bugs, finally the app working properly. But because some consideration, some of the features currently disabled and cannot be interact with.

## Accomplishments that we're proud of
Being able to complete this project in 48 hours is our greatest accomplishments.

## What we learned
We put our utmost into this project, and this is it. This is what we can make in a very short time. We hope this can be a starting point for us to grow further. Thank you for the experiences, we are looking forward for the next hackathon.

## What's next for MAKU (Makanan Ku)
Maku will focus to expand and increase our partnership with all restaurants in Indonesia. We hope that many people will know Maku and **work together to reduce hunger and food waste in Indonesia**.
