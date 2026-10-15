"""Create a project-path-aware GitHub Pages copy without changing dist/."""
import os
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit


def build(source=Path('dist'), destination=Path('_site'), site_url=None):
    site_url = (site_url or os.environ['SITE_URL']).rstrip('/')
    parsed = urlsplit(site_url)
    if parsed.scheme != 'https' or not parsed.netloc:
        raise ValueError('SITE_URL must be an absolute HTTPS URL')
    base = parsed.path.rstrip('/')
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination)
    text_types = {'.html', '.css', '.js', '.json', '.xml', '.txt', '.webmanifest'}
    for path in destination.rglob('*'):
        if not path.is_file() or path.suffix not in text_types:
            continue
        text = path.read_text(encoding='utf-8')
        text = text.replace('https://vansh-rastogi-film.unscriptedstorylab.chatgpt.site', site_url)
        if base:
            # HTML attributes; quoted JS/JSON paths; CSS url() references.
            if path.suffix == '.html':
                text = re.sub(r'''(\b(?:href|src|poster|action)=["'])/(?!/)''', lambda m: m[1] + base + '/', text)
            if path.suffix in {'.js', '.json', '.webmanifest'}:
                text = re.sub(r'''(["'`])/(?!/)''', lambda m: m[1] + base + '/', text)
            if path.suffix == '.css':
                text = re.sub(r'''(url\(["']?)/(?!/)''', lambda m: m[1] + base + '/', text)
            if path.name == 'robots.txt':
                text = re.sub(r'(?m)^(Allow|Disallow): /(.*)$', lambda m: m[1] + ': ' + base + '/' + m[2], text)
        path.write_text(text, encoding='utf-8')
    (destination / '.nojekyll').touch()
    print('Prepared GitHub Pages artifact:', destination)


if __name__ == '__main__':
    build()
