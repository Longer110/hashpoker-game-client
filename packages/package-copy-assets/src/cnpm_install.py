#!/usr/bin/python
# -*- coding:utf8 -*-

import os
import subprocess
from os.path import basename, isdir

WORKSPACE = os.getcwd()
print("WORKSPACE:\"%s\"" % WORKSPACE)

def npm_install():
    cmd = "cnpm install"
    os.system(cmd)

if __name__ == '__main__':
    npm_install()
    
