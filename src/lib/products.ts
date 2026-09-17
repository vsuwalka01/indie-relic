export interface Product {
  id: number;
  name: string;
  craft: string;
  price: number;
  image: string;
  gallery: string[];
  intro: string;
  aboutCraft: string;
  ideaBehind: string;
  description: string;
  details: string;
  shipping: string;
}

const IMG = {
  woodenVases: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=900&h=900&fit=crop',
  galleryWall: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&h=900&fit=crop',
  greyVases: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=900&fit=crop',
  woodenToyTrain: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=900&h=900&fit=crop',
  paintedMural: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&h=900&fit=crop',
  ceramicCups: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=900&fit=crop',
  stackedBowls: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&h=900&fit=crop',
  textileRack: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&h=900&fit=crop',
  livingRoom: 'https://images.unsplash.com/photo-1616486788371-62d930495c44?w=900&h=900&fit=crop',
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Chittor Fort Kavad',
    craft: 'KAVAD',
    price: 49850,
    image: IMG.woodenVases,
    gallery: [IMG.woodenVases, IMG.ceramicCups, IMG.livingRoom],
    intro: 'A hand-painted portable shrine box, folding open to reveal panels of story and myth.',
    aboutCraft: 'Kavad is a 400-year-old storytelling tradition from Chittorgarh, Rajasthan, where itinerant bard-priests carry painted wooden shrine-boxes door to door, narrating myths panel by panel as they unfold.',
    ideaBehind: 'We worked with the Suthar family of Bassi village to adapt the traditional Kavad form into a tabletop piece — small enough for a modern home, faithful enough to carry the full narrative sequence.',
    description: 'Hand-painted wooden Kavad shrine box with 7 folding panels depicting the story of Chittor Fort. Each panel is painted using natural pigments in the traditional Rajasthani style.',
    details: 'Material: Mango wood, natural pigments. Dimensions: 30cm x 20cm x 15cm (closed). Weight: 1.2kg. Handcrafted — slight variation between pieces is part of the character.',
    shipping: 'Ships within 5-7 business days. Carefully packed in a custom box with corner protection. Free shipping across India on orders above ₹5,000.',
  },
  {
    id: 2,
    name: 'Madhubani Wall Panel',
    craft: 'MADHUBANI',
    price: 8900,
    image: IMG.galleryWall,
    gallery: [IMG.galleryWall, IMG.paintedMural, IMG.livingRoom],
    intro: 'A framed Madhubani panel, hand-painted with natural dyes by artisans from Bihar.',
    aboutCraft: 'Madhubani painting originates from the Mithila region of Bihar, characterised by intricate line work, geometric patterns, and motifs drawn from nature and mythology.',
    ideaBehind: 'Reimagined as a ready-to-hang wall panel so the art form finds a place in contemporary living rooms, not just ceremonial walls.',
    description: 'Hand-painted Madhubani artwork on handmade paper, mounted on a solid wood frame, ready to hang.',
    details: 'Material: Handmade paper, natural dyes, mango wood frame. Dimensions: 45cm x 60cm.',
    shipping: 'Ships within 4-6 business days, packed flat with rigid board protection.',
  },
  {
    id: 3,
    name: 'Bidriware Vase',
    craft: 'BIDRIWARE',
    price: 15200,
    image: IMG.greyVases,
    gallery: [IMG.greyVases, IMG.ceramicCups],
    intro: 'A blackened metal vase inlaid with silver, from the karigars of Bidar, Karnataka.',
    aboutCraft: 'Bidriware is a metal handicraft from Bidar dating back to the 14th century, known for its striking black-and-silver inlay work on a zinc-copper alloy.',
    ideaBehind: 'A tabletop vase form that lets the inlay patterns take centre stage in a minimal, modern silhouette.',
    description: 'Hand-inlaid Bidriware vase with traditional floral motifs in pure silver on an oxidised black body.',
    details: 'Material: Zinc alloy, silver inlay. Dimensions: 18cm height, 10cm diameter.',
    shipping: 'Ships within 7-10 business days. Fragile — packed with double-layer protection.',
  },
  {
    id: 4,
    name: 'Channapatna Toy Set',
    craft: 'CHANNAPATNA',
    price: 3400,
    image: IMG.woodenToyTrain,
    gallery: [IMG.woodenToyTrain],
    intro: 'A set of lacquered wooden toys, lathe-turned by craftsmen in Channapatna, Karnataka.',
    aboutCraft: 'Channapatna toys are made from ivory wood, turned on a lathe and finished with vegetable-dye lacquer — a GI-tagged craft dating back to Tipu Sultan\'s reign.',
    ideaBehind: 'A stacking toy set designed with a modern colour palette while keeping the traditional lac-turning technique intact.',
    description: 'Set of 5 lacquered wooden stacking toys in natural vegetable dyes, non-toxic and child-safe.',
    details: 'Material: Ivory wood (Wrightia tinctoria), vegetable dye lacquer. Suitable for ages 3+.',
    shipping: 'Ships within 3-5 business days.',
  },
  {
    id: 5,
    name: 'Pattachitra Scroll',
    craft: 'PATTACHITRA',
    price: 6200,
    image: IMG.paintedMural,
    gallery: [IMG.paintedMural, IMG.galleryWall],
    intro: 'A hand-painted cloth scroll from Raghurajpur, Odisha, depicting scenes from the Jagannath tradition.',
    aboutCraft: 'Pattachitra is a cloth-based scroll painting tradition from Odisha, prepared with a tamarind-paste-coated canvas and painted using natural pigments.',
    ideaBehind: 'A gallery-ready scroll format for collectors who want to display the art without a heavy frame.',
    description: 'Hand-painted Pattachitra scroll on treated cotton cloth with natural pigments and a lacquer coating for durability.',
    details: 'Material: Treated cotton cloth, natural pigments. Dimensions: 35cm x 50cm.',
    shipping: 'Ships within 5-7 business days, rolled in a protective tube.',
  },
  {
    id: 6,
    name: 'Dhokra Figurine',
    craft: 'DHOKRA',
    price: 4100,
    image: IMG.ceramicCups,
    gallery: [IMG.ceramicCups, IMG.woodenVases],
    intro: 'A lost-wax cast bronze figurine made by the Dhokra tribal artisans of Chhattisgarh.',
    aboutCraft: 'Dhokra is a 4,000-year-old lost-wax metal casting technique practised by tribal artisans across Central and Eastern India.',
    ideaBehind: 'A tabletop figurine series celebrating the tribal motifs in a scale suited to modern shelves.',
    description: 'Solid brass Dhokra figurine, individually cast using the traditional lost-wax method — no two pieces are identical.',
    details: 'Material: Brass (bell metal). Dimensions: 15cm height.',
    shipping: 'Ships within 5-7 business days.',
  },
  {
    id: 7,
    name: 'Blue Pottery Bowl',
    craft: 'BLUE POTTERY',
    price: 2650,
    image: IMG.stackedBowls,
    gallery: [IMG.stackedBowls, IMG.greyVases],
    intro: 'A quartz-clay bowl in the signature cobalt-blue glaze of Jaipur\'s potters.',
    aboutCraft: 'Jaipur Blue Pottery uses no clay at all — a quartz-powder dough fired and glazed to a distinctive turquoise-blue finish, a technique brought from Persia via Afghanistan.',
    ideaBehind: 'An everyday serving bowl that brings the decorative Blue Pottery tradition into daily use rather than display-only pieces.',
    description: 'Hand-thrown Blue Pottery bowl with a floral motif, food-safe glaze.',
    details: 'Material: Quartz powder, multani mitti, glaze. Dimensions: 15cm diameter.',
    shipping: 'Ships within 5-7 business days. Fragile — extra padding included.',
  },
  {
    id: 8,
    name: 'Phulkari Runner',
    craft: 'PHULKARI',
    price: 5400,
    image: IMG.textileRack,
    gallery: [IMG.textileRack],
    intro: 'A hand-embroidered table runner in the Phulkari tradition of Punjab.',
    aboutCraft: 'Phulkari, meaning "flower work", is a floral embroidery craft from Punjab, worked entirely from the reverse side of the cloth in darn stitch.',
    ideaBehind: 'A table runner format that lets the geometric floral embroidery live on everyday dining tables.',
    description: 'Hand-embroidered Phulkari table runner on cotton khaddar using silk floss thread.',
    details: 'Material: Cotton khaddar, silk thread. Dimensions: 150cm x 40cm.',
    shipping: 'Ships within 4-6 business days.',
  },
];

export function getProduct(id: number) {
  return products.find((p) => p.id === id);
}
