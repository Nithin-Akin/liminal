from html.parser import HTMLParser
from urllib.parse import urlparse
import httpx
from app.services.extraction import extract_facts

class _Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts=[]; self.skip=0
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript"}: self.skip += 1
    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript"} and self.skip: self.skip -= 1
    def handle_data(self, data):
        if not self.skip and data.strip(): self.parts.append(data.strip())

def verify_url(url: str) -> dict:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Only public http(s) URLs are supported")
    response = httpx.get(url, headers={"User-Agent": "LiminalResearch/0.1"}, timeout=20, follow_redirects=True)
    response.raise_for_status()
    parser = _Text(); parser.feed(response.text)
    text = " ".join(parser.parts)
    return {"url": str(response.url), "status": response.status_code, "title": text[:180], "text": text[:12000], "source_type": "retrieved_web_page", "extraction": extract_facts(text, "unknown")}
