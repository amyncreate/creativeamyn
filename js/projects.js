/*
  EDIT ME: the text shown in the popup when a visitor opens a project.
  Each key matches a data-project="..." card in index.html.
  - Replace the cover images in assets/work/ with real screenshots (same file names, 1600x1100 works best).
  - Projects marked "Concept" are self-initiated illustrations. Swap them for real client work as you get it,
    and remove the <span class="work-badge">Concept</span> from that card in index.html.
*/
window.PROJECTS = {
  /* ---------- Graphic design ---------- */
"icing-bakery": {
    title: "Icing Bakery",
    meta: "Graphic design, Food Advertising",
    image: "assets/work/Icingbakery.webp",
    summary: "Make your bakery impossible to ignore with a design that brings your products to life. I created this Icing Bakery flyer to showcase its delicious treats, highlight its services, and encourage customers to place their orders. Need a mouthwatering flyer for your bakery or food business? Send me a DM, and let's create something special for your brand.",
    did: [
      "I combined warm bakery-inspired colors with delicious food imagery to create an inviting design",
      "I highlighted the bakery's services and WhatsApp contact details to make ordering easier for customers",
      "I used bold typography, a baker portrait, and a clear BOOK NOW call to action to capture attention and encourage orders"
    ],
    stack: "Promotional flyer for bakeries, food vendors, and social media marketing."
},
  "logo-collection": {
    title: "Logo collection",
    meta: "Graphic design, Businesses Logo",
    image: "assets/work/logo-collection.webp",
    summary: "Six simple marks for six different types of business, showing how a logo can stay clear and memorable at small sizes.",
    did: [
      "Explored geometric marks for different industries",
      "Kept every mark readable and usable as an app icon",
      "Tested each one in light and dark colors"
    ],
    stack: "Vector logo design."
  },
  "social-set": {
    title: "ShopTab Application",
    meta: "Graphic design, App Launch",
    image: "assets/work/shoptab.webp",
    summary: "A set of social posts for an application, designed so the feed looks completely one business instead of random one-off graphics.",
    did: [
      "Designed a repeatable post layout",
      "Used bold typography and short headlines that read fast on a phone",
      "Made the set easy to update for new offers"
    ],
    stack: "Square post templates for Instagram and Facebook posts."
  },
"maris-foods": {
    title: "Mari's Restaurant",
    meta: "Graphic design, Restaurant Opening",
    image: "assets/work/marisfoods.webp",
    summary: "A vibrant promotional design for Mari's Foods, combining appetizing food photography, elegant script typography, and warm colors to introduce the food business and showcase its menu.",
    did: [
      "Combined restaurant branding with a prominent opening announcement",
      "Used appetizing food imagery and circular menu compositions to showcase different dishes",
      "Created a warm orange, brown, and white color palette to establish a welcoming food brand"
    ],
    stack: "Restaurant opening announcement and menu promotion for print display."
  },
  /* ---------- Web design ---------- */
  grounds: {
    title: "Cravins Ice Cream",
    meta: "Website design, restaurant and dessert business",
    image: "assets/work/cravis-prev.webp",
    video: "assets/video/cravings.mp4",
  summary: "Every great dessert deserves an equally great online experience. I designed this website for Cravins Ice Cream to give the brand a premium digital presence, showcase its flavours, and make it easier for customers to discover the business and place orders. From the elegant presentation to the inviting visuals, every detail is designed to make visitors want to experience Cravins.",
  did: [
    "I created an elegant, editorial-inspired hero section that immediately introduces the brand and its premium identity",
    "I combined rich dessert photography, refined typography, and warm cream and chocolate tones to create an appetizing visual experience",
    "I incorporated clear navigation, prominent ordering and visit-us buttons, and customer trust indicators to guide visitors towards taking action"
  ],
  stack: "Responsive business website design for an ice cream brand"

  },
  craftline: {
    title: "Chill Express",
    meta: "Website design, restaurant & food business",
    image: "assets/work/chill-prev.webp",
    // video: "assets/video/chill express.mp4",
  summary: "I designed this website for Chill Express to showcase its shawarma and burgers, strengthen its online presence, and make ordering more convenient for customers in Maiduguri. The bold visuals, clear messaging, and direct WhatsApp ordering experience bring the brand closer to its customers. Want a website that gives your food business this kind of presence? Let's talk.",
  did: [
    "I created a bold, food-focused hero section with appetizing imagery and attention-grabbing headlines",
    "I designed a dark, modern navigation system with clear access to the menu, cart, location, and contact details",
    "I integrated prominent WhatsApp ordering and call actions to make it easier for visitors to connect with the business"
  ],
  stack: "Responsive restaurant website featuring food presentation, menu navigation, ordering access, and business contact information."
},
  iym: {
  title: "Grounds & Co. Website",
  meta: "Website design, restaurant & hospitality",
  image: "assets/work/Ground-prev.webp",
  summary: "A café is more than a place to grab coffee; it's an experience worth discovering. I designed this website for Grounds & Co. to capture the café's atmosphere, communicate its brand story, and give visitors a reason to experience the space. The elegant presentation, rich photography, and carefully selected typography create a refined online identity that reflects the café's personality.",
  did: [
    "I created an elegant, editorial-style layout that gives the café a distinctive and premium digital presence",
    "I combined rich café photography, sophisticated typography, and forest-green and gold tones to reinforce the brand identity",
    "I incorporated intuitive navigation and a prominent table reservation button to make exploring and connecting with the café easier"
  ],
  stack: "Responsive café website featuring brand storytelling, menu presentation, gallery, customer experience, and table reservation sections."
},
kings: {
  title: "Xclusive Beauty. Beauty & Spa Website",
  meta: "Website design, beauty & wellness",
  image: "assets/work/xclusive.webp",
  video: "assets/video/exclusive.mp4",
  summary: "Your beauty business deserves an online presence as exceptional as the services you offer. I designed this website for Xclusive Beauty to establish a luxurious digital identity, showcase its beauty and spa services, and make booking appointments easier for customers. With an elegant presentation and clear booking options, the website gives the brand a polished presence that inspires confidence.",
  did: [
    "I developed a luxurious visual direction using dark backgrounds, elegant typography, and gold and blush accents",
    "I designed a striking hero section that communicates the brand's positioning while showcasing its beauty and spa experience",
    "I integrated prominent WhatsApp booking actions, service navigation, and business highlights to encourage customer enquiries and appointments"
  ],
  stack: "Responsive beauty and spa business website featuring service presentation, gallery, shop navigation, and WhatsApp appointment booking."
},

  /* ---------- UI/UX design ---------- */
  terravest: {
    title: "ShopTab App UI",
    meta: "UI/UX design, Debt Managment system",
    image: "assets/work/shoptabui.webp",
    summary: "Managing customer debt should be stressfree, I designed ShopTab to help shop owners keep track of outstanding debt and history in one place.",
    did: [
      "I designed a clean, mobile friendly interface that makes essential debt features easy to navigate",
      "It showcase the active debts and debt recording screen to highlight the app core functioning",
      "Used a consistent color pallate and clear typography",
      "I organized card layouts to create a professional product experience"
    ],
    stack: "Mobile app UI, debt tracking"
  },
  passes: {
    title: "Mobile App Design",
    meta: "UI/UX design, digital product design",
    image: "assets/work/graduation-ui.webp",
    summary: "I designed this Digital Graduation Hub to bring graduates, guests, sponsors, and event resources together in one accessible platform. From event activities and photo galleries to sponsor information, support services, and educational resources, every section is designed to make the graduation experience more connected and memorable.",
  did: [
    "I designed a modern mobile interface that brings multiple graduation event services together in one platform",
    "I created dedicated sections for event activities, galleries, sponsors, guest interactions, and graduate resources",
    "I used a deep navy and burgundy color combination with clean layouts and intuitive navigation to deliver a polished user experience"
  ],
    stack: "Sponsor directories, Mobile-first digital event platform, vanilla JavaScript."
  },
  // "wallet-app": {
  //   title: "Wallet app",
  //   meta: "UI/UX design, concept project",
  //   image: "assets/work/wallet-app.webp",
  //   summary: "A self-initiated mobile wallet concept: a balance view, a simple send-money keypad and an activity feed, designed to be easy to use with one thumb.",
  //   did: [
  //     "Mapped the key screens and the flow between them",
  //     "Designed large, clear touch targets",
  //     "Kept every screen focused on one main action"
  //   ],
  //   stack: "Mobile app screens."
  // }
};
