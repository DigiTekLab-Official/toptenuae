/** Reorder existing Portable Text blocks, preserving text, annotations and links.
 * Unrecognised sections remain in the lower buying guide; no copy is generated.
 */
type Block = { _type?: string; style?: string; children?: { _type?: string; text?: string }[]; [key: string]: any };
type Section = 'quickAnswer' | 'checks' | 'guide' | 'editorial' | 'methodology' | 'sources';
const blocks = (value: unknown): Block[] => Array.isArray(value) ? value.filter(Boolean) : [];
const text = (block: Block) => (block.children || []).map(child => child.text || '').join('').trim();

export function splitBuyingGuideContent(body: unknown, closing: unknown) {
  const result: Record<Section, Block[]> = { quickAnswer: [], checks: [], guide: [], editorial: [], methodology: [], sources: [] };
  for (const [content, defaultSection] of [[body, 'editorial'], [closing, 'guide']] as const) {
    let section: Section = defaultSection;
    for (const block of blocks(content)) {
      const heading = /^h[2-6]$/.test(block.style || '');
      const title = text(block);
      if (heading) {
        if (/^(?:the )?(?:quick|short) answer\b|^which .+ should you buy\??$/i.test(title)) section = 'quickAnswer';
        else if (/^(?:uae (?:buying|ownership) checks?|uae (?:buying|ownership) checklist)$/i.test(title)) section = 'checks';
        else if (/^(?:how (?:we |these recommendations)|our methodology|methodology|testing disclosure|evidence hierarchy|what we looked for)/i.test(title)) section = 'methodology';
        else if (/^(?:sources|product documentation|references)(?:\b|\s*[:—])/i.test(title)) section = 'sources';
        else if (/^h2$/.test(block.style || '') || section === 'quickAnswer' || section === 'checks') section = defaultSection;
        // The template supplies these two headings; retain all their content blocks.
        if (section === 'quickAnswer' || section === 'checks') continue;
      }
      result[section].push(block);
    }
  }
  // Only promote genuinely concise checklists. Long context stays in the guide.
  if (result.checks.length > 6 || result.checks.map(text).join(' ').length > 1400) {
    result.guide.push({ _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'UAE buying checks' }], markDefs: [] }, ...result.checks);
    result.checks = [];
  }
  return result;
}
