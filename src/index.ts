import { executeOperation } from "./tool-call";

type RawEvent = {
    body: string;
}

type ParsedEvent = {
    args: Record<string, string>;
    secrets: Record<string, string>;
}

export async function handler(event: RawEvent) {
    const { args, secrets } = JSON.parse(event.body) as ParsedEvent;
    
    const apiKey = secrets.OLOSTEP_API_KEY;
    
    if (!apiKey) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "OLOSTEP_API_KEY is required" }),
        };
    }

    try {
        const result = await executeOperation(args, apiKey);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error: unknown) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: message }),
        };
    }
}

