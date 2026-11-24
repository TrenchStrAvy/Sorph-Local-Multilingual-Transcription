"""The transcript card above the orb, in a window of its own so it always
sits fully on screen: placed over the orb, then pulled inside the screen's
visible frame wherever the orb is (a corner, the bottom centre, dragged half
off an edge).

Two looks:
  * plain: the words as they are heard, for a dictation into the app in front
  * muxpane: the words go to one of Muxpane's agents. A dark card with a deep
    pink rim (the split orb's accent), a header naming the agent, the words
    in a larger size, and a quiet status (listening… transcribing… sent).
"""

import objc
from AppKit import (
    NSAttributedString,
    NSBackingStoreBuffered,
    NSBezierPath,
    NSColor,
    NSFont,
    NSFontAttributeName,
    NSFontWeightMedium,
    NSFontWeightSemibold,
    NSForegroundColorAttributeName,
    NSGradient,
    NSGraphicsContext,
    NSLineBreakByTruncatingTail,
    NSMutableAttributedString,
    NSMutableParagraphStyle,
    NSParagraphStyleAttributeName,
    NSScreen,
    NSStatusWindowLevel,
    NSStrikethroughStyleAttributeName,
    NSStringDrawingUsesLineFragmentOrigin,
    NSUnderlineStyleSingle,
    NSView,
    NSWindow,
    NSWindowCollectionBehaviorCanJoinAllSpaces,
    NSWindowCollectionBehaviorStationary,
    NSWindowStyleMaskBorderless,
)
from Foundation import (NSMakePoint, NSMakeRect, NSMakeSize, NSObject,
                        NSRunLoop, NSRunLoopCommonModes, NSString, NSTimer)
from Quartz import CGContextSetBlendMode, kCGBlendModeDestinationOut

# plain card (as before: 520 wide, 13 pt, three lines)
PLAIN_W = 520
PLAIN_FONT = 13.0
PLAIN_LINES = 3
PAD = 12
CORNER = 14
# muxpane card
MUX_W = 440
MUX_FONT = 15.0
MUX_LINES = 3
MUX_PAD_X = 16
MUX_HEADER = 30           # header row, from the card's top edge
MUX_PAD_BOTTOM = 14
EDGE = 12                 # kept clear of the screen's edges
GAP = 6                   # between the card and the orb
LINGER_SEC = 0.9          # "sent" stays this long after the orb goes
FADE_SEC = 0.25


def _line_height(font_size):
    font = NSFont.systemFontOfSize_(font_size)
    return font.ascender() - font.descender() + font.leading()


def _room(lines, font_size):
    """Height for `lines` wrapped lines, with the slack text layout needs."""
    return lines * font_size * 1.45


def _attrs(style, size, ink=0.97):
    para = NSMutableParagraphStyle.alloc().init()
    para.setLineBreakMode_(0)           # word wrap
    attrs = {NSFontAttributeName: NSFont.systemFontOfSize_(size),
             NSParagraphStyleAttributeName: para}
    if style == "removed":
        attrs[NSForegroundColorAttributeName] = \
            NSColor.colorWithCalibratedWhite_alpha_(ink, 0.35)
        attrs[NSStrikethroughStyleAttributeName] = NSUnderlineStyleSingle
    elif style == "changed":
        attrs[NSForegroundColorAttributeName] = \
            NSColor.colorWithCalibratedRed_green_blue_alpha_(1.0, 0.85, 0.45, 1.0)
    elif style == "dim":
        attrs[NSForegroundColorAttributeName] = \
            NSColor.colorWithCalibratedWhite_alpha_(ink, 0.45)
    else:
        attrs[NSForegroundColorAttributeName] = \
            NSColor.colorWithCalibratedWhite_alpha_(ink, 0.95)
    return attrs


def _fit(words, width, max_h, size):
    """The words as one attributed string, dropping leading words until it
    fits in max_h. Returns (text, trimmed)."""
    bound = NSMakeSize(width, 10_000)
    opts = NSStringDrawingUsesLineFragmentOrigin

    def build(start):
        text = NSMutableAttributedString.alloc().init()
        for k, (word, style) in enumerate(words[start:]):
            text.appendAttributedString_(
                NSAttributedString.alloc().initWithString_attributes_(
                    (" " if k else "") + word, _attrs(style, size)))
        return text

    def fits(start):
        return build(start).boundingRectWithSize_options_(
            bound, opts).size.height <= max_h + 0.5

    lo, hi = 0, max(0, len(words) - 1)
    if not fits(0):
        while lo < hi:
            mid = (lo + hi) // 2
            if fits(mid):
                hi = mid
            else:
                lo = mid + 1
    return build(lo), lo > 0


