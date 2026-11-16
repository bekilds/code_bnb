import { excluir, salvar } from '@actions/alugueis';
import Crud from '@components/Crud';
import { descriptografar } from '@lib/cripto';
import { prisma } from '@lib/prisma';

const colunas = [
    { title: 'Data', dataIndex: 'data' },
    { title: 'Modelo', dataIndex: 'imoveis_modelo' },
    { title: 'Cliente', dataIndex: 'cliente_nome' },
    { title: 'CPF', dataIndex: 'cliente_cpf' },
];

export default async function Alugueis() {
    const [alugueis, imoveis] = await Promise.all([
        prisma.alugueis.findMany({
            orderBy: { data: 'asc' },
            include: { imoveis: { include: { clientes: true } } },
        }),
        prisma.imoveis.findMany({ orderBy: { modelo: 'asc' }, include: { clientes: true } }),
    ]);

    const registros = alugueis.map(({ id, data, imoveis_id, imoveis }) => ({
        id,
        imoveis_id,
        data: data.toISOString().slice(0, 10),
        imoveis_modelo: imoveis.modelo,
        imoveis_placa: imoveis.placa,
        cliente_nome: imoveis.clientes.nome,
        cliente_cpf: descriptografar(imoveis.clientes.cpf),
    }));

    const campos = [
        { name: 'data', label: 'Data', tipo: 'date' },
        {
            name: 'imoveis_id',
            label: 'Imóvel',
            opcoes: imoveis.map((v) => ({
                value: v.id,
                label: `${v.modelo} (${v.clientes.nome})`,
            })),
        },
    ];

    return <Crud titulo="Alugueis" {...{ colunas, campos, registros, salvar, excluir }} />;
}