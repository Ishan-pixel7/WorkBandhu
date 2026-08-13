#!/usr/bin/env python3
"""
Simple link checker for local HTML files.
Checks relative `href` and `src` links and reports missing targets.
Ignores external links (http, mailto, tel, javascript).
"""
import os
import re
import sys
from html import unescape

over_root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pattern = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)

ignore_schemes = ('http://', 'https://', 'mailto:', 'tel:', 'javascript:')

broken = []
scanned = 0

for dirpath, dirnames, filenames in os.walk(over_root):
    for fname in filenames:
        if not fname.lower().endswith('.html'):
            continue
        scanned += 1
        fpath = os.path.join(dirpath, fname)
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as fh:
            txt = fh.read()
        matches = pattern.findall(txt)
        for href in matches:
            href = unescape(href).strip()
            if not href or href.startswith('#'):
                continue
            if href.startswith(ignore_schemes):
                continue
            # remove query string
            href_no_q = href.split('?', 1)[0]
            # handle absolute root-relative paths starting with /
            if href_no_q.startswith('/'):
                target = os.path.join(over_root, href_no_q.lstrip('/'))
            else:
                target = os.path.normpath(os.path.join(dirpath, href_no_q))
            # If link points to a directory, check for index.html
            if os.path.isdir(target):
                targ_file = os.path.join(target, 'index.html')
            else:
                targ_file = target
            if not os.path.exists(targ_file):
                broken.append((fpath, href, targ_file))
            else:
                # if fragment present, check target contains id/name
                if '#' in href:
                    frag = href.split('#',1)[1]
                    if frag:
                        try:
                            with open(targ_file, 'r', encoding='utf-8', errors='ignore') as tf:
                                targ_txt = tf.read()
                        except Exception:
                            targ_txt = ''
                        if (f'id="{frag}"' not in targ_txt) and (f"id='{frag}'" not in targ_txt) and (f'name="{frag}"' not in targ_txt) and (f"name='{frag}'" not in targ_txt):
                            broken.append((fpath, href + ' (missing fragment)', targ_file + ' (fragment:'+frag+')'))

# Print report
print('Link check report')
print('Root:', over_root)
print('HTML files scanned:', scanned)
print('Broken links found:', len(broken))
if broken:
    print('\nDetails:')
    for src, href, targ in broken:
        rel_src = os.path.relpath(src, over_root)
        print(f'- In {rel_src}: {href} -> expected {os.path.relpath(targ, over_root)}')
    sys.exit(2)
else:
    print('\nNo broken internal links found.')
    sys.exit(0)
