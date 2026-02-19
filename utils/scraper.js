import * as cheerio from 'cheerio';

export async function scrapeUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
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
