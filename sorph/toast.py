"""The language just picked with the quick keys: the dashboard's gallery card
for it turns in, in the middle of the screen, over nothing (the window and
the page are clear). Each new pick turns the next card in; letting go of the
key turns it away (or a second after the last pick, if the key stays held).

The card is painted by the dashboard's own code: ui/language-card.html with
ui/dist/language-card.js (`npm run build:card` in ui/)."""

import json
import os

import objc
from AppKit import (NSColor, NSMakeRect, NSScreen, NSStatusWindowLevel,
                    NSWindow, NSWindowStyleMaskBorderless,
                    NSBackingStoreBuffered)
from Foundation import (NSObject, NSRunLoop, NSRunLoopCommonModes, NSTimer,
                        NSURL)
from PyObjCTools import AppHelper

import languages
import settings
import translate

HOLD_SEC = 1.0          # after the last pick, if the key is still held
TURN_IN = 0.45
TURN_OUT = 0.25
CARD_W, CARD_H = 220, 275               # the gallery card (256 × 320 units)
WIN_W, WIN_H = CARD_W + 160, CARD_H + 140   # room for the turn and the shadow
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "ui", "language-card.html")


def card_for(speak, write=""):
    """The preset the dashboard shows for this language (or pair) and its
    place in the gallery, which picks the card's colours."""
    write = write or ""
    preset = {
        "speak": speak, "write": write,
        "speakName": languages.english_name(speak),
        "writeName": translate.english_name(write) if write else "",
        "speakNative": languages.native_name(speak),
        "writeNative": translate.native_name(write) if write else "",
    }
    if not write:
        enabled = settings.get_languages()
        if speak not in enabled:
            enabled.append(speak)
        return preset, enabled.index(speak)
    pairs = [p for p in settings.get_presets() if p.get("write")]
    for i, p in enumerate(pairs):
        if p["speak"] == speak and p["write"] == write:
            return preset, i
    preset["unsaved"] = True            # the dashboard's "not saved" card, last
    return preset, len(pairs)


class Toast(NSObject):
    def init(self):
        self = objc.super(Toast, self).init()
        if self is None:
            return None
        self.window = None
        self.web = None
        self.timer = None
        self.generation = 0
        return self

    @objc.python_method
    def show(self, speak, write=""):
        """Turn in the card for `speak` (→ `write`). Safe from any thread."""
        try:
            preset, index = card_for(speak, write)
        except Exception as exc:
            print(f"warning: no language card ({exc})", flush=True)
            return
        AppHelper.callAfter(self._show, preset, index)

    @objc.python_method
    def hide(self):
        """Turn the card away now (the language is picked). Any thread."""
        AppHelper.callAfter(self._hide, None)

    @objc.python_method
    def _build(self):
        from WebKit import WKWebView, WKWebViewConfiguration
        w = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
            NSMakeRect(0, 0, WIN_W, WIN_H), NSWindowStyleMaskBorderless,
            NSBackingStoreBuffered, False)
        w.setOpaque_(False)
        w.setBackgroundColor_(NSColor.clearColor())
        w.setHasShadow_(False)          # the page draws the card's shadow
        w.setLevel_(NSStatusWindowLevel)
        w.setIgnoresMouseEvents_(True)
        w.setCollectionBehavior_(1 << 0 | 1 << 4 | 1 << 8)  # all spaces, stationary, full screen aux
        web = WKWebView.alloc().initWithFrame_configuration_(
            NSMakeRect(0, 0, WIN_W, WIN_H),
            WKWebViewConfiguration.alloc().init())
        try:
            web.setValue_forKey_(False, "drawsBackground")
        except Exception:
            pass
        w.setContentView_(web)
        web.loadFileURL_allowingReadAccessToURL_(
            NSURL.fileURLWithPath_(PAGE),
            NSURL.fileURLWithPath_(os.path.dirname(PAGE)))
        self.window, self.web = w, web

    @objc.python_method
    def prepare(self):
        """Load the page ahead of the first pick (main thread)."""
        if self.window is None and os.path.exists(PAGE):
            self._build()

    @objc.python_method
    def _later(self, seconds, fn):
        """A timer that also fires while a menu or a drag holds the run loop."""
        if self.timer is not None:
            self.timer.invalidate()
        self.timer = NSTimer.timerWithTimeInterval_repeats_block_(
            seconds, False, lambda _t: fn())
        NSRunLoop.mainRunLoop().addTimer_forMode_(self.timer, NSRunLoopCommonModes)

    @objc.python_method
    def _js(self, code):
        self.web.evaluateJavaScript_completionHandler_(code, None)

    @objc.python_method
    def _show(self, preset, index):
        if self.window is None:
            self.prepare()
            if self.window is None:
                return              # the page is not built
        self.generation += 1
        gen = self.generation
        screen = NSScreen.mainScreen().frame()
        self.window.setFrameOrigin_((
            round(screen.origin.x + (screen.size.width - WIN_W) / 2),
            round(screen.origin.y + (screen.size.height - WIN_H) / 2)))
        self.window.orderFrontRegardless()
        self._js(f"window.card && window.card.show({json.dumps(preset)}, {int(index)})")
        self._later(TURN_IN + HOLD_SEC, lambda: self._hide(gen))

    @objc.python_method
    def _hide(self, gen):
        if self.window is None or not self.window.isVisible():
            return
        if gen is not None and gen != self.generation:
            return              # another pick came in: it holds longer
        self.generation += 1
        gen = self.generation
        self._js("window.card && window.card.hide()")
        self._later(TURN_OUT + 0.08, lambda: self._close(gen))

    @objc.python_method
    def _close(self, gen):
        if gen == self.generation:
            self.window.orderOut_(None)