def place(card_w, card_h, orb, screen):
    """Where the card goes (bottom-left origin), given the orb window's
    frame and the screen's visible frame (both (x, y, w, h)): centred over
    the orb, inside the screen. Over the orb when there is room, else under
    it (an orb at the top of the screen)."""
    ox, oy, ow, oh = orb
    fx, fy, fw, fh = screen
    sphere_top = oy + PILL_TOP
    x = ox + ow / 2 - card_w / 2
    y = sphere_top + GAP
    if y + card_h > fy + fh - EDGE:
        y = oy - card_h - GAP            # no room above: under the orb
    x = min(max(x, fx + EDGE), fx + fw - card_w - EDGE)
    y = min(max(y, fy + EDGE), fy + fh - card_h - EDGE)
    return round(x), round(y)


PILL_TOP = 176            # overlay.PILL_H: the sphere's area at the window's foot


class CardView(NSView):

    def initWithFrame_(self, frame):
        self = objc.super(CardView, self).initWithFrame_(frame)
        if self is None:
            return None
        self.words = []
        self.target = None       # {"name", "pane"} when the words go to Muxpane
        self.state = "recording"
        self.send = ""           # "", "sending", "sent", "kept"
        self.accent = (0.86, 0.36, 0.66)
        self._text = None        # (attributed text, trimmed), cached
        self.setWantsLayer_(True)
        return self

    def isFlipped(self):
        return False

    # -- sizes

    @objc.python_method
    def wanted_size(self, max_w):
        """(w, h) for the content, or None when there is nothing to show."""
        if self.target is not None:
            w = min(MUX_W, max_w)
            text, _ = self._content(w - 2 * MUX_PAD_X, MUX_FONT, MUX_LINES)
            th = self._text_h(text, w - 2 * MUX_PAD_X, MUX_FONT, MUX_LINES)
            return w, MUX_HEADER + th + MUX_PAD_BOTTOM
        if not self.words:
            return None
        w = min(PLAIN_W, max_w)
        text, _ = self._content(w - 2 * PAD, PLAIN_FONT, PLAIN_LINES)
        return w, self._text_h(text, w - 2 * PAD, PLAIN_FONT, PLAIN_LINES) + 2 * PAD

    @objc.python_method
    def _content(self, width, size, lines):
        if self._text is None or self._text[0] != (width, size):
            if not self.words:
                para = NSMutableParagraphStyle.alloc().init()
                text = NSAttributedString.alloc().initWithString_attributes_(
                    "say it…", {
                        NSFontAttributeName: NSFont.systemFontOfSize_(size),
                        NSParagraphStyleAttributeName: para,
                        NSForegroundColorAttributeName:
                            NSColor.colorWithCalibratedWhite_alpha_(1.0, 0.32)})
                self._text = ((width, size), text, False)
            else:
                text, trimmed = _fit(self.words, width, _room(lines, size), size)
                self._text = ((width, size), text, trimmed)
        return self._text[1], self._text[2]

    @staticmethod
    def _text_h(text, width, size, lines):
        h = text.boundingRectWithSize_options_(
            NSMakeSize(width, 10_000), NSStringDrawingUsesLineFragmentOrigin).size.height
        return max(_line_height(size), min(h, _room(lines, size)))

    @objc.python_method
    def invalidate(self):
        self._text = None
        self.setNeedsDisplay_(True)

    # -- drawing

    def drawRect_(self, rect):
        b = self.bounds()
        W, H = b.size.width, b.size.height
        shape = NSBezierPath.bezierPathWithRoundedRect_xRadius_yRadius_(
            NSMakeRect(0.5, 0.5, W - 1, H - 1), CORNER, CORNER)
        if self.target is None:
            NSColor.colorWithCalibratedWhite_alpha_(0.08, 0.78).setFill()
            shape.fill()
            text, trimmed = self._content(W - 2 * PAD, PLAIN_FONT, PLAIN_LINES)
            th = self._text_h(text, W - 2 * PAD, PLAIN_FONT, PLAIN_LINES)
            self._draw_text(text, NSMakeRect(PAD, PAD, W - 2 * PAD, th),
                            trimmed, PLAIN_FONT)
            return

        r, g, bl = self.accent
        # near-black, warmed a touch toward the pink
        NSColor.colorWithCalibratedRed_green_blue_alpha_(
            0.06 + 0.05 * r, 0.06 + 0.05 * g, 0.06 + 0.05 * bl, 0.92).setFill()
        shape.fill()
        # the deep pink rim: says "this goes to Muxpane" before any word
        rim = NSBezierPath.bezierPathWithRoundedRect_xRadius_yRadius_(
            NSMakeRect(0.75, 0.75, W - 1.5, H - 1.5), CORNER - 0.5, CORNER - 0.5)
        NSColor.colorWithCalibratedRed_green_blue_alpha_(r, g, bl, 0.95).setStroke()
        rim.setLineWidth_(1.5)
        rim.stroke()

        # header: ● muxpane  →  name                             status
        top = H - MUX_HEADER
        dot = NSBezierPath.bezierPathWithOvalInRect_(
            NSMakeRect(MUX_PAD_X, top + 12, 6, 6))
        NSColor.colorWithCalibratedRed_green_blue_alpha_(r, g, bl, 1.0).setFill()
        dot.fill()
        muted = NSColor.colorWithCalibratedWhite_alpha_(1.0, 0.5)
        status = self._status()
        status_attrs = {NSFontAttributeName: NSFont.systemFontOfSize_(11),
                        NSForegroundColorAttributeName: muted}
        status_w = (NSString.stringWithString_(status)
                    .sizeWithAttributes_(status_attrs).width if status else 0)
        head = NSMutableAttributedString.alloc().init()
        for piece, font, color in (
                ("muxpane", NSFont.systemFontOfSize_weight_(11, NSFontWeightMedium), muted),
                ("  →  ", NSFont.systemFontOfSize_(11), muted),
                (self.target.get("name", ""),
                 NSFont.systemFontOfSize_weight_(12, NSFontWeightSemibold),
                 NSColor.colorWithCalibratedWhite_alpha_(1.0, 0.92))):
            if piece:
                para = NSMutableParagraphStyle.alloc().init()
                para.setLineBreakMode_(NSLineBreakByTruncatingTail)
                head.appendAttributedString_(
                    NSAttributedString.alloc().initWithString_attributes_(piece, {
                        NSFontAttributeName: font,
                        NSForegroundColorAttributeName: color,
                        NSParagraphStyleAttributeName: para}))
        head_x = MUX_PAD_X + 13
        head_w = W - head_x - MUX_PAD_X - (status_w + 12 if status else 0)
        head.drawWithRect_options_(
            NSMakeRect(head_x, top + 7, head_w, 17),
            NSStringDrawingUsesLineFragmentOrigin)
        if status:
            NSString.stringWithString_(status).drawAtPoint_withAttributes_(
                NSMakePoint(W - MUX_PAD_X - status_w, top + 8), status_attrs)

        width = W - 2 * MUX_PAD_X
        text, trimmed = self._content(width, MUX_FONT, MUX_LINES)
        th = self._text_h(text, width, MUX_FONT, MUX_LINES)
        self._draw_text(text, NSMakeRect(MUX_PAD_X, MUX_PAD_BOTTOM, width, th),
                        trimmed, MUX_FONT)

    @objc.python_method
    def _status(self):
        if self.send == "sent":
            return "sent"
        if self.send == "kept":
            return "muxpane away · copied"
        if self.send == "sending":
            return "sending…"
        return {"recording": "listening…", "transcribing": "transcribing…",
                "cleaning": "cleaning up…",
                "ask": "hold ⌥"}.get(self.state, "")

    @objc.python_method
    def _draw_text(self, text, box, trimmed, size):
        """The words, newest at the bottom; when older words were dropped the
        top line fades out instead of being cut."""
        ctx = NSGraphicsContext.currentContext()
        ctx.saveGraphicsState()
        cg = ctx.CGContext()
        from Quartz import CGContextBeginTransparencyLayer, CGContextEndTransparencyLayer
        CGContextBeginTransparencyLayer(cg, None)
        text.drawWithRect_options_(box, NSStringDrawingUsesLineFragmentOrigin)
        if trimmed:
            fade = _line_height(size) * 0.9
            CGContextSetBlendMode(cg, kCGBlendModeDestinationOut)
            NSGradient.alloc().initWithStartingColor_endingColor_(
                NSColor.colorWithCalibratedWhite_alpha_(0, 0.0),
                NSColor.colorWithCalibratedWhite_alpha_(0, 0.85),
            ).drawInRect_angle_(
                NSMakeRect(box.origin.x, box.origin.y + box.size.height - fade,
                           box.size.width, fade), 90)
        CGContextEndTransparencyLayer(cg)
        ctx.restoreGraphicsState()


