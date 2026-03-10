import re

with open('frontend/src/features/auth/components/LoginForm.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix conflict 1 (header comment)
text = re.sub(
    r'<<<<<<< HEAD\n(.*?)\n=======\n>>>>>>> [a-f0-9]+',
    r'\1',
    text,
    flags=re.DOTALL
)

# Fix conflict 2 (login response userRole mapping)
text = re.sub(
    r'<<<<<<< HEAD\n\s*const userRole = res\.data\.user\.role;\n\s*=======\n>>>>>>> [a-f0-9]+\n(.*?)\n<<<<<<< HEAD\n\s*navigate\(getRoleHomePath\(userRole\)\);\n=======\n\s*navigate\(getRoleHomePath\(res\.data\.user\.role\)\);\n>>>>>>> [a-f0-9]+',
    r'\1\n        navigate(getRoleHomePath(res.data.user.role));',
    text,
    flags=re.DOTALL
)

# Fix conflict 3 (Welcome back text and double forms logic)
# There is a large block starting with <<<<<<< HEAD ... Welcome back ... ======= ... admin-login ... >>>>>> 
def fix_form(match):
    # we just want to keep the Mode version from ======= onwards
    return match.group(1)

text = re.sub(
    r'<<<<<<< HEAD\n\s*<h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">\n\s*<T>Welcome back</T>.*?<form className="space-y-5" onSubmit=\{handleLogin\}>.*?</form>\n=======\n(.*?)\n>>>>>>> [a-f0-9]+',
    fix_form,
    text,
    flags=re.DOTALL
)

with open('frontend/src/features/auth/components/LoginForm.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

