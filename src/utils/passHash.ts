import crypto from 'crypto';

const hashPass = (password: string) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

export { hashPass };