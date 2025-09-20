#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AgroMarket.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Couldn't import Django...") from exc

    if len(sys.argv) == 1:
        sys.argv += ['runserver', '4000']
    elif sys.argv[1] == 'runserver' and len(sys.argv) == 2:
        sys.argv += ['4000']

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
