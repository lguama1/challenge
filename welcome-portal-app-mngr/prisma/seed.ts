import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const computers = [
    { serialNumber: 'SN001', operatingSystem: 'Windows' },
    { serialNumber: 'SN002', operatingSystem: 'macOS' },
    { serialNumber: 'SN003', operatingSystem: 'Linux' },
    { serialNumber: 'SN004', operatingSystem: 'Windows' },
    { serialNumber: 'SN005', operatingSystem: 'Linux' },
    { serialNumber: 'SN006', operatingSystem: 'Windows' },
    { serialNumber: 'SN007', operatingSystem: 'macOS' },
    { serialNumber: 'SN008', operatingSystem: 'Linux' },
    { serialNumber: 'SN009', operatingSystem: 'Windows' },
    { serialNumber: 'SN010', operatingSystem: 'macOS' },
    { serialNumber: 'SN011', operatingSystem: 'Linux' },
    { serialNumber: 'SN012', operatingSystem: 'Windows' },
    { serialNumber: 'SN013', operatingSystem: 'macOS' },
    { serialNumber: 'SN014', operatingSystem: 'Linux' },
    { serialNumber: 'SN015', operatingSystem: 'Windows' },
    { serialNumber: 'SN016', operatingSystem: 'macOS' },
    { serialNumber: 'SN017', operatingSystem: 'Linux' },
    { serialNumber: 'SN018', operatingSystem: 'Windows' },
    { serialNumber: 'SN019', operatingSystem: 'macOS' },
    { serialNumber: 'SN020', operatingSystem: 'Linux' },
    { serialNumber: 'SN021', operatingSystem: 'Windows' },
    { serialNumber: 'SN022', operatingSystem: 'macOS' },
    { serialNumber: 'SN023', operatingSystem: 'Linux' },
    { serialNumber: 'SN024', operatingSystem: 'Windows' },
    { serialNumber: 'SN025', operatingSystem: 'macOS' },
    { serialNumber: 'SN026', operatingSystem: 'Linux' },
    { serialNumber: 'SN027', operatingSystem: 'Windows' },
    { serialNumber: 'SN028', operatingSystem: 'macOS' },
    { serialNumber: 'SN029', operatingSystem: 'Linux' },
    { serialNumber: 'SN030', operatingSystem: 'Windows' },
    { serialNumber: 'SN031', operatingSystem: 'macOS' },
    { serialNumber: 'SN032', operatingSystem: 'Linux' },
    { serialNumber: 'SN033', operatingSystem: 'Windows' },
    { serialNumber: 'SN034', operatingSystem: 'macOS' },
    { serialNumber: 'SN035', operatingSystem: 'Linux' },
    { serialNumber: 'SN036', operatingSystem: 'Windows' },
    { serialNumber: 'SN037', operatingSystem: 'macOS' },
    { serialNumber: 'SN038', operatingSystem: 'Linux' },
    { serialNumber: 'SN039', operatingSystem: 'Windows' },
    { serialNumber: 'SN040', operatingSystem: 'macOS' },
    { serialNumber: 'SN041', operatingSystem: 'Linux' },
    { serialNumber: 'SN042', operatingSystem: 'Windows' },
    { serialNumber: 'SN043', operatingSystem: 'macOS' },
    { serialNumber: 'SN044', operatingSystem: 'Linux' },
    { serialNumber: 'SN045', operatingSystem: 'Windows' },
    { serialNumber: 'SN046', operatingSystem: 'macOS' },
    { serialNumber: 'SN047', operatingSystem: 'Linux' },
    { serialNumber: 'SN048', operatingSystem: 'Windows' },
    { serialNumber: 'SN049', operatingSystem: 'macOS' },
    { serialNumber: 'SN050', operatingSystem: 'Linux' },
  ];

  await prisma.computer.createMany({
    data: computers,
  });

  console.log('Database has been seeded with 50 computers.');
}

main()
  .catch((e) => {
    console.error(e);
   // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 