// Copy is the client's "Molytex Product Category" brief, word for word.
const PACKAGING_NOTE =
  "Cost-effective institutional packaging available for hospitals, government procurement, tenders and bulk orders. Our focus is on maintaining product quality while optimising packaging and pricing to offer maximum value to institutional buyers.";

type Category = {
  id: string;
  name: string;
  images: { src: string; alt: string }[];
  text: string;
  note?: string;
  points?: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "surgical-instruments",
    name: "Surgical Instruments",
    images: [{ src: "surgical-instruments", alt: "Molytex surgical instruments box with scissors, forceps and needle holders" }],
    text: "Molytex offers a range of surgical instruments designed to support routine clinical procedures, hospital requirements and institutional procurement only. Our range includes commonly used instruments for healthcare facilities, subject to product availability and specifications.",
    points: [
      "Surgical scissors",
      "Surgical forceps",
      "Needle holders",
      "Artery forceps and clamps",
      "Surgical Drums",
      "Other general surgical instruments",
    ],
  },
  {
    id: "three-ply-surgical-masks",
    name: "3-Ply Surgical Masks",
    images: [{ src: "surgical-masks", alt: "Molytex 3-ply surgical face mask box of 50 with masks" }],
    text: "Molytex 3-ply disposable masks are intended for everyday use in suitable healthcare, workplace and institutional environments. Designed with a three-layer construction and ear loops, these masks are available for bulk procurement, subject to the final product specifications.",
    points: [
      "Three-layer construction",
      "Ear-loop design",
      "Disposable format",
      "Box packaging, 50 pieces & 25 pieces",
      "Bulk and institutional supply options",
    ],
  },
  {
    id: "cautery-tip-cleaners",
    name: "Cautery Tip Cleaners",
    images: [{ src: "cautery-tip-cleaners", alt: "Molytex cautery tip cleaner scrub sponges, box of 50 and sterile pouch" }],
    text: "Molytex cautery tip cleaners are intended for use with compatible electrosurgical instruments in clinical settings. They are designed to assist in removing accumulated tissue residue from electrosurgical tips during procedures, according to the product's intended use and instructions.",
    points: [
      "Product type and material",
      "Compatibility with cautery instruments",
      "Dimensions and configuration",
      "Sterile & non-sterile packs",
      "Pack size of 50 pieces",
    ],
  },
  {
    id: "examination-gloves",
    name: "Examination Gloves",
    images: [{ src: "examination-gloves", alt: "Molytex latex examination gloves box of 50 with gloves" }],
    text: "Molytex examination gloves are designed for appropriate examination, hygiene and routine handling applications, depending on the glove material and intended use. Available options can be specified according to material, size, fit and user requirements.",
    points: ["Latex examination gloves", "Pack size of 25 pieces & 50 pieces"],
  },
  {
    id: "hand-sanitiser",
    name: "Hand Sanitiser",
    images: [{ src: "hand-sanitiser", alt: "Molytex hand sanitiser box and 50 ml, 100 ml and 250 ml spray bottles" }],
    text: "Molytex hand sanitiser products are intended to support everyday hand hygiene in suitable homes, workplaces and institutional environments. Product selection can be based on formulation, pack size and intended application.",
  },
  {
    id: "ls-belts",
    name: "LS Belts",
    images: [{ src: "ls-belts", alt: "Molytex LS belt lumbar sacral support in its pack and unpacked" }],
    text: "Molytex LS belts are designed to provide support and compression to the lumbar and sacral region. Available designs may include adjustable closures, supportive panels and different sizes to accommodate varying user requirements.",
    note: PACKAGING_NOTE,
  },
  {
    id: "knee-caps-rehabilitation-aids",
    name: "Knee Caps & Rehabilitation Aids",
    images: [
      { src: "knee-caps", alt: "Molytex elastic knee cap pair in its pack and unpacked" },
      { src: "rehabilitation-aids", alt: "Molytex cervical collar, knee immobilizer and Taylor brace in their packs" },
    ],
    text: "Molytex knee caps and supports offer a range of options for knee support during everyday activities, exercise and appropriate rehabilitation applications. Different designs and sizes can be selected according to individual requirements and the product's intended use.",
    note: PACKAGING_NOTE,
  },
  {
    id: "custom-packs",
    name: "Custom Packs - Surgical & Draping Kits",
    images: [{ src: "custom-packs", alt: "Molytex surgical draping kit, dressing procedure kit, minor procedure pack and department kit" }],
    text: "Molytex Custom Packs are configurable procedure packs developed around the requirements of healthcare users. Depending on the application, packs can combine selected drapes, swabs, gauze and other compatible disposable consumables into a convenient procurement format.",
    points: [
      "Surgical procedure packs",
      "Surgical draping kits",
      "Dressing procedure kits",
      "Minor procedure packs",
      "Department-specific custom kits",
    ],
  },
  {
    id: "surgical-skin-marker-pens",
    name: "Surgical Skin Marker Pens",
    images: [{ src: "skin-marker-pens", alt: "Molytex sterile surgical skin marker with ruler in its pack" }],
    text: "Molytex surgical skin marker pens are intended for skin marking in appropriate clinical and surgical settings, according to the specific product's intended use. Different tip styles and marking configurations can support varying procedural requirements.",
  },
  {
    id: "bed-bath-wipes",
    name: "Bed Bath Wipes",
    images: [{ src: "bed-bath-wipes", alt: "Molytex bed bath wipes packs of 10 and 50 with available pack sizes" }],
    text: "Molytex bed bath wipes are designed for convenient patient cleansing when a traditional bath is not practical. Depending on the product formulation, these wipes may be suitable for bedside care, long-term care facilities and other personal hygiene applications.",
    points: [
      "Wipe dimensions and material as per user specification.",
      "Pack quantity can be customised as per user specification.",
      "Fragrance-free & sensitive-skin options available.",
    ],
  },
  {
    id: "absorbent-cotton",
    name: "Absorbent Cotton",
    images: [{ src: "absorbent-cotton", alt: "Molytex 500 g absorbent cotton roll in its pack and unrolled" }],
    text: "Molytex absorbent cotton is intended for appropriate medical, clinical and healthcare applications in accordance with the product's specifications. Available formats can be selected according to institutional requirements, pack size and intended application.",
    points: ["Absorbent cotton rolls", "Different weights and pack sizes available."],
  },
  {
    id: "absorbent-gauze-thaan",
    name: "Absorbent Gauze Thaan",
    images: [{ src: "gauze-thaan", alt: "Molytex absorbent gauze thaan packs, 60 cm by 18 m and 60 cm by 3 m" }],
    text: "Molytex absorbent gauze thaan is intended for appropriate medical, clinical and healthcare applications in accordance with the product's specifications. Available formats can be selected according to institutional requirements, pack size and intended application.",
    points: ["Two pack sizes with standard institutional width of 60 cm", "Two lengths – 18 mtr & 3 mtr"],
  },
  {
    id: "patient-identification-tags",
    name: "Patient Identification Tags",
    images: [{ src: "patient-id-tags", alt: "Molytex patient identification tags pack of 100 in assorted colours" }],
    text: "Molytex patient identification bands and tags are designed to support patient identification and administrative workflows in healthcare facilities.",
  },
  {
    id: "mother-baby-soft-tags",
    name: "Mother & Baby Soft Tags",
    images: [{ src: "mother-baby-tags", alt: "Molytex mother and baby soft tags pack of 50 pairs" }],
    text: "Molytex mother and baby identification bands are designed to support identification procedures in maternity wards, labour rooms and newborn-care settings. Matching band configurations can help healthcare staff associate mother and newborn records according to the hospital's identification protocol.",
  },
];
