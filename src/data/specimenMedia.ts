const wikimedia = (
  specimenImageUri: string,
  specimenImageSourceUrl: string,
  specimenImageCredit: string,
) => ({
  specimenImageUri,
  specimenImageSourceUrl,
  specimenImageCredit,
});

export const shellSpecimenMedia = {
  letteredOlive: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/1/1c/Oliva_sayana_%28lettered_olive_snail_shell%29_%28Sanibel_Island%2C_Florida%2C_USA%29_%2849767621651%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Oliva_sayana_(lettered_olive_snail_shell)_(Sanibel_Island,_Florida,_USA)_(49767621651).jpg",
    "James St. John • CC BY 2.0",
  ),
  calicoScallop: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Argopecten_gibbus_02.jpg/960px-Argopecten_gibbus_02.jpg",
    "https://commons.wikimedia.org/wiki/File:Argopecten_gibbus_02.jpg",
    "H. Zell • CC BY-SA 3.0",
  ),
  lightningWhelk: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Busycon_sinistrum_%28lightning_whelk%29_%28offshore_Carrabelle%2C_Florida%2C_USA%29_2_%2824570696705%29.jpg/960px-Busycon_sinistrum_%28lightning_whelk%29_%28offshore_Carrabelle%2C_Florida%2C_USA%29_2_%2824570696705%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Busycon_sinistrum_(lightning_whelk)_(offshore_Carrabelle,_Florida,_USA)_2_(24570696705).jpg",
    "James St. John • CC BY 2.0",
  ),
  moonSnail: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Neverita_duplicata_01.JPG/960px-Neverita_duplicata_01.JPG",
    "https://commons.wikimedia.org/wiki/File:Neverita_duplicata_01.JPG",
    "H. Zell • CC BY-SA 3.0",
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
  turkeyWing: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Arca_zebra_%28zebra_ark_clam_shell%29_%28Sanibel_Island%2C_Florida%2C_USA%29_2_%2849767573871%29.jpg/960px-Arca_zebra_%28zebra_ark_clam_shell%29_%28Sanibel_Island%2C_Florida%2C_USA%29_2_%2849767573871%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Arca_zebra_(zebra_ark_clam_shell)_(Sanibel_Island,_Florida,_USA)_2_(49767573871).jpg",
    "James St. John • CC BY 2.0",
  ),
  scotchBonnet: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Semicassis_Granulata_Shell.JPG/960px-Semicassis_Granulata_Shell.JPG",
    "https://commons.wikimedia.org/wiki/File:Semicassis_Granulata_Shell.JPG",
    "Joshyhmarks • CC BY-SA 3.0",
  ),
  floridaFightingConch: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Strombus_alatus_01.JPG/960px-Strombus_alatus_01.JPG",
    "https://commons.wikimedia.org/wiki/File:Strombus_alatus_01.JPG",
    "H. Zell • CC BY-SA 3.0",
  ),
  angelWing: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cyrtopleura_costata_%28angelwing_clam_shell%29_%28Cayo_Costa_Island%2C_Florida%2C_USA%29_5_%2849774473898%29.jpg/960px-Cyrtopleura_costata_%28angelwing_clam_shell%29_%28Cayo_Costa_Island%2C_Florida%2C_USA%29_5_%2849774473898%29.jpg",
    "https://commons.wikimedia.org/wiki/File:Cyrtopleura_costata_(angelwing_clam_shell)_(Cayo_Costa_Island,_Florida,_USA)_5_(49774473898).jpg",
    "James St. John • CC BY 2.0",
  ),
} as const;

export const sharkSpecimenMedia = {
  sandTiger: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/Carcharias_taurus_teeth.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharias_taurus_teeth.jpg",
    "Robert Purdy/Smithsonian National Museum of Natural History • Public domain",
  ),
  greatWhite: wikimedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Carcharodon_carcharias_01.jpg/960px-Carcharodon_carcharias_01.jpg",
    "https://commons.wikimedia.org/wiki/File:Carcharodon_carcharias_01.jpg",
    "Kevmin • CC BY-SA 3.0",
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
} as const;
