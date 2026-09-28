import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { LeadRecord } from './schemas/lead.schema.js';
import { LeadsService } from './leads.service.js';

describe('LeadsService', () => {
  let service: LeadsService;
  let leadModel: {
    create: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    countDocuments: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByIdAndUpdate: ReturnType<typeof vi.fn>;
    findByIdAndDelete: ReturnType<typeof vi.fn>;
  };

  const validLead: CreateLeadDto = {
    firstName: 'Carla',
    lastName: 'Mendes',
    email: 'carla.mendes@elevate.com.br',
    cpf: '529.982.247-25',
    companyName: 'Elevate Consultoria Ltda',
    cnpj: '04.252.011/0001-10',
    source: 'landing-page',
  };

  const createRecord = (overrides: Partial<LeadRecord> = {}): LeadRecord =>
    ({
      _id: new Types.ObjectId('6abaec7ef6a0c545a1ae8a8f'),
      firstName: 'Carla',
      lastName: 'Mendes',
      email: 'carla.mendes@elevate.com.br',
      cpf: '52998224725',
      company: {
        name: 'Elevate Consultoria Ltda',
        cnpj: '04252011000110',
      },
      source: 'landing-page',
      status: 'NEW',
      score: 0,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      ...overrides,
    }) as LeadRecord;

  const createQuery = (result: unknown) => ({
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockResolvedValue(result),
  });

  beforeEach(() => {
    leadModel = {
      create: vi.fn(),
      find: vi.fn(),
      countDocuments: vi.fn(),
      findById: vi.fn(),
      findByIdAndUpdate: vi.fn(),
      findByIdAndDelete: vi.fn(),
    };
    service = new LeadsService(leadModel as unknown as Model<LeadRecord>);
  });

  it('cria um lead e converte o documento para a entidade de domínio', async () => {
    leadModel.create.mockResolvedValue(createRecord());

    const lead = await service.create(validLead);

    expect(lead.id.value).toBe('6abaec7ef6a0c545a1ae8a8f');
    expect(lead.name.firstName).toBe('Carla');
    expect(lead.name.lastName).toBe('Mendes');
    expect(lead.email.value).toBe('carla.mendes@elevate.com.br');
    expect(lead.status.value).toBe('NEW');
    expect(lead.score.value).toBe(0);
    expect(lead.createdAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    expect(lead.updatedAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    expect(leadModel.create).toHaveBeenCalledWith({
      firstName: 'Carla',
      lastName: 'Mendes',
      email: validLead.email,
      cpf: '52998224725',
      source: 'landing-page',
      company: {
        name: validLead.companyName,
        cnpj: '04252011000110',
      },
    });
  });

  it('lista leads com paginação', async () => {
    const query = createQuery([createRecord()]);
    leadModel.find.mockReturnValue(query);

    const leads = await service.find(2, 10);

    expect(leads).toHaveLength(1);
    expect(leads[0].id.value).toBe('6abaec7ef6a0c545a1ae8a8f');
    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.limit).toHaveBeenCalledWith(10);
  });

  it('rejeita paginação com valores inválidos', async () => {
    await expect(service.find(0, 10)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('conta os leads no banco', async () => {
    leadModel.countDocuments.mockReturnValue({
      exec: vi.fn().mockResolvedValue(3),
    });

    await expect(service.count()).resolves.toBe(3);
  });

  it('busca um lead pelo ID', async () => {
    const query = createQuery(createRecord());
    leadModel.findById.mockReturnValue(query);

    const foundLead = await service.findById('6abaec7ef6a0c545a1ae8a8f');

    expect(foundLead.id.value).toBe('6abaec7ef6a0c545a1ae8a8f');
  });

  it('lanca NotFoundException ao buscar um ID inexistente', async () => {
    leadModel.findById.mockReturnValue(createQuery(null));

    await expect(
      service.findById('6abaec7ef6a0c545a1ae8a8f'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('atualiza apenas os campos enviados e preserva os demais', async () => {
    const original = createRecord();
    const updated = createRecord({
      firstName: 'Carolina',
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    });
    leadModel.findById.mockReturnValueOnce(createQuery(original));
    const updateQuery = createQuery(updated);
    leadModel.findByIdAndUpdate.mockReturnValue(updateQuery);

    const updatedLead = await service.update(
      '6abaec7ef6a0c545a1ae8a8f',
      { firstName: 'Carolina' },
    );

    expect(leadModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '6abaec7ef6a0c545a1ae8a8f',
      { $set: { firstName: 'Carolina' } },
      { new: true, runValidators: true },
    );
    expect(updatedLead.id.value).toBe('6abaec7ef6a0c545a1ae8a8f');
    expect(updatedLead.createdAt).toEqual(original.createdAt);
    expect(updatedLead.name.firstName).toBe('Carolina');
    expect(updatedLead.name.lastName).toBe('Mendes');
    expect(updatedLead.company.name).toBe('Elevate Consultoria Ltda');
    expect(updatedLead.email.value).toBe(validLead.email);
    expect(updatedLead.updatedAt).toEqual(updated.updatedAt);
  });

  it('remove e retorna um lead existente', async () => {
    leadModel.findByIdAndDelete.mockReturnValue(createQuery(createRecord()));

    const removedLead = await service.remove('6abaec7ef6a0c545a1ae8a8f');

    expect(removedLead.id.value).toBe('6abaec7ef6a0c545a1ae8a8f');
  });

  it('lanca NotFoundException ao remover um ID inexistente', async () => {
    leadModel.findByIdAndDelete.mockReturnValue(createQuery(null));

    await expect(
      service.remove('6abaec7ef6a0c545a1ae8a8f'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
