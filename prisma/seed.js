import bcrypt from 'bcryptjs';

try {
    process.loadEnvFile();
} catch {
    console.error('   ❌ parceria ... arquivo .env não encontrado');
    process.exit(1);
}

const { criptografar } = await import('../src/lib/cripto.js');
const { prisma } = await import('../src/lib/prisma.js');

// para ter mais linhas no banco, acrescente mais objetos em cada lista/tabela
const dados = {
    usuario: [
        { nome: 'admin', senha: bcrypt.hashSync('admin123',
10) },
        { nome: 'rebeca', senha: bcrypt.hashSync('123',
10) },
        { nome: 'filipe', senha: bcrypt.hashSync('123', 10) },
    ],
    clientes: [
        { nome: 'Nicolly Rodrigues', cpf: criptografar('123.456.789-01') },
        { nome: 'Yasmin Porto', cpf: criptografar('234.567.890-12') },
        { nome: 'Filipe Wallace', cpf: criptografar('345.678.901-23') },
    ],
    imoveis: [
        { modelo: 'Prédio Beira Mar', clientes_id: 1 },
        { modelo: 'Vila Olímpica', clientes_id: 2 },
        { modelo: 'Casa Antiga',  clientes_id: 3 },
    ],
    alugueis: [
        { data: new Date('2026-11-10'), imoveis_id: 1 },
        { data: new Date('2026-11-11'), imoveis_id: 2 },
        { data: new Date('2026-11-12'), imoveis_id: 3 },
    ],
};

const tabelas = Object.keys(dados).reverse().join(', ');
await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tabelas} RESTART IDENTITY CASCADE`);
console.log('   🧹 registros anteriores apagados (ids reiniciados)');

for (const [tabela, data] of Object.entries(dados)) {
    const { count } = await prisma[tabela].createMany({ data });
    console.log(`   ✅ ${tabela}: ${count} registros`);
}

await prisma.$disconnect();