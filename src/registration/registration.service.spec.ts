import { NotFoundException } from '@nestjs/common';
import { RegistrationService } from './registration.service';

const createMockRepo = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('RegistrationService', () => {
  let service: RegistrationService;
  let teacherRepo: any;
  let studentRepo: any;
  let whitelistService: any;

  beforeEach(() => {
    teacherRepo = createMockRepo();
    studentRepo = createMockRepo();
    whitelistService = { isAllowed: jest.fn().mockResolvedValue(true) };
    service = new RegistrationService(
      teacherRepo,
      studentRepo,
      whitelistService,
    );
  });

  test('register - creates students and saves teacher', async () => {
    teacherRepo.findOne.mockResolvedValueOnce({
      email: 't@example.com',
      students: [],
    });

    // studentRepo returns null (not exist), then create/save will be called
    studentRepo.findOne.mockResolvedValue(null);
    studentRepo.create.mockImplementation((s) => s);
    studentRepo.save.mockImplementation(async (s) => ({
      ...s,
      id: Math.random(),
    }));
    teacherRepo.save.mockResolvedValue({});

    await service.register('t@example.com', [
      's1@example.com',
      's2@example.com',
    ]);

    expect(studentRepo.findOne).toHaveBeenCalledTimes(2);
    expect(studentRepo.save).toHaveBeenCalledTimes(2);
    expect(teacherRepo.save).toHaveBeenCalledTimes(1);
  });

  test('commonStudents - returns intersection', async () => {
    const t1 = { students: [{ email: 'a' }, { email: 'b' }] };
    const t2 = { students: [{ email: 'b' }, { email: 'c' }] };
    teacherRepo.find.mockResolvedValue([t1, t2]);

    const res = await service.commonStudents(['t1', 't2']);
    expect(res).toEqual(['b']);
  });

  test('suspend - throws when student not found', async () => {
    studentRepo.findOne.mockResolvedValue(null);
    await expect(service.suspend('nosuch@example.com')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  test('suspend - marks suspended true', async () => {
    const student = { email: 's@example.com', suspended: false };
    studentRepo.findOne.mockResolvedValue(student);
    studentRepo.save.mockResolvedValue({ ...student, suspended: true });

    await service.suspend('s@example.com');

    expect(studentRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ suspended: true }),
    );
  });

  test('retrieveForNotifications - collects registered and mentioned non-suspended students', async () => {
    const teacher = {
      students: [{ email: 'studentbob@gmail.com', suspended: false }],
    };
    teacherRepo.findOne.mockResolvedValue(teacher);

    // mentioned student exists and not suspended
    studentRepo.findOne.mockImplementation(({ where: { email } }) => {
      if (email === 'studentagnes@gmail.com')
        return Promise.resolve({ email, suspended: false });
      return Promise.resolve(null);
    });

    const recipients = await service.retrieveForNotifications(
      'teacherken@gmail.com',
      'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
    );

    expect(recipients).toEqual(
      expect.arrayContaining([
        'studentbob@gmail.com',
        'studentagnes@gmail.com',
      ]),
    );
  });
});
