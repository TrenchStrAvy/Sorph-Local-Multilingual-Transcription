"""The hand-off with Muxpane (the agents bar that reads coding agents aloud).

While Muxpane offers to send an answer to one of its agents, it keeps
answer-target.json in its support folder: the tmux pane, the agent's name,
and Muxpane's pid. When Sorph's key goes down and that file is there (and
Muxpane is still running), this dictation is for that agent: the words show
in the overlay's card instead of being typed, the orb takes Muxpane's
colours with a small "→ name · pane" caption, and the finished text goes
back to Muxpane as an event file, which sends it to the pane.

Sorph announces that it knows this in sorph.json, so Muxpane stops opening
its own reply field for Sorph to type into. Every step is best-effort: when
Muxpane is not installed nothing here does anything.
"""

import json
import os
import time

FOLDER = os.path.expanduser("~/Library/Application Support/Muxpane")


def _target_path():
    return os.path.join(FOLDER, "answer-target.json")


def _sorph_path():
    return os.path.join(FOLDER, "sorph.json")


def _alive(pid) -> bool:
    try:
        pid = int(pid)
    except (TypeError, ValueError):
        return False
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True                 # exists, owned by someone else
    except OSError:
        return False
    return True


def announce() -> bool:
    """Tell Muxpane this Sorph takes the hand-off (only if Muxpane is
    installed: its folder is never created here)."""
    if not os.path.isdir(FOLDER):
        return False
    try:
        tmp = _sorph_path() + ".%d.tmp" % os.getpid()
        with open(tmp, "w") as f:
            json.dump({"handoff": 1, "pid": os.getpid()}, f)
        os.replace(tmp, _sorph_path())
        return True
    except OSError:
        return False


def withdraw():
    """Sorph is quitting: remove the announcement if it is ours."""
    try:
        with open(_sorph_path()) as f:
            if json.load(f).get("pid") != os.getpid():
                return
        os.remove(_sorph_path())
    except (OSError, ValueError, AttributeError):
        pass


def read_target():
    """The agent Muxpane would send this dictation to, or None:
    {"pane": "%22", "name": "Muxpane"}."""
    try:
        with open(_target_path()) as f:
            data = json.load(f)
    except (OSError, ValueError):
        return None
    if not isinstance(data, dict):
        return None
    pane, name = data.get("pane"), data.get("name")
    if not (isinstance(pane, str) and pane and isinstance(name, str)):
        return None
    if not _alive(data.get("pid")):
        return None                 # left behind by a Muxpane that is gone
    return {"pane": pane, "name": name}


def caption(target) -> str:
    return f"→ {target['name']} · {target['pane']}"


def deliver(target, text: str) -> bool:
    """Hand the finished dictation to Muxpane, which sends it to the pane.
    Written as a .tmp file and renamed, so Muxpane never reads half."""
    text = (text or "").strip()
    if not text or not target:
        return False
    folder = os.path.join(FOLDER, "events")
    if not os.path.isdir(folder):
        return False
    event = {"hook_event_name": "SorphReply", "pane": target["pane"],
             "text": text, "ts": time.time()}
    name = "%d-sorph" % time.time_ns()
    tmp = os.path.join(folder, name + ".tmp")
    try:
        with open(tmp, "w") as f:
            json.dump(event, f)
        os.replace(tmp, os.path.join(folder, name + ".json"))
        return True
    except OSError:
        try:
            os.remove(tmp)
        except OSError:
            pass
        return False


# -- Muxpane asks (fn N twice): show the card now, before the key goes down

ASK = "app.muxpane.MuxpaneAsk"
ASK_END = "app.muxpane.MuxpaneAskEnd"


def ask_target(info):
    """The {"name", "pane"} of an ask notification's userInfo, or None."""
    try:
        pane, name = info.get("pane"), info.get("name")
    except AttributeError:
        return None
    if not (pane and name):
        return None
    return {"pane": str(pane), "name": str(name)}


_Watcher = None


def _watcher_class():
    """The Cocoa observer class, made once (Objective-C class names are
    global, so it cannot be defined again)."""
    global _Watcher
    if _Watcher is None:
        from Foundation import NSObject

        class MuxpaneAskWatcher(NSObject):
            def asked_(self, note):
                target = ask_target(note.userInfo() or {})
                if target is not None:
                    self.on_ask(target)

            def ended_(self, _note):
                self.on_end()

        _Watcher = MuxpaneAskWatcher
    return _Watcher


def watch_asks(on_ask, on_end):
    """Calls on_ask(target) / on_end() on the main thread when Muxpane asks
    for an answer or withdraws it. Keep the returned object alive."""
    from Foundation import NSDistributedNotificationCenter
    watcher = _watcher_class().alloc().init()
    watcher.on_ask, watcher.on_end = on_ask, on_end
    center = NSDistributedNotificationCenter.defaultCenter()
    center.addObserver_selector_name_object_(watcher, b"asked:", ASK, None)
    center.addObserver_selector_name_object_(watcher, b"ended:", ASK_END, None)
    return watcher
