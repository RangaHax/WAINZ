
# import os

# PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
# settings_module = "%s.settings" % PROJECT_ROOT.split(os.sep)[-1]

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

# from django.core.wsgi import get_wsgi_application
# application = get_wsgi_application()
import os
import sys



PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIRNAME = PROJECT_ROOT.split(os.sep)[-1]

# <path_to_virtualenv> - replace this with the actual path
# site.addsitedir('/u/students/goldsbjohn/wainztest/lib/python2.7/site-packages/')

sys.path.append(os.path.join(PROJECT_ROOT, ".."))

settings_module = "%s.settings" % PROJECT_DIRNAME
os.environ["DJANGO_SETTINGS_MODULE"] = settings_module

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()