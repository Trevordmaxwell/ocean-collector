import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { beachFactCards, sharkSpecies, shellSpecies } from "../data";

export function FactsScreen() {
  return (
    <ScreenShell>
      <SectionTitle
        title="Learn & Fun Facts"
        subtitle="Short, friendly knowledge bites for curious beachcombers."
      />

      {beachFactCards.map((fact) => (
        <OceanCard key={fact.id} title={fact.title} subtitle={fact.body} icon={fact.icon} />
      ))}

      <SectionTitle title="Shell highlights" subtitle="A few sample library facts." />
      {shellSpecies.slice(0, 2).map((item) => (
        <OceanCard
          key={item.id}
          title={item.commonName}
          subtitle={item.funFacts[0]}
          icon={item.specimenEmoji}
          imageUri={item.specimenImageUri}
          accent={item.cardPalette}
        />
      ))}

      <SectionTitle title="Shark tooth highlights" subtitle="Fun, not overly textbook." />
      {sharkSpecies.slice(0, 2).map((item) => (
        <OceanCard
          key={item.id}
          title={item.commonName}
          subtitle={item.funFacts[0]}
          icon={item.specimenEmoji}
          imageUri={item.specimenImageUri}
          accent={item.cardPalette}
        />
      ))}
    </ScreenShell>
  );
}
