"""Muxpane's fn N twice: it asks Sorph (a distributed notification) to show
the pink orb and the send card at once, before Sorph's key goes down."""
from __future__ import annotations

import unittest

import card
import muxpane


class Note:
    def __init__(self, info):
        self.info = info

    def userInfo(self):
        return self.info


class AskTargetTests(unittest.TestCase):
    def test_name_and_pane_make_a_target(self) -> None:
        self.assertEqual(muxpane.ask_target({"pane": "%22", "name": "Muxpane"}),
                         {"pane": "%22", "name": "Muxpane"})

    def test_a_missing_name_or_pane_is_no_ask(self) -> None:
        self.assertIsNone(muxpane.ask_target({"pane": "%22"}))
        self.assertIsNone(muxpane.ask_target({}))
        self.assertIsNone(muxpane.ask_target(None))


class WatcherTests(unittest.TestCase):
    def test_ask_and_end_reach_the_callbacks(self) -> None:
        got = []
        w = muxpane.watch_asks(lambda t: got.append(("ask", t)),
                               lambda: got.append(("end",)))
        w.asked_(Note({"pane": "%7", "name": "Slate"}))
        w.asked_(Note({"name": "no pane"}))          # ignored
        w.ended_(Note(None))
        self.assertEqual(got, [("ask", {"pane": "%7", "name": "Slate"}), ("end",)])

    def test_watching_twice_is_fine(self) -> None:
        muxpane.watch_asks(lambda t: None, lambda: None)
        muxpane.watch_asks(lambda t: None, lambda: None)


class AskCardTests(unittest.TestCase):
    def test_the_waiting_card_says_hold_option(self) -> None:
        view = card.CardView.alloc().initWithFrame_(((0, 0), (440, 80)))
        view.target = {"pane": "%7", "name": "Slate"}
        view.state = "ask"
        self.assertEqual(view._status(), "hold ⌥")

    def test_the_waiting_card_has_room_for_the_placeholder(self) -> None:
        view = card.CardView.alloc().initWithFrame_(((0, 0), (440, 80)))
        view.target = {"pane": "%7", "name": "Slate"}
        view.state = "ask"
        self.assertIsNotNone(view.wanted_size(1400))


if __name__ == "__main__":
    unittest.main()
