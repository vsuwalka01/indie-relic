export interface StateCraft {
  state: string; // must match a name in CRAFT_MAP_STATE_NAMES
  craft: string;
  region: string;
  age: string;
  tagline: string;
  description: string;
  /** id of a matching product in src/lib/products.ts, if we sell this craft */
  productId?: number;
}

export const STATE_CRAFTS: StateCraft[] = [
  {
    state: 'Rajasthan',
    craft: 'Kavad',
    region: 'Chittorgarh',
    age: 'Alive from 400 yrs',
    tagline: 'Portable shrines that unfold into story',
    description:
      "Kavad is a storytelling tradition from Chittorgarh in which bard-priests called Kavadiya Bhat carry painted wooden shrine-boxes door to door, narrating myths panel by panel as the box folds open. Each Kavad is hand-painted with natural pigments in the distinctive Rajasthani style, and every panel unlocks the next chapter of the story.",
    productId: 1,
  },
  {
    state: 'Madhya Pradesh',
    craft: 'Gond Art',
    region: 'Dindori',
    age: 'Alive from 1400 yrs',
    tagline: 'Dots and lines that hold a forest’s memory',
    description:
      'Gond art comes from the Gond adivasi community of central India, who believe that a good image brings good luck. Made of rhythmic dots, dashes and fine lines built up into animals, trees and deities, the form was carried from ritual wall art into paper and canvas in the 1980s by the artist Jangarh Singh Shyam, and is now practised by entire villages around Dindori and Patangarh.',
  },
  {
    state: 'Maharashtra',
    craft: 'Warli Painting',
    region: 'Palghar',
    age: 'Alive from 2500 yrs',
    tagline: 'A whole village drawn in a single line',
    description:
      'Warli painting is made by the Warli tribe of the hills around Palghar and Thane, using rice-paste white on mud-red walls to build entire village scenes from just a circle, a triangle and a square. Weddings, harvests and the central "tarpa" dance are drawn in one continuous, unbroken line, a form the Warli believe mirrors the cycle of life itself.',
  },
  {
    state: 'Jammu and Kashmir',
    craft: 'Pashmina Weaving',
    region: 'Srinagar',
    age: 'Alive from 600 yrs',
    tagline: 'Warmth combed from the world’s highest goats',
    description:
      'Pashmina is spun from the winter undercoat of the Changthangi goat, reared above 14,000 feet on the Ladakh plateau, then hand-spun and woven in the workshops of Srinagar. The craft was formalised in the 15th century under Sultan Zain-ul-Abidin, who brought weavers from Central Asia to found what is still one of the finest handwoven textiles in the world.',
  },
  {
    state: 'Uttar Pradesh',
    craft: 'Chikankari',
    region: 'Lucknow',
    age: 'Alive from 400 yrs',
    tagline: 'Shadow-work embroidery fit for a Mughal court',
    description:
      "Chikankari is a delicate white-thread embroidery on fine cotton and muslin, said to have been introduced to Lucknow's court by Empress Noor Jahan. Artisans use over three dozen stitches to create shadow-work patterns that read as almost invisible from the front and richly textured from behind — a technique still practised entirely by hand in Lucknow's old city.",
  },
  {
    state: 'Gujarat',
    craft: 'Bandhani',
    region: 'Kutch',
    age: 'Alive from 1000 yrs',
    tagline: 'A thousand tiny knots, dyed by hand',
    description:
      'Bandhani is a tie-and-dye craft practised by the Khatri community of Kutch and Jamnagar, in which thousands of tiny grains of fabric are individually pinched, tied with thread and dip-dyed to leave a resist pattern behind. A single Bandhani odhani can carry tens of thousands of these hand-tied knots, arranged into dots that form larger motifs.',
  },
  {
    state: 'Karnataka',
    craft: 'Bidriware',
    region: 'Bidar',
    age: 'Alive from 600 yrs',
    tagline: 'Silver inlay on midnight-black metal',
    description:
      'Bidriware is a metal handicraft from Bidar dating to the Bahmani Sultanate, known for its striking black-and-silver inlay on a zinc-copper alloy. Artisans engrave a pattern into the blackened metal, hammer in pure silver wire by hand, then oxidise the surface with local soil so only the inlay gleams.',
    productId: 3,
  },
  {
    state: 'Andhra Pradesh',
    craft: 'Kalamkari',
    region: 'Srikalahasti',
    age: 'Alive from 3000 yrs',
    tagline: 'A bamboo pen, and dyes pulled from the earth',
    description:
      'Kalamkari — literally "pen-work" — is a hand-painted and block-printed textile art using a tamarind-twig pen and natural dyes drawn from indigo, madder root and pomegranate rind. The Srikalahasti style, practised near a temple town of the same name, specialises in freehand mythological scenes painted directly onto cotton in a technique little changed in three thousand years.',
  },
  {
    state: 'Odisha',
    craft: 'Pattachitra',
    region: 'Raghurajpur',
    age: 'Alive from 800 yrs',
    tagline: 'Cloth scrolls painted for a wandering god',
    description:
      'Pattachitra is a cloth-based scroll painting tradition centred on the artisan village of Raghurajpur, prepared by coating cotton with a tamarind-seed paste and chalk before painting it with natural pigments and a final lacquer coat. Its subject is almost always the Jagannath temple tradition of nearby Puri, telling and retelling the same sacred stories in a style unchanged for generations.',
    productId: 5,
  },
  {
    state: 'Chhattisgarh',
    craft: 'Dhokra',
    region: 'Bastar',
    age: 'Alive from 4000 yrs',
    tagline: 'Bronze cast the way the Indus Valley cast it',
    description:
      "Dhokra is a lost-wax metal casting technique practised by tribal artisans across Bastar, one of the oldest continuously used metal casting methods in the world. A clay core is wrapped in wax thread, coated in more clay, then fired so the wax melts away and molten brass is poured into the cavity it leaves — meaning every Dhokra piece is one of a kind, and the mould is destroyed to reveal it.",
    productId: 6,
  },
  {
    state: 'Tamil Nadu',
    craft: 'Tanjore Painting',
    region: 'Thanjavur',
    age: 'Alive from 400 yrs',
    tagline: 'Gold leaf raised in relief over gesso',
    description:
      'Tanjore painting emerged under the Nayaka and Maratha courts of Thanjavur, built up in layers: a wooden panel, a cloth ground, a gesso paste moulded into raised relief, and finally gold leaf and semi-precious stones set over rich, jewel-toned pigment. Its subjects are almost always deities, rendered with the same glowing, three-dimensional gold surface for four centuries.',
  },
  {
    state: 'Bihar',
    craft: 'Madhubani',
    region: 'Mithila',
    age: 'Alive from 2500 yrs',
    tagline: 'Wall art that became a movement',
    description:
      "Madhubani painting comes from the Mithila region of Bihar, where women traditionally painted the walls and floors of their homes for festivals and weddings using twigs, matchsticks and fingers dipped in natural dye. Its double-outlined figures, dense floral fill, and geometric borders moved onto paper in the 1960s and carried the tradition worldwide.",
    productId: 2,
  },
  {
    state: 'Telangana',
    craft: 'Cheriyal Scroll Painting',
    region: 'Cheriyal',
    age: 'Alive from 400 yrs',
    tagline: 'A scroll unrolled one story at a time',
    description:
      'Cheriyal scrolls are long panels of khadi cloth, coated in a rice-starch and tamarind-seed paste, then painted in bold primary colours with stories from the Puranas and local epic ballads. Traditionally unrolled scene by scene by travelling Nakashi storytellers, each scroll could run to dozens of feet, telling a single epic across a whole evening.',
  },
  {
    state: 'Arunachal Pradesh',
    craft: 'Thangka Painting',
    region: 'Tawang',
    age: 'Alive from 700 yrs',
    tagline: 'Buddhist scroll paintings from the high Himalaya',
    description:
      "Thangka painting is a Tibetan Buddhist scroll art preserved in the monasteries around Tawang, painted on cotton with mineral pigments to a strict grid of proportions laid down in scripture. Every deity, colour and gesture follows a fixed iconography passed from teacher to student inside the monastery, meant as a meditation aid as much as an artwork.",
  },
  {
    state: 'Assam',
    craft: 'Muga Silk Weaving',
    region: 'Sualkuchi',
    age: 'Alive from 2000 yrs',
    tagline: 'The only silk that turns golden with age',
    description:
      'Muga is a wild silk unique to Assam, reeled from silkworms that feed on soalu and som leaves along the Brahmaputra valley, and prized for a natural golden-yellow sheen that grows richer with every wash. The weaving town of Sualkuchi has spun and woven Muga on pit-looms for generations, producing a fibre so durable that heirloom mekhela sadors are passed down for decades.',
  },
  {
    state: 'West Bengal',
    craft: 'Kantha Embroidery',
    region: 'Shantiniketan',
    age: 'Alive from 500 yrs',
    tagline: 'Old saris, stitched into something new',
    description:
      'Kantha began as a way to give old, worn cotton saris a second life — layering them together and binding them with rows of simple running stitch into quilts and wraps. What started as thrift became an art form: the stitching itself puckers the cloth into a rippled texture, and the motifs stitched across it record folk tales, festivals and everyday village life.',
  },
  {
    state: 'Jharkhand',
    craft: 'Sohrai Painting',
    region: 'Hazaribagh',
    age: 'A living harvest-festival tradition',
    tagline: 'Mud walls painted with a chewed twig',
    description:
      "Sohrai is a mural art painted by the women of Hazaribagh's villages at harvest time, using twigs, cloth swabs and even fingers dipped in natural earth pigments — ochre, black manganese, white kaolin — directly onto mud walls prepared with a layer of fresh clay. The finger-combed textures and animal motifs are renewed every year, making the whole village a canvas that repaints itself each season.",
  },
  {
    state: 'Uttarakhand',
    craft: 'Aipan',
    region: 'Kumaon',
    age: 'A living ritual tradition',
    tagline: 'Rice-paste geometry drawn for the gods',
    description:
      "Aipan is a ritual floor and threshold art of the Kumaon hills, drawn freehand with a rice-paste paste on a base of red ochre ahead of festivals, weddings and pujas. The geometric diagrams — often built from a grid of dots joined into an unbroken pattern — are believed to invite auspiciousness into the home, and are redrawn by hand before every occasion.",
  },
  {
    state: 'Himachal Pradesh',
    craft: 'Chamba Rumal',
    region: 'Chamba',
    age: 'Alive from 400 yrs',
    tagline: 'Embroidery with no visible back',
    description:
      'Chamba Rumal is a double-satin stitch embroidery so precise that the front and back of the cloth are identical, developed in the hill court of Chamba under Pahari painting influence. Court women embroidered scenes from the Bhagavata Purana and Krishna’s life onto handspun khaddar, using unbleached thread so fine that the stitches read as painted lines rather than embroidery.',
  },
  {
    state: 'Punjab',
    craft: 'Phulkari',
    region: 'Patiala',
    age: 'Alive from 500 yrs',
    tagline: 'Flower-work embroidered from the reverse side',
    description:
      'Phulkari, meaning "flower work", is a floral embroidery tradition worked entirely from the reverse of the cloth in a long darn stitch, so the pattern only reveals itself on the front. Historically embroidered by mothers and grandmothers for a bride’s trousseau, the geometric floral fields of a Phulkari odhani were meant to take months, sometimes years, to complete.',
    productId: 8,
  },
  {
    state: 'Haryana',
    craft: 'Panipat Handloom Weaving',
    region: 'Panipat',
    age: 'Alive from 500 yrs',
    tagline: 'The looms that clothed the Mughal court',
    description:
      'Panipat has been a handloom weaving town since the Mughal era, when its weavers supplied cloth, durries and carpets to the imperial court. That same pit-loom weaving tradition continues today, producing hand-woven cotton durries and blankets on techniques passed down through generations of the same weaving families.',
  },
  {
    state: 'Kerala',
    craft: 'Aranmula Kannadi',
    region: 'Aranmula',
    age: 'Alive from 500 yrs',
    tagline: 'A mirror with no glass at all',
    description:
      'Aranmula Kannadi is a metal-alloy mirror, hand-cast and polished to a reflective finish without any glass or silvering — the reflection comes from the metal surface itself, polished by hand over days. The exact alloy and polishing technique are a closely guarded secret held by a handful of families in the single village of Aranmula, where it has been made for centuries.',
  },
  {
    state: 'Tripura',
    craft: 'Bamboo & Cane Craft',
    region: 'Agartala',
    age: 'A living tribal tradition',
    tagline: 'A forest’s grasses, woven into everyday life',
    description:
      'Bamboo and cane craft runs through daily life in Tripura, where artisans split, weave and shape local bamboo into everything from trays and furniture to the state’s distinctive Risa handloom borders. The craft is taught within families and villages, turning a fast-growing local material into finely worked baskets, screens and structural furniture.',
  },
  {
    state: 'Meghalaya',
    craft: 'Bamboo Pokerwork',
    region: 'Garo Hills',
    age: 'A living tribal tradition',
    tagline: 'Patterns burned into bamboo with a hot iron',
    description:
      'Pokerwork is a Garo Hills technique in which artisans burn intricate patterns directly into the surface of bamboo and cane using a red-hot pointed iron, working freehand across baskets, mats and containers. The scorched lines darken permanently into the fibre, giving each piece a warm, smoke-toned pattern that no dye can replicate.',
  },
  {
    state: 'Nagaland',
    craft: 'Naga Shawl Weaving',
    region: 'Kohima',
    age: 'A living tribal tradition',
    tagline: 'A weave that names your tribe',
    description:
      'Naga shawls are woven on backstrap looms in bands of bold colour and motif that are specific to each of Nagaland’s tribes — a warrior’s shawl, a chief’s shawl and a woman’s wrap are all instantly readable to those who know the patterns. Cowrie shells, dyed goat hair and geometric bands are worked directly into the weave rather than added afterward.',
  },
  {
    state: 'Manipur',
    craft: 'Longpi Black Pottery',
    region: 'Ukhrul',
    age: 'Alive from 2000 yrs',
    tagline: 'Pottery made without a wheel',
    description:
      "Longpi pottery is made by the Tangkhul Naga people from a serpentine black stone mixed with local clay — no potter's wheel is used at all; every piece is hand-built and shaped with a wooden paddle. Fired without glaze, the stoneware develops a natural black sheen and is prized for going straight from an open flame to the table.",
  },
  {
    state: 'Mizoram',
    craft: 'Puanchei Weaving',
    region: 'Aizawl',
    age: 'A living tribal tradition',
    tagline: 'The shawl every Mizo bride still wears',
    description:
      'Puanchei is the ceremonial handwoven shawl of the Mizo people, woven on a loin loom in bands of red, black, yellow and green that are reserved for weddings and festival dances. Every Mizo textile still carries strict rules about which patterns may be worn by whom, keeping the loin-loom weaving tradition tied directly to community life.',
  },
  {
    state: 'Sikkim',
    craft: 'Thangka Painting',
    region: 'Rumtek',
    age: 'Alive from 700 yrs',
    tagline: 'Monastery scroll art of the eastern Himalaya',
    description:
      "Sikkim's monasteries, among them Rumtek, have preserved Tibetan Buddhist thangka painting alongside carpet weaving and wood carving for centuries. Painted on cotton in mineral pigment to a fixed grid of sacred proportion, a thangka is as much a devotional object and meditation aid as it is a painting.",
  },
  {
    state: 'Goa',
    craft: 'Azulejo Tile Painting',
    region: 'Panaji',
    age: 'Alive from 300 yrs',
    tagline: 'Portuguese tilework on an Indian street',
    description:
      "Azulejo tile painting arrived in Goa with Portuguese colonial builders and took root as hand-painted ceramic house-number and saint tiles still found on Panaji's old-town facades. Cobalt-blue motifs are painted onto glazed tiles and fired, a craft that fused Iberian technique with Goan subjects and colours over three centuries.",
  },
  {
    state: 'Delhi',
    craft: 'Zardozi Embroidery',
    region: 'Chandni Chowk',
    age: 'Alive from 400 yrs',
    tagline: 'Embroidery in gold and silver wire',
    description:
      "Zardozi is a metal-thread embroidery that came to Delhi's Mughal court in gold and silver wire, worked with small hooks into velvet and silk to build raised, dimensional motifs studded with beads and stones. The workshops around Chandni Chowk still hand-embroider zardozi for bridal and ceremonial wear using techniques barely changed since the Mughal ateliers.",
  },
  {
    state: 'Puducherry',
    craft: 'Terracotta Pottery',
    region: 'Villianur',
    age: 'A living village tradition',
    tagline: 'Clay shaped by hand near a French-built coast',
    description:
      'Terracotta pottery has been shaped and fired in the villages around Villianur for generations, hand-thrown or hand-built from local clay and fired in open kilns without a glaze. Alongside its French colonial architecture, Puducherry’s potters keep a much older Tamil craft tradition alive, turning local clay into everyday cookware and ritual lamps.',
  },
];

export function getStateCraft(state: string) {
  return STATE_CRAFTS.find((s) => s.state === state);
}

export function slugifyState(state: string) {
  return state.toLowerCase().replace(/\s+/g, '-');
}

export function unslugifyState(slug: string) {
  const found = STATE_CRAFTS.find((s) => slugifyState(s.state) === slug);
  return found?.state;
}
