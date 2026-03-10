const crypto = require('crypto');

function deriveKey() {
    const raw = process.env.PAYMENT_ENCRYPTION_KEY || process.env.JWT_SECRET || 'fallback_dev_key';
    return crypto.createHash('sha256').update(String(raw)).digest();
}

function encryptPaymentDetails(payload) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', deriveKey(), iv);
    const plaintext = JSON.stringify(payload || {});

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
        encrypted: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
    };
}

module.exports = {
    encryptPaymentDetails,
};
