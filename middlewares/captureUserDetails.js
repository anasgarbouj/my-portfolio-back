const SessionDetails = require('../models/UserDetails'); // Ensure this path matches where you've saved your model

const captureSessionDetails = async (req, res, next) => {
    const ip = requestIp.getClientIp(req);
    const ua = useragent.parse(req.headers['user-agent']);
    const locationData = await getLocationData(ip);

    const sessionDetails = new SessionDetails({
        ip,
        device: ua.toString(),
        location: {
            city: locationData.city,
            region: locationData.region,
            country: locationData.country
        }
    });

    try {
        // Save the session details to MongoDB
        await sessionDetails.save();
        next(); // Proceed with the next middleware or route handler
    } catch (error) {
        console.error('Failed to save session details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = captureSessionDetails;
