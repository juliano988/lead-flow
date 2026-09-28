import { NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { LeadsService } from './leads.service.js';

describe('LeadsService', () => {
  let service: LeadsService;

  const validLead: CreateLeadDto = {
    firstName: 'Carla',
    lastName: 'Mendes',
    email: 'carla.mendes@elevate.com.br',
    cpf: '529.982.247-25',
    companyName: 'Elevate Consultoria Ltda',
    cnpj: '04.252.011/0001-10',
    source: 'landing-page',
  };

  beforeEach(() => {
    service = new LeadsService();
  });

  it('cria um lead com valores iniciais controlados pelo sistema', () => {
    const lead = service.create(validLead);

    expect(lead.id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(lead.name.firstName).toBe('Carla');
    expect(lead.name.lastName).toBe('Mendes');
    expect(lead.email.value).toBe('carla.mendes@elevate.com.br');
    expect(lead.status.value).toBe('NEW');
    expect(lead.score.value).toBe(0);
    expect(lead.createdAt).toBeInstanceOf(Date);
    expect(lead.updatedAt).toBeInstanceOf(Date);
  });

  it('lista os leads criados', () => {
    const createdLead = service.create(validLead);

    const leads = service.find();

    expect(leads).toHaveLength(1);
    expect(leads[0].id.value).toBe(createdLead.id.value);
  });

  it('busca um lead pelo ID', () => {
    const createdLead = service.create(validLead);

    const foundLead = service.findById(createdLead.id.value);

    expect(foundLead).toBe(createdLead);
  });

  it('lanca NotFoundException ao buscar um ID inexistente', () => {
    expect(() =>
      service.findById('550e8400-e29b-41d4-a716-446655440000'),
    ).toThrow(NotFoundException);
  });

  it('atualiza campos informados e preserva ID e createdAt', () => {
    const createdLead = service.create(validLead);

    const updatedLead = service.update(createdLead.id.value, {
      firstName: 'Carolina',
      companyName: 'Elevate Growth Ltda',
    });

    expect(updatedLead.id).toBe(createdLead.id);
    expect(updatedLead.createdAt).toBe(createdLead.createdAt);
    expect(updatedLead.name.firstName).toBe('Carolina');
    expect(updatedLead.name.lastName).toBe('Mendes');
    expect(updatedLead.company.name).toBe('Elevate Growth Ltda');
    expect(updatedLead.email.value).toBe(validLead.email);
    expect(updatedLead.updatedAt.getTime()).toBeGreaterThanOrEqual(
      createdLead.updatedAt.getTime(),
    );

    expect(service.findById(createdLead.id.value)).toBe(updatedLead);
  });

  it('remove um lead existente', () => {
    const createdLead = service.create(validLead);

    service.remove(createdLead.id.value);

    expect(service.find()).toEqual([]);
    expect(() => service.findById(createdLead.id.value)).toThrow(
      NotFoundException,
    );
  });

  it('lanca NotFoundException ao remover um ID inexistente', () => {
    expect(() =>
      service.remove('550e8400-e29b-41d4-a716-446655440000'),
    ).toThrow(NotFoundException);
  });
});
