type RateLimitRecord = {
    count: number;
    resetTime: number;
};

const trackers = new Map<string, Map<string, RateLimitRecord>>();

export function checkRateLimit(
    namespace: string,
    key: string,
    maxAttempts: number,
    windowMs: number
): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    let namespaceMap = trackers.get(namespace);
    if (!namespaceMap) {
        namespaceMap = new Map();
        trackers.set(namespace, namespaceMap);
    }

    // Nettoyage périodique simple
    if (namespaceMap.size > 10000) {
        for (const [k, v] of namespaceMap.entries()) {
            if (now > v.resetTime) {
                namespaceMap.delete(k);
            }
        }
    }

    const record = namespaceMap.get(key);
    if (!record || now > record.resetTime) {
        namespaceMap.set(key, { count: 1, resetTime: now + windowMs });
        return { allowed: true };
    }

    if (record.count >= maxAttempts) {
        const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, retryAfterSeconds };
    }

    record.count += 1;
    return { allowed: true };
}

export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }
    return '127.0.0.1';
}
