import { excluir, salvar } from '@actions/imoveis';
import Crud from '@components/Crud';
import { prisma } from '@lib/prisma';

const colunas = [
    { title: 'Modelo', dataIndex: 'modelo' },
    { title: 'Clientes', dataIndex: 'clientes_nome' },
];

export default async function Imoveis() {
    const [imoveis, clientes] = await Promise.all([
        prisma.imoveis.findMany({ orderBy: { modelo: 'asc' }, include: { clientes: true } }),
        prisma.clientes.findMany({ orderBy: { nome: 'asc' } }),
    ]);

    const registros = imoveis.map(({ clientes, ...imoveis }) => ({
        ...imoveis,
        clientes_nome: clientes.nome,
    }));

    const campos = [
        { name: 'modelo', label: 'Modelo' },
        {
            name: 'clientes_id',
            label: 'Clientes',
            opcoes: clientes.map((c) => ({ value: c.id, label: c.nome })),
        },
    ];

    return <Crud titulo="Imóveis" {...{ colunas, campos, registros, salvar, excluir }} />;
}