import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = "matheusfsaraiva2009@gmail.com";
  const adminPassword = "matheus2026";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Remove any old admin users that might exist
    await prisma.user.deleteMany({ where: { role: "admin" } });

    await prisma.user.create({
      data: {
        name: "Matheus",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        phone: "",
      },
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        name: "Matheus",
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("Admin user updated.");
  }

  // Seed default site configs
  const defaultConfigs = [
    { key: "brandName", value: "Aura & Essência" },
    { key: "tagline", value: "Cuidado Pessoal & Terapias de Bem-Estar" },
    { key: "logoUrl", value: "" },
    { key: "heroTitle", value: "Harmonia e Bem-Estar para o Seu Corpo e Mente" },
    { key: "heroSubtitle", value: "Descubra nossa linha exclusiva de cosméticos aromáticos e agende sessões de massoterapia revigorantes." },
    { key: "heroImage", value: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80" },
    { key: "aboutText", value: "Dedicamo-nos a criar rituais de autocuidado que despertam sensações e restauram energias, aliando aromas naturais a toques terapêuticos." },
    { key: "objectiveText", value: "Proporcionar experiências sensoriais completas com produtos de alta qualidade e atendimento humanizado." },
    { key: "whatsapp", value: "5511999999999" },
    { key: "email", value: "contato@marca.com" },
    { key: "instagram", value: "https://instagram.com" },
    { key: "facebook", value: "https://facebook.com" },
    { key: "teamMembers", value: "" },
  ];

  for (const conf of defaultConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: conf.key },
      update: { value: conf.value },
      create: { key: conf.key, value: conf.value },
    });
  }
  console.log("Site configs seeded.");

  // Seed some initial products
  const sampleProducts = [
    {
      name: "Vela Aromática Floral & Morango",
      description: "Vela de cera vegetal com fragrância suave de morango e flores silvestres, ideal para criar uma atmosfera relaxante.",
      price: 68.0,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
      characteristics: "Cera 100% de soja, pavio de algodão, queima limpa por 35 horas.",
      fragrance: "Morango Silvestre & Flor de Laranjeira",
      available: true,
      featured: true,
      sortOrder: 1,
    },
    {
      name: "Óleo Corporal Hidratante Melancia Glow",
      description: "Fórmula leve com rápida absorção, enriquecida com óleo de semente de melancia e vitamina E.",
      price: 85.0,
      image: "https://images.unsplash.com/photo-1608248597359-2e06a386120e?auto=format&fit=crop&w=600&q=80",
      characteristics: "Toque seco, alta hidratação, 120ml.",
      fragrance: "Melancia Fresca & Menta",
      available: true,
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Sabonete Artesanal Esfoliante de Argila Rosa",
      description: "Limpeza delicada e esfoliação suave que revitaliza a pele sem ressecar.",
      price: 32.0,
      image: "https://images.unsplash.com/photo-1607006314644-883a48e7e174?auto=format&fit=crop&w=600&q=80",
      characteristics: "Glicerina vegetal, argila rosa e manteiga de karité, 100g.",
      fragrance: "Lavanda & Baunilha",
      available: true,
      featured: true,
      sortOrder: 3,
    },
  ];

  for (const prod of sampleProducts) {
    const existing = await prisma.product.findFirst({ where: { name: prod.name } });
    if (!existing) {
      await prisma.product.create({ data: prod });
    }
  }

  // Seed sample massages
  const sampleMassages = [
    {
      name: "Massagem Relaxante com Aromaterapia",
      description: "Movimentos suaves e fluidos associados a óleos essenciais exclusivos para alívio imediato de tensões.",
      objective: "Alívio de estresse e fadiga mental",
      benefits: "Melhora da circulação sanguínea, alívio de dores musculares leves e sensação profunda de paz.",
      duration: 60,
      price: 150.0,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
      available: true,
      sortOrder: 1,
    },
    {
      name: "Drenagem Linfática Corporal",
      description: "Técnica manual especializada para reduzir retenção de líquidos e eliminar toxinas do organismo.",
      objective: "Desinchaço corporal e estímulo linfático",
      benefits: "Redução de edemas, melhora no contorno corporal e ativação do sistema imunológico.",
      duration: 50,
      price: 160.0,
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
      available: true,
      sortOrder: 2,
    },
  ];

  for (const m of sampleMassages) {
    const existing = await prisma.massage.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.massage.create({ data: m });
    }
  }

  // Seed Olfactive Pyramids
  const samplePyramids = [
    {
      name: "Morango Silvestre",
      description: "Uma fragrância adocicada e vibrante que evoca memórias afetivas e frescor primaveril.",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
      topNotes: "Morango fresco, Frutas vermelhas, Toque cítrico de tangerina",
      heartNotes: "Flor de laranjeira, Pétalas de jasmim, Framboesa",
      baseNotes: "Baunilha cremosa, Almíscar suave, Açúcar cristalizado",
      sortOrder: 1,
    },
    {
      name: "Melancia Tropical",
      description: "Refrescância aquática com notas frutadas revigorantes para dias ensolarados.",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
      topNotes: "Melancia suculenta, Melão cantaloupe, Hortelã fresca",
      heartNotes: "Pepino refrescante, Lótus d'água, Violeta",
      baseNotes: "Âmbar suave, Cedro claro, Almíscar branco",
      sortOrder: 2,
    },
  ];

  for (const p of samplePyramids) {
    const existing = await prisma.olfactivePyramid.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.olfactivePyramid.create({ data: p });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
