import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("securepass", 10);

  const testUser1 = await prisma.user.upsert({
    where: { email: "test1@example.com" },
    update: {},
    create: {
      email: "test1@example.com",
      username: "test1",
      password: password1,
      role: "user",
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { email: "test2@example.com" },
    update: {},
    create: {
      email: "test2@example.com",
      username: "test2",
      password: password2,
      role: "user",
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'newadmin',
      email: 'admin@example.com',
      password: password1,
      role: 'admin',
    },
  });

  const category1 = await prisma.category.create({
    data: { title: "Þróun" },
  });

  const category2 = await prisma.category.create({
    data: { title: "Hönnun" }, 
  });

  const category3 = await prisma.category.create({
    data: { title: "Verkefnastjórnun" }, 
  });
  const categories = [
    "Framendi",      
    "Bakendi",        
  ];

  for (const title of categories) {
    await prisma.category.upsert({
      where: { title },
      update: {},
      create: { title },
    });
  }

  await prisma.item.createMany({
    data: [
      {
        title: "Laga auðkenningarvillu",
        description: "Leysa innskráningarvandamál í API",
        categoryId: category1.id, 
        priority: true,
        due: new Date("2025-06-01"),
      },
      {
        title: "Endurhanna forsíðu",
        description: "Gera forsíðuna meira sjónrænt aðlaðandi",
        categoryId: category2.id, 
        priority: false,
        due: new Date("2025-07-15"),
      },
      {
        title: "Skipuleggja næsta sprint",
        description: "Ákveða hvaða verkefni fara í næsta þróunartímabil",
        categoryId: category3.id, 
        priority: true,
        due: new Date("2025-06-10"),
      },
      {
        title: "Bæta við dökkum ham",
        description: "Gera vefinn betri fyrir notendur í myrkri",
        categoryId: category2.id,
        priority: false,
        due: new Date("2025-08-01"),
      },
      {
        title: "Innleiða JWT auðkenningu",
        description: "Nota JSON Web Tokens fyrir öruggari auðkenningu",
        categoryId: category1.id,
        priority: true,
        due: new Date("2025-06-20"),
      },
      {
        title: "Laga brotna tengla á vefnum",
        description: "Skanna og laga allar 404 síður",
        categoryId: category3.id,
        priority: false,
        due: new Date("2025-07-05"),
      },
      {
        title: "Bóka viðskiptavinaviðtal",
        description: "Fá endurgjöf um nýju hönnunina",
        categoryId: category3.id,
        priority: true,
        due: new Date("2025-06-15"),
      },
      {
        title: "Gera einingaprófanir á bakenda API",
        description: "Nota Jest til að prófa endapunkta",
        categoryId: category1.id,
        priority: true,
        due: new Date("2025-06-25"),
      },
      {
        title: "Skipuleggja vinnuferli",
        description: "Koma á betri ferlum fyrir forritara",
        categoryId: category3.id, 
        priority: false,
        due: new Date("2025-06-30"),
      },
        {
          title: "Hanna nýtt viðmót fyrir verkefnalista",
          description: "Fínstilla litaval, stærðir og letur í React appinu",
          categoryId: category2.id, // Hönnun
          priority: true,
          due: new Date("2025-06-18"),
        },
        {
          title: "Koma á sjálfvirkri birtingu með GitHub Actions",
          description: "Deploy á hverju push á main grein",
          categoryId: category1.id, // Þróun
          priority: true,
          due: new Date("2025-06-25"),
        },
        {
          title: "Skipuleggja hópfund með teyminu",
          description: "Fara yfir stöðu verkefna og næstu skref",
          categoryId: category3.id, // Verkefnastjórnun
          priority: false,
          due: new Date("2025-06-12"),
        },
        {
          title: "Setja upp aðgangsstýringarhlutverk",
          description: "Aðgreina stjórnendur og notendur með RBAC",
          categoryId: category1.id, // Þróun
          priority: true,
          due: new Date("2025-07-01"),
        },
        {
          title: "Hreinsa gagnagrunn fyrir útskrift",
          description: "Eyða test-gögnum og tryggja skýrleika í skráningu",
          categoryId: category3.id, // Verkefnastjórnun
          priority: false,
          due: new Date("2025-06-29"),
        },
        {
          title: "Bæta við stuðningi við íslensku í viðmóti",
          description: "Þýða allar textastrengja með i18n kerfi",
          categoryId: category2.id, // Hönnun
          priority: true,
          due: new Date("2025-07-10"),
        },
        {
          title: "Greina afköst með Lighthouse",
          description: "Meta hraða og aðgengi forsíðu",
          categoryId: category3.id, // Verkefnastjórnun
          priority: false,
          due: new Date("2025-06-20"),
        },
        {
          title: "Setja upp tölvupóstsendingar",
          description: "Senda staðfestingarpóst eftir skráningu",
          categoryId: category1.id, // Þróun
          priority: true,
          due: new Date("2025-06-28"),
        },
        {
          title: "Gera notendaprófanir með hópi A/B",
          description: "Prófa tvær útgáfur af forsíðu",
          categoryId: category2.id, // Hönnun
          priority: false,
          due: new Date("2025-07-05"),
        },
        {
          title: "Skrifa README með góðum leiðbeiningum",
          description: "Útskýra hvernig setja upp, keyra og þróa kerfið",
          categoryId: category3.id, // Verkefnastjórnun
          priority: false,
          due: new Date("2025-06-18"),
        },
        {
          title: "Innleiða notendasnið",
          description: "Leyfa notendum að breyta upplýsingum og mynd",
          categoryId: category1.id, // Þróun
          priority: true,
          due: new Date("2025-07-01"),
        },
        {
          title: "Hreinsa ónotaðar SCSS breytur",
          description: "Ganga frá styles áður en forrit er gefið út",
          categoryId: category2.id, // Hönnun
          priority: false,
          due: new Date("2025-06-22"),
        },
        {
          title: "Taka upp kynningu á verkefninu",
          description: "Skila með myndbandi í verkefnaskilum",
          categoryId: category3.id, // Verkefnastjórnun
          priority: true,
          due: new Date("2025-06-30"),
        },
      ],
  });
  

  console.log("successful!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
