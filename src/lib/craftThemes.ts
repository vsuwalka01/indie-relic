export type Motif = 'arch' | 'flower' | 'weave' | 'folk' | 'metal' | 'wave';
export type CraftTheme = { ink: string; paper: string; accent: string; motif: Motif; note: string };

// Art direction inspired by the materials in each craft story; decorative interpretations, not reproductions.
const themes: Record<string, [string, string, string, Motif, string]> = {
  Rajasthan: ['#79302A', '#F8EDDA', '#CA9A4B', 'arch', 'Painted portals · desert pigments'],
  'Madhya Pradesh': ['#294D3D', '#F1EDDC', '#BD6B38', 'folk', 'Forest rhythms · dots and lines'],
  Maharashtra: ['#713F32', '#F6EBDA', '#BB7849', 'folk', 'Earth walls · rice-white geometry'],
  'Jammu and Kashmir': ['#3A4C54', '#F2ECE3', '#AD704C', 'flower', 'Soft threads · valley florals'],
  'Uttar Pradesh': ['#36545B', '#F5F2E8', '#9D7842', 'flower', 'Ivory thread · delicate shadow work'],
  Gujarat: ['#8B303D', '#F8EFDB', '#BB8E35', 'weave', 'Tiny knots · fields of colour'],
  Karnataka: ['#252D3B', '#ECEAE4', '#8F7854', 'metal', 'Midnight metal · silver lines'],
  'Andhra Pradesh': ['#733B33', '#F5EBD6', '#547061', 'flower', 'Ink-drawn vines · natural dyes'],
  Odisha: ['#782D2C', '#F6ECD8', '#A88837', 'flower', 'Painted scrolls · intricate borders'],
  Chhattisgarh: ['#443E2B', '#F2E7D3', '#AF7C3A', 'metal', 'Warm bronze · lost-wax textures'],
  'Tamil Nadu': ['#642C32', '#F9EED6', '#B08A39', 'arch', 'Temple arches · luminous gold'],
  Bihar: ['#283F48', '#F7EDD8', '#A94B38', 'flower', 'Double outlines · a garden of stories'],
  Telangana: ['#922E32', '#F9EBDD', '#B48C36', 'arch', 'Scarlet scrolls · painted narratives'],
  'Arunachal Pradesh': ['#303E5C', '#F3E9D6', '#B38D43', 'metal', 'Sacred circles · mineral colours'],
  Assam: ['#635022', '#F7EED3', '#A64935', 'weave', 'Golden silk · woven rhythm'],
  'West Bengal': ['#563A3D', '#F4ECDE', '#B26646', 'weave', 'Running stitches · remembered stories'],
  Jharkhand: ['#6C3C2E', '#F2E5D0', '#957039', 'folk', 'Harvest earth · hand-drawn marks'],
  Uttarakhand: ['#813831', '#FAEEDE', '#AA824B', 'folk', 'Rice-white lines · red-ochre ground'],
  'Himachal Pradesh': ['#465247', '#F4EBDC', '#A95D51', 'flower', 'Fine embroidery · hill-garden colours'],
  Punjab: ['#822F50', '#F9ECD9', '#CA9138', 'weave', 'Flower stitches · joyous geometry'],
  Haryana: ['#394B50', '#F0E7D5', '#AE733D', 'weave', 'Cotton threads · loom-side rhythm'],
  Kerala: ['#29493E', '#F3ECD5', '#AE8B3C', 'metal', 'Polished metal · a golden reflection'],
  Tripura: ['#4C5134', '#F2ECD9', '#A47043', 'weave', 'Split bamboo · woven by hand'],
  Meghalaya: ['#3D5045', '#EDE9D9', '#9A6C43', 'weave', 'Bamboo grain · fire-drawn patterns'],
  Nagaland: ['#3F3035', '#F3E8DB', '#B0483D', 'weave', 'Bold bands · stories in thread'],
  Manipur: ['#303B3B', '#EBE8DE', '#A27852', 'wave', 'Black stone · hand-shaped contours'],
  Mizoram: ['#6E3039', '#F2E7DB', '#9E7D35', 'weave', 'Ceremonial colour · backstrap threads'],
  Sikkim: ['#34485B', '#F4EBD9', '#AD823C', 'metal', 'Mountain pigments · sacred geometry'],
  Goa: ['#294B73', '#F1F0E3', '#B38048', 'flower', 'Cobalt tiles · painted facades'],
  Delhi: ['#53394C', '#F5EBDB', '#A28241', 'flower', 'Metallic thread · raised florals'],
  Puducherry: ['#874632', '#F5EBDD', '#A37C4A', 'wave', 'Warm clay · wheel-thrown contours'],
};

export function getCraftTheme(state: string): CraftTheme {
  const [ink, paper, accent, motif, note] = themes[state] ?? themes.Rajasthan;
  return { ink, paper, accent, motif, note };
}
