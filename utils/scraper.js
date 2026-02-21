import * as cheerio from 'cheerio';

export async function scrapeUrl(url) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove script, style, and navigation elements to reduce noise
        $('script, style, nav, footer, header, aside').remove();

        // extract text from body
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        // Limit length to avoid token limits (approx 10k chars)
        return text.substring(0, 10000);
    } catch (error) {
        console.error("Scraping Error:", error);
        return `Error retrieving content from URL: ${error.message}`;
    }
}
