class OCRService {
    generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    generateReferralCode = () => {
        let referralCode = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < 8; i++) {
            referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return referralCode;
    }
}

module.exports = { OCRService };