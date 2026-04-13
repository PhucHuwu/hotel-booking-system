import { PrismaClient, Role, RoomStatus, PricingType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const customerHash = await bcrypt.hash('Customer@123', 12);
  const receptionistHash = await bcrypt.hash('Staff@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      passwordHash: adminHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
      phone: '0900000000',
    },
  });

  const customers = [
    {
      email: 'customer1@hotel.com',
      firstName: 'Nguyen',
      lastName: 'Van A',
      phone: '0911111111',
    },
    {
      email: 'customer2@hotel.com',
      firstName: 'Tran',
      lastName: 'Thi B',
      phone: '0922222222',
    },
    {
      email: 'customer3@hotel.com',
      firstName: 'Le',
      lastName: 'Van C',
      phone: '0933333333',
    },
  ];

  for (const c of customers) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        ...c,
        passwordHash: customerHash,
        role: Role.CUSTOMER,
      },
    });
  }

  const receptionists = [
    {
      email: 'receptionist1@hotel.com',
      firstName: 'Pham',
      lastName: 'Thi D',
      phone: '0944444444',
    },
    {
      email: 'receptionist2@hotel.com',
      firstName: 'Hoang',
      lastName: 'Van E',
      phone: '0955555555',
    },
  ];

  for (const r of receptionists) {
    await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: {
        ...r,
        passwordHash: receptionistHash,
        role: Role.RECEPTIONIST,
      },
    });
  }

  const standardType = await prisma.roomType.upsert({
    where: { id: 'roomtype-standard' },
    update: {},
    create: {
      id: 'roomtype-standard',
      name: 'Standard',
      description: 'Phòng tiêu chuẩn thoải mái với đầy đủ tiện nghi cơ bản.',
      maxGuests: 2,
      areaSqm: 25,
      bedType: 'Double',
      amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Bàn làm việc'],
      images: ['/images/standard-1.jpg', '/images/standard-2.jpg'],
    },
  });

  const deluxeType = await prisma.roomType.upsert({
    where: { id: 'roomtype-deluxe' },
    update: {},
    create: {
      id: 'roomtype-deluxe',
      name: 'Deluxe',
      description: 'Phòng Deluxe sang trọng với view đẹp và tiện nghi cao cấp.',
      maxGuests: 3,
      areaSqm: 35,
      bedType: 'King',
      amenities: ['WiFi', 'TV 55"', 'Điều hòa', 'Tủ lạnh Minibar', 'Bàn làm việc', 'Bồn tắm'],
      images: ['/images/deluxe-1.jpg', '/images/deluxe-2.jpg'],
    },
  });

  const suiteType = await prisma.roomType.upsert({
    where: { id: 'roomtype-suite' },
    update: {},
    create: {
      id: 'roomtype-suite',
      name: 'Suite',
      description: 'Phòng Suite cao cấp với phòng khách riêng và toàn bộ tiện nghi hạng nhất.',
      maxGuests: 4,
      areaSqm: 60,
      bedType: 'King + Sofa Bed',
      amenities: [
        'WiFi',
        'TV 65"',
        'Điều hòa 2 chiều',
        'Minibar',
        'Phòng khách riêng',
        'Jacuzzi',
        'Butler service',
      ],
      images: ['/images/suite-1.jpg', '/images/suite-2.jpg'],
    },
  });

  await prisma.pricingRule.createMany({
    skipDuplicates: true,
    data: [
      {
        roomTypeId: standardType.id,
        type: PricingType.DEFAULT,
        pricePerNight: 800000,
        priority: 0,
      },
      {
        roomTypeId: standardType.id,
        type: PricingType.SEASONAL,
        pricePerNight: 1000000,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-08-31'),
        priority: 1,
      },
      {
        roomTypeId: standardType.id,
        type: PricingType.HOLIDAY,
        pricePerNight: 1200000,
        startDate: new Date('2026-12-25'),
        endDate: new Date('2026-12-31'),
        priority: 2,
      },
      {
        roomTypeId: deluxeType.id,
        type: PricingType.DEFAULT,
        pricePerNight: 1500000,
        priority: 0,
      },
      {
        roomTypeId: deluxeType.id,
        type: PricingType.SEASONAL,
        pricePerNight: 1800000,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-08-31'),
        priority: 1,
      },
      {
        roomTypeId: deluxeType.id,
        type: PricingType.HOLIDAY,
        pricePerNight: 2200000,
        startDate: new Date('2026-12-25'),
        endDate: new Date('2026-12-31'),
        priority: 2,
      },
      {
        roomTypeId: suiteType.id,
        type: PricingType.DEFAULT,
        pricePerNight: 3000000,
        priority: 0,
      },
      {
        roomTypeId: suiteType.id,
        type: PricingType.SEASONAL,
        pricePerNight: 3500000,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-08-31'),
        priority: 1,
      },
      {
        roomTypeId: suiteType.id,
        type: PricingType.HOLIDAY,
        pricePerNight: 4500000,
        startDate: new Date('2026-12-25'),
        endDate: new Date('2026-12-31'),
        priority: 2,
      },
    ],
  });

  const roomsData = [
    {
      roomNumber: '101',
      floor: 1,
      roomTypeId: standardType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '102',
      floor: 1,
      roomTypeId: standardType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '103',
      floor: 1,
      roomTypeId: standardType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '104',
      floor: 1,
      roomTypeId: standardType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '105',
      floor: 1,
      roomTypeId: standardType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '201',
      floor: 2,
      roomTypeId: standardType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '202',
      floor: 2,
      roomTypeId: deluxeType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '203',
      floor: 2,
      roomTypeId: deluxeType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '204',
      floor: 2,
      roomTypeId: deluxeType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '205',
      floor: 2,
      roomTypeId: deluxeType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '301',
      floor: 3,
      roomTypeId: deluxeType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '302',
      floor: 3,
      roomTypeId: suiteType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '303',
      floor: 3,
      roomTypeId: suiteType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '304',
      floor: 3,
      roomTypeId: suiteType.id,
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '305',
      floor: 3,
      roomTypeId: suiteType.id,
      status: RoomStatus.AVAILABLE,
    },
  ];

  for (const room of roomsData) {
    await prisma.room.upsert({
      where: { roomNumber: room.roomNumber },
      update: {},
      create: room,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
