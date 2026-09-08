from pathlib import Path
import re

p = Path('scripts/validate_website_content_alignment.mjs')
s = p.read_text(encoding='utf-8')
# The patcher intentionally generates this validator from a Python triple-quoted
# string. Normalize any accidental literal newline inside fail.join('...').
s = re.sub(r"fail\.join\('\s*'\)", "fail.join(String.fromCharCode(10))", s, flags=re.S)
p.write_text(s, encoding='utf-8')
print('Normalized generated website alignment validator')
