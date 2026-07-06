# Recipe image prompts

The 19 recipes added from *From the Sinov8 Kitchen* currently use placeholder
`.svg` images (emoji on a coloured gradient). The 18 original recipes already
have real `.jpg` photos.

To replace a placeholder with a real (AI-generated or photographed) image:

1. Generate/take the image using the prompt below (any generator works —
   ChatGPT/DALL·E, Midjourney, Gemini, Firefly, etc.).
2. Save it as a **`.jpg`** in `assets/images/` using the **filename** listed.
3. In the recipe's `.md` file, change the `image:` line extension from
   `.svg` to `.jpg` (e.g. `image: /assets/images/bobotie.jpg`).

**Consistency tip:** append the same style suffix to every prompt so the set
looks cohesive with the existing photos. Suggested suffix:

> *"— overhead food photography, natural soft light, rustic wooden or stone
> surface, shallow depth of field, warm appetising tones, no text or people."*

Target size ~1200×900 (4:3), which matches the card aspect ratio.

| Filename | Prompt (add the style suffix above) |
|----------|-------------------------------------|
| `riganada.jpg` | Greek riganada bruschetta: thick toasted sourdough topped with grated ripe tomato, crumbled feta, dried oregano and a drizzle of olive oil, on a meze platter |
| `quinoa-salad.jpg` | Mediterranean quinoa salad in a large bowl — fluffy quinoa with chopped red and yellow peppers, cucumber, kalamata olives and crumbled feta, lemon wedge on the side |
| `chicken-pesto-pasta.jpg` | Creamy chicken pesto penne with sun-dried tomatoes and shaved parmesan, torn basil on top, in a shallow bowl |
| `seafood-pasta.jpg` | Creamy garlic seafood linguine with prawns, mussels and calamari in a white wine cream sauce, chopped parsley, in a wide pasta bowl |
| `french-onion-orzo.jpg` | Creamy French onion orzo — risotto-like orzo with deeply caramelised onions and melted Gruyère, fresh thyme, in a cast-iron pan |
| `buldak-noodles.jpg` | Spicy Korean Buldak noodles with glossy red sauce, chicken strips and vegetables, sesame seeds and spring onion, in a black bowl |
| `ribeye.jpg` | Flame-grilled ribeye steak resting on a wooden board over chopped garlic, rosemary and thyme, a knob of melting butter on top, medium-rare |
| `trinchado.jpg` | Portuguese-style trinchado — rich paprika-and-red-wine beef stew with a creamy sauce in a black pot, fresh bread on the side |
| `butter-chicken.jpg` | Indian butter chicken in a creamy orange tomato sauce, garnished with cream swirl and coriander, served with basmati rice and naan |
| `bobotie.jpg` | South African bobotie — baked spiced lamb mince with a golden egg custard top and bay leaves, served with yellow rice and raisins |
| `curry-mince.jpg` | South African curry mince (kerrie maalvleis) with peas and carrots, served with vetkoek, in a rustic bowl |
| `beef-mince-bake.jpg` | South African beef mince bake — layered potato, mince in tomato gravy, white sauce and a golden savoury crust, slice lifted from a baking dish |
| `herby-baby-potatoes.jpg` | Roasted herby baby potatoes, crispy and golden with rosemary and garlic, in an oven dish |
| `honey-cake.jpg` | Russian Medovik honey cake — a tall slice showing many thin layers with sour cream frosting, dusted with cake crumbs, on a plate |
| `triple-chocolate-cake.jpg` | Two-layer chocolate cake with glossy chocolate buttercream and chocolate chips, one slice cut to show the moist crumb |
| `red-velvet.jpg` | Red velvet cake (fluweelkoek) with cream cheese frosting between deep red layers and a chocolate ganache drip on top, one slice on a plate |
| `lemon-meringue.jpg` | South African lemon meringue tart with a Marie biscuit crust, tangy lemon filling and toasted pillowy meringue peaks, one slice removed |
| `custard-slices.jpg` | South African custard slices (vlaskywe) — thick creamy custard between cream cracker biscuits topped with white icing, cut into squares |
| `pasteis-de-nata.jpg` | Portuguese pastéis de nata — custard tarts with caramelised blistered tops and crisp flaky pastry, dusted with cinnamon, on a plate |

Once real photos exist for all 19, the `.svg` placeholders in `assets/images/`
can be deleted.
