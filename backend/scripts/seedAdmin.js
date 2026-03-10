const User = require('../models/User');
const bcrypt = require('bcryptjs');

const TARGET_ADMIN_EMAIL = 'agritechse23@gmail.com';
const LEGACY_ADMIN_EMAIL = 'agrtitechse23@gmail.com';
const TARGET_ADMIN_PASSWORD = 'Admin@Agritech';

const seedAdmin = async () => {
    try {
        // Migrate legacy typo email to the intended admin email once.
        const legacyAdmin = await User.findOne({ email: LEGACY_ADMIN_EMAIL, role: 'ADMIN' });
        if (legacyAdmin) {
            legacyAdmin.email = TARGET_ADMIN_EMAIL;
            await legacyAdmin.save();
            console.log('Admin email updated from legacy value.');
        }

        const existingAdmin = await User.findOne({ email: TARGET_ADMIN_EMAIL, role: 'ADMIN' });
        if (existingAdmin) {
            // Keep dev/admin seed deterministic: heal password drift to default credential.
            const currentAdminWithPassword = await User.findById(existingAdmin._id).select('+password');
            const passwordMatches = await currentAdminWithPassword.matchPassword(TARGET_ADMIN_PASSWORD);
            if (!passwordMatches) {
                currentAdminWithPassword.password = TARGET_ADMIN_PASSWORD;
                currentAdminWithPassword.isActive = true;
                currentAdminWithPassword.isFirstLogin = false;
                await currentAdminWithPassword.save();
                console.log('Admin password restored to default seed credential.');
            }
            console.log('Admin account already exists.');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(TARGET_ADMIN_PASSWORD, salt);

        await User.create({
            name: 'Admin',
            email: TARGET_ADMIN_EMAIL,
            phone: '9999999999',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            isFirstLogin: false,
        });

        console.log('Default Admin account seeded successfully.');
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

module.exports = seedAdmin;
