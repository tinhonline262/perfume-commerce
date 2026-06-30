import { PerfumePrice } from "../../types/types";

export const perfumer: Array<{ name: string }> = [
    { name: "Burberry" },
    { name: "Bvlgari" },
    { name: "Calvin Klein" },
    { name: "Carolina Herrera" },
    { name: "Chanel" },
    { name: "Creed" },
    { name: "Dior" },
    { name: "Dolce&Gabbana" },
    { name: "Giorgio Armani" },
    { name: "Gucci" },
    { name: "Hermes" },
    { name: "Hugo Boss" },
    { name: "Jean Paul Gaultier" },
    { name: "Lancome" },
    { name: "Paco Rabanne" },
    { name: "Prada" },
    { name: "Tom Ford" },
    { name: "Versace" }
];

export const gender: Array<{ name: string }> = [{ name: "male" }, { name: "female" }];

export const price: Array<PerfumePrice> = [
    { id: 1, name: "any", array: [25000, 249975000] },
    { id: 2, name: "375000 - 625000 VND", array: [375000, 625000] },
    { id: 3, name: "625000 - 1000000 VND", array: [625000, 1000000] },
    { id: 4, name: "1000000 - 2250000 VND", array: [1000000, 2250000] },
    { id: 5, name: "2250000 - 6250000+ VND", array: [2250000, 6250000] }
];
