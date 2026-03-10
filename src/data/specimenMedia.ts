import type { ImageSourcePropType } from "react-native";

const wikimedia = (
  specimenImageUri: string,
  specimenImageSourceUrl: string,
  specimenImageCredit: string,
) => ({
  specimenImageUri,
  specimenImageSourceUrl,
  specimenImageCredit,
});

const localArtwork = (
  specimenImageSource: ImageSourcePropType,
  specimenImageCredit: string,
) => ({
  specimenImageSource,
  specimenImageCredit,
});

const wikimediaFile = (
  filename: string,
  specimenImageSourceUrl: string,
  specimenImageCredit: string,
) =>
  wikimedia(
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
      filename,
    ).replace(/%20/g, "_")}?width=1200`,
    specimenImageSourceUrl,
    specimenImageCredit,
  );

export const shellSpecimenMedia = {
  letteredOlive: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/1/1c/Oliva_sayana_%28lettered_olive_snail_shell%29_%28Sanibel_Island%2C_Florida%2C_USA%29_%2849767621651%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Oliva_sayana_(lettered_olive_snail_shell)_(Sanibel_Island,_Florida,_USA)_(49767621651).jpg",
    "James St. John • CC BY 2.0",
  ),
  calicoScallop: localArtwork(
    require("../../assets/specimens/calico-scallop.png"),
    "Ocean Collector original art",
  ),
  lightningWhelk: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Busycon_sinistrum_%28lightning_whelk%29_%28offshore_Carrabelle%2C_Florida%2C_USA%29_2_%2824570696705%29.jpg/960px-Busycon_sinistrum_%28lightning_whelk%29_%28offshore_Carrabelle%2C_Florida%2C_USA%29_2_%2824570696705%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Busycon_sinistrum_(lightning_whelk)_(offshore_Carrabelle,_Florida,_USA)_2_(24570696705).jpg",
    "James St. John • CC BY 2.0",
  ),
  moonSnail: wikimedia(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Neverita_duplicata_(shark_eye_shell)_(Cayo_Costa_Island,_Florida,_USA)_3_(49775244202).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/File:Neverita_duplicata_(shark_eye_shell)_(Cayo_Costa_Island,_Florida,_USA)_3_(49775244202).jpg",
    "James St. John • CC BY 2.0",
  ),
  coquinaClam: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Donax_variabilis_%28variable_coquina_clam_shells%29_%28Sanibel_Island%2C_Florida%2C_USA%29_%2849775052226%29.jpg/960px-Donax_variabilis_%28variable_coquina_clam_shells%29_%28Sanibel_Island%2C_Florida%2C_USA%29_%2849775052226%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Donax_variabilis_(variable_coquina_clam_shells)_(Sanibel_Island,_Florida,_USA)_(49775052226).jpg",
    "James St. John • CC BY 2.0",
  ),
  atlanticCockle: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Dinocardium_robustum_01.jpg/960px-Dinocardium_robustum_01.jpg",
    "https://commons.wikimedia.org/wiki/File:Dinocardium_robustum_01.jpg",
    "H. Zell • CC BY-SA 3.0",
  ),
  turkeyWing: localArtwork(
    require("../../assets/specimens/turkey-wing.png"),
    "Ocean Collector original art",
  ),
  scotchBonnet: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Semicassis_Granulata_Shell.JPG/960px-Semicassis_Granulata_Shell.JPG",
    "https://commons.wikimedia.org/wiki/File:Semicassis_Granulata_Shell.JPG",
    "Joshyhmarks • CC BY-SA 3.0",
  ),
  floridaFightingConch: wikimedia(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Strombus_alatus_(shell)_(Marco_Island,_Florida,_USA)_3_(52929878332).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/File:Strombus_alatus_(shell)_(Marco_Island,_Florida,_USA)_3_(52929878332).jpg",
    "James St. John • CC BY 2.0",
  ),
  angelWing: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cyrtopleura_costata_%28angelwing_clam_shell%29_%28Cayo_Costa_Island%2C_Florida%2C_USA%29_5_%2849774473898%29.jpg/960px-Cyrtopleura_costata_%28angelwing_clam_shell%29_%28Cayo_Costa_Island%2C_Florida%2C_USA%29_5_%2849774473898%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Cyrtopleura_costata_(angelwing_clam_shell)_(Cayo_Costa_Island,_Florida,_USA)_5_(49774473898).jpg",
    "James St. John • CC BY 2.0",
  ),
  junonia: wikimediaFile(
    "Scaphella junonia.jpg",
    "https://commons.wikimedia.org/wiki/File:Scaphella_junonia.jpg",
    "Bradeos Graphon • Public domain",
  ),
  knobbedWhelk: wikimediaFile(
    "Busycon carica eliceans 01.JPG",
    "https://commons.wikimedia.org/wiki/File:Busycon_carica_eliceans_01.JPG",
    "H. Zell • CC BY-SA 3.0",
  ),
  horseConch: wikimediaFile(
    "Triplofusus giganteus 01.JPG",
    "https://commons.wikimedia.org/wiki/File:Triplofusus_giganteus_01.JPG",
    "H. Zell • CC BY-SA 3.0",
  ),
  bandedTulip: wikimediaFile(
    "Fasciolaria lilium 01.JPG",
    "https://commons.wikimedia.org/wiki/File:Fasciolaria_lilium_01.JPG",
    "H. Zell • CC BY-SA 3.0",
  ),
  jingleShell: wikimediaFile(
    "Anomia simplex (jingle shell) (Marco Island, Florida, USA) 5 (52930865722).jpg",
    "https://commons.wikimedia.org/wiki/File:Anomia_simplex_(jingle_shell)_(Marco_Island,_Florida,_USA)_5_(52930865722).jpg",
    "James St. John • CC BY 2.0",
  ),
  kittensPaw: wikimediaFile(
    "Plicatula gibbosa 01.JPG",
    "https://commons.wikimedia.org/wiki/File:Plicatula_gibbosa_01.JPG",
    "H. Zell • CC BY-SA 3.0",
  ),
  penShell: wikimediaFile(
    "Atrina sp. (pen shell) on marine beach (Cayo Costa Island, Florida, USA) 3 (49775289657).jpg",
    "https://commons.wikimedia.org/wiki/File:Atrina_sp._(pen_shell)_on_marine_beach_(Cayo_Costa_Island,_Florida,_USA)_3_(49775289657).jpg",
    "James St. John • CC BY 2.0",
  ),
  oysterDrill: wikimediaFile(
    "Urosalpinx cinerea 01.JPG",
    "https://commons.wikimedia.org/wiki/File:Urosalpinx_cinerea_01.JPG",
    "H. Zell • CC BY-SA 3.0",
  ),
} as const;

export const sharkSpecimenMedia = {
  sandTiger: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/Carcharias_taurus_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharias_taurus_teeth.jpg",
    "Robert Purdy/Smithsonian National Museum of Natural History • Public domain",
  ),
  greatWhite: wikimedia(
    "https://commons.wikimedia.org/wiki/Special:FilePath/White_shark_teeth_closeup_Florida.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/File:White_shark_teeth_closeup_Florida.jpg",
    "Wikimedia Commons",
  ),
  lemonShark: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/Negaprion_brevirostris_lower_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Negaprion_brevirostris_lower_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  tigerShark: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tiger_shark_teeth.jpg/960px-Tiger_shark_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Tiger_shark_teeth.jpg",
    "User:Stefan Kuhn • CC BY-SA 3.0",
  ),
  mako: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Zahn_eines_Kurzflossen-Makos_%28Isurus_oxyrinchus%29.jpg/960px-Zahn_eines_Kurzflossen-Makos_%28Isurus_oxyrinchus%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Zahn_eines_Kurzflossen-Makos_(Isurus_oxyrinchus).jpg",
    "Marco Almbauer • CC0",
  ),
  bullShark: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/3/39/Carcharhinus_leucas_lower_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharhinus_leucas_lower_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  blacktipShark: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/9/93/Carcharhinus_limbatus_lower_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharhinus_limbatus_lower_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  greatHammerhead: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/9/92/Sphyrna_mokarran_lower_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Sphyrna_mokarran_lower_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  megalodon: wikimediaFile(
    "Megalodon shark tooth fossil.jpg",
    "https://commons.wikimedia.org/wiki/File:Megalodon_shark_tooth_fossil.jpg",
    "WorldwrestlingfederationVKM • CC BY-SA 3.0",
  ),
  spinnerShark: wikimediaFile(
    "Carcharhinus brevipinna upper teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharhinus_brevipinna_upper_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  duskyShark: wikimediaFile(
    "Carcharhinus obscurus lower teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharhinus_obscurus_lower_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  bonnethead: wikimediaFile(
    "Sphyrna tiburo upper teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Sphyrna_tiburo_upper_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  thresherShark: wikimediaFile(
    "Alopias vulpinus teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Alopias_vulpinus_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
  snaggletoothShark: wikimediaFile(
    "Hemipristis serra teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Hemipristis_serra_teeth.jpg",
    "Smithsonian • CC0",
  ),
  sandbarShark: wikimediaFile(
    "Carcharhinus plumbeus lower teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharhinus_plumbeus_lower_teeth.jpg",
    "D Ross Robertson • Public domain",
  ),
} as const;
