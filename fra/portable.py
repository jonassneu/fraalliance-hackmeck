"""What differs between Unix and Windows, in one place.

File locks: lock_nowait takes an exclusive lock on an open file without waiting. The operating system releases it when
the process ends, also after a crash. On Unix fcntl.flock, on Windows msvcrt.locking (one byte of the file).

Replacing files: on Windows os.replace fails while any process has the target open for a moment, such as the web
server sending a page or a virus scanner checking a new file. install() makes it wait and try again (Windows only).

Text files: the modules read and write UTF-8 without saying so, which is the default on Unix but not on Windows. The
installer and ops/serve.py therefore start every process with PYTHONUTF8=1.
"""

import os
import sys
import time

try:
    import fcntl
except ModuleNotFoundError:   # Windows
    fcntl = None
    import msvcrt

REPLACE_WAITS_S = (0.05, 0.1, 0.2, 0.5, 1, 2, 4)


def _fd(f):
    return f if isinstance(f, int) else f.fileno()


def lock_nowait(f):
    """Exclusive lock on an open file (object or descriptor). BlockingIOError if someone else holds it."""
    fd = _fd(f)
    if fcntl:
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return
    os.lseek(fd, 0, os.SEEK_SET)
    try:
        msvcrt.locking(fd, msvcrt.LK_NBLCK, 1)
    except PermissionError as ex:
        raise BlockingIOError(*ex.args) from None


def unlock(f):
    fd = _fd(f)
    if fcntl:
        fcntl.flock(fd, fcntl.LOCK_UN)
        return
    os.lseek(fd, 0, os.SEEK_SET)
    msvcrt.locking(fd, msvcrt.LK_UNLCK, 1)


def install():
    """Windows only: os.replace retries for a few seconds while the target is held open."""
    if sys.platform != "win32":
        return
    plain = os.replace

    def replace(src, dst, **kw):
        for wait in REPLACE_WAITS_S:
            try:
                return plain(src, dst, **kw)
            except PermissionError:
                time.sleep(wait)
        return plain(src, dst, **kw)

    os.replace = replace
