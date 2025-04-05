import '../../styles/globals.scss';


export default function HomePage() {
  return (
    <main className="homepage">
      <h1>Verkefnalisti</h1>
      <div className="intro-text">
        <p>Þetta verkefni er unnið fyrir Vefforritun 2 – hópverkefni 2.</p>
        <p>
          Við settum upp notendakerfi þar sem bæði notendur og stjórnendur geta skráð sig inn,
          skoðað verkefni og bætt við færslum sem tengjast flokkum.
        </p>
        <p>
          Verkefnið er byggt með React, Next.js, Prisma og PostgreSQL, með áherslu á góða notendaupplifun og hreinan kóða.
        </p>
      </div>
    </main>
  );
}

