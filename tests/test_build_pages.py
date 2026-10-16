import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'build_pages.py'
SPEC = importlib.util.spec_from_file_location('build_pages', SCRIPT)
build_pages = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(build_pages)


class HostedMediaTests(unittest.TestCase):
    def test_external_media_survives_root_and_subpath_builds(self):
        legacy = build_pages.LEGACY
        primary = build_pages.PRIMARY
        video = legacy + '/media/dubai-creative-film.mp4'
        poster = legacy + '/media/dubai-creative-film-poster.jpg'
        page = '/films/dubai-creative-film.html'
        inputs = {
            'content.json': json.dumps({
                'video': video,
                'poster': poster,
                'page': legacy + page,
                'localVideo': '/media/memory-walk-web.mp4',
            }),
            'film.html': (
                f'<link rel="canonical" href="{legacy}{page}">'
                f'<meta property="og:url" content="{primary}{page}">'
                f'<video poster="{poster}"><source src="{video}"></video>'
                '<script type="application/ld+json">' + json.dumps({
                    '@type': 'VideoObject', 'contentUrl': video,
                    'thumbnailUrl': [poster], 'creator': {'@id': legacy + '/#person'},
                }) + '</script>'
                '<a href="/films/">All films</a>'
            ),
            'video-sitemap.xml': (
                f'<url><loc>{primary}{page}</loc><video:video>'
                f'<video:content_loc>{video}</video:content_loc>'
                f'<video:thumbnail_loc>{poster}</video:thumbnail_loc>'
                '</video:video></url>'
            ),
            'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {legacy}/sitemap.xml\n',
        }
        for site_url in (primary, 'https://example.com/portfolio'):
            with self.subTest(site_url=site_url), tempfile.TemporaryDirectory(dir=Path(__file__).parent) as folder:
                source = Path(folder) / 'dist'
                destination = Path(folder) / '_site'
                source.mkdir()
                for name, text in inputs.items():
                    (source / name).write_text(text, encoding='utf-8')
                build_pages.build(source, destination, site_url)

                content = json.loads((destination / 'content.json').read_text(encoding='utf-8'))
                self.assertEqual(content['video'], video)
                self.assertEqual(content['poster'], poster)
                self.assertEqual(content['page'], site_url + page)
                base = '/portfolio' if site_url.endswith('/portfolio') else ''
                self.assertEqual(content['localVideo'], base + '/media/memory-walk-web.mp4')
                html = (destination / 'film.html').read_text(encoding='utf-8')
                self.assertIn(f'rel="canonical" href="{site_url}{page}"', html)
                self.assertIn(f'property="og:url" content="{site_url}{page}"', html)
                self.assertIn(f'"@id": "{site_url}/#person"', html)
                self.assertIn(f'href="{base}/films/"', html)
                for name in ('film.html', 'video-sitemap.xml'):
                    output = (destination / name).read_text(encoding='utf-8')
                    self.assertIn(video, output)
                    self.assertIn(poster, output)
                    self.assertNotIn(legacy + page, output)
                sitemap = (destination / 'video-sitemap.xml').read_text(encoding='utf-8')
                self.assertIn(f'<loc>{site_url}{page}</loc>', sitemap)
                robots = (destination / 'robots.txt').read_text(encoding='utf-8')
                self.assertIn(f'Sitemap: {site_url}/sitemap.xml', robots)
                self.assertTrue((destination / '.nojekyll').is_file())
                for name, text in inputs.items():
                    self.assertEqual((source / name).read_text(encoding='utf-8'), text)


if __name__ == '__main__':
    unittest.main()