class Card(NSObject):
    """The card's window. Main thread only (Overlay calls it from there)."""

    def init(self):
        self = objc.super(Card, self).init()
        if self is None:
            return None
        self.view = CardView.alloc().initWithFrame_(NSMakeRect(0, 0, PLAIN_W, 80))
        w = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
            NSMakeRect(0, 0, PLAIN_W, 80), NSWindowStyleMaskBorderless,
            NSBackingStoreBuffered, False)
        w.setOpaque_(False)
        w.setBackgroundColor_(NSColor.clearColor())
        w.setHasShadow_(True)
        w.setLevel_(NSStatusWindowLevel)
        w.setIgnoresMouseEvents_(True)
        w.setCollectionBehavior_(NSWindowCollectionBehaviorCanJoinAllSpaces
                                 | NSWindowCollectionBehaviorStationary)
        w.setContentView_(self.view)
        self.window = w
        self.orb = None          # the orb window, to sit over
        self.timer = None
        self.generation = 0
        return self

    # -- content

    @objc.python_method
    def set_words(self, words):
        self.view.words = list(words)
        self.view.invalidate()
        self.layout()

    @objc.python_method
    def set_target(self, target, accent=None):
        self.view.target = target
        self.view.send = ""
        if accent is not None:
            self.view.accent = accent
        self.view.invalidate()
        self.layout()

    @objc.python_method
    def set_state(self, state):
        self.view.state = state
        self.view.setNeedsDisplay_(True)
        self.layout()

    @objc.python_method
    def set_send(self, send):
        self.view.send = send
        self.view.setNeedsDisplay_(True)
        self.layout()

    # -- window

    @objc.python_method
    def layout(self, show=True):
        """Size the card to its content and put it over the orb, inside the
        screen. Hidden when there is nothing to show."""
        if self.orb is None:
            return
        screen = self.orb.screen() or NSScreen.mainScreen()
        if screen is None:
            return
        f = screen.visibleFrame()
        size = self.view.wanted_size(f.size.width - 2 * EDGE)
        if size is None or not show:
            self._cancel()
            self.window.orderOut_(None)
            return
        w, h = size
        o = self.orb.frame()
        x, y = place(w, h, (o.origin.x, o.origin.y, o.size.width, o.size.height),
                     (f.origin.x, f.origin.y, f.size.width, f.size.height))
        frame = self.window.frame()
        if (frame.origin.x, frame.origin.y, frame.size.width, frame.size.height) != (x, y, w, h):
            self.window.setFrame_display_(NSMakeRect(x, y, w, h), True)
        self.view.setNeedsDisplay_(True)
        if not self.window.isVisible():
            self._cancel()
            self.window.setAlphaValue_(1.0)
            self.window.orderFrontRegardless()

    @objc.python_method
    def follow(self):
        """The orb moved (dragged): come along."""
        if self.window.isVisible():
            self.layout()

    @objc.python_method
    def hide(self):
        """With the orb. A sent message stays a moment to say so, then the
        card fades."""
        self.generation += 1
        gen = self.generation
        if self.window.isVisible() and self.view.send in ("sent", "kept"):
            self._later(LINGER_SEC, lambda: self._fade(gen))
        else:
            self._cancel()
            self.window.orderOut_(None)
            self._reset()

    @objc.python_method
    def _fade(self, gen):
        if gen != self.generation:
            return
        from AppKit import NSAnimationContext
        NSAnimationContext.beginGrouping()
        NSAnimationContext.currentContext().setDuration_(FADE_SEC)
        self.window.animator().setAlphaValue_(0.0)
        NSAnimationContext.endGrouping()
        self._later(FADE_SEC + 0.05, lambda: self._close(gen))

    @objc.python_method
    def _close(self, gen):
        if gen == self.generation:
            self.window.orderOut_(None)
            self.window.setAlphaValue_(1.0)
            self._reset()

    @objc.python_method
    def _reset(self):
        self.view.words = []
        self.view.target = None
        self.view.send = ""
        self.view.invalidate()

    @objc.python_method
    def begin(self):
        """A new dictation: drop any card still lingering from the last."""
        self.generation += 1
        self._cancel()
        self.window.orderOut_(None)
        self.window.setAlphaValue_(1.0)
        self._reset()

    @objc.python_method
    def _later(self, seconds, fn):
        self._cancel()
        self.timer = NSTimer.timerWithTimeInterval_repeats_block_(
            seconds, False, lambda _t: fn())
        NSRunLoop.mainRunLoop().addTimer_forMode_(self.timer, NSRunLoopCommonModes)

    @objc.python_method
    def _cancel(self):
        if self.timer is not None:
            self.timer.invalidate()
            self.timer = None
