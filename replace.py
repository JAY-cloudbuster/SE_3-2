import re

with open('frontend/src/features/auth/components/LoginForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer1(match):
    return match.group(1) # keeping head comment

content = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n>>>>>>> [a-z0-9]+', replacer1, content, flags=re.DOTALL)

def replacer2(match):
    return '' # dropping userRole = res.data.user.role

content = re.sub(r'<<<<<<< HEAD\n\s*const userRole = res\.data\.user\.role;\n\s*=======\n>>>>>>> [a-z0-9]+', replacer2, content)

def replacer3(match):
    return '      navigate(getRoleHomePath(res.data.user.role));'

content = re.sub(r'<<<<<<< HEAD\n\s*navigate\(getRoleHomePath\(userRole\)\);\n=======\n\s*navigate\(getRoleHomePath\(res\.data\.user\.role\)\);\n>>>>>>> [a-z0-9]+', replacer3, content)

with open('frontend/src/features/auth/components/LoginForm.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done basic replacements')
