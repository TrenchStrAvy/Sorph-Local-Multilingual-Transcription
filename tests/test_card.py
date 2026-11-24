from __future__ import annotations

import unittest
from unittest import mock

import card
import flow

SCREEN = (0, 0, 1440, 875)       # visible frame: x, y, w, h


class PlacementTests(unittest.TestCase):
    """The card sits over the orb but never past the screen's edges."""

    def test_centred_over_an_orb_in_the_middle(self) -> None:
        x, y = card.place(440, 100, (460, 24, 520, 248), SCREEN)
        self.assertEqual(x, 460 + 260 - 220)
        self.assertEqual(y, 24 + card.PILL_TOP + card.GAP)

    def test_an_orb_dragged_half_off_the_left_edge_keeps_the_card_on_screen(self) -> None:
        x, _ = card.place(440, 100, (-230, 24, 520, 248), SCREEN)
        self.assertEqual(x, card.EDGE)

    def test_an_orb_at_the_right_edge(self) -> None:
        x, _ = card.place(520, 80, (1200, 24, 520, 248), SCREEN)
        self.assertEqual(x, 1440 - 520 - card.EDGE)

    def test_an_orb_at_the_top_puts_the_card_under_it(self) -> None:
        _, y = card.place(440, 100, (460, 875 - 248 - 24, 520, 248), SCREEN)
        self.assertLess(y, 875 - 248 - 24)
        self.assertGreaterEqual(y, card.EDGE)


class SendStatusTests(unittest.TestCase):
    def _app(self):
        app = flow.FlowApp.__new__(flow.FlowApp)
        app.overlay = mock.Mock()
        return app

    def test_a_delivered_answer_says_sent(self) -> None:
        app = self._app()
        with mock.patch.object(flow.muxpane, "deliver", return_value=True):
            app._to_muxpane({"pane": "%7", "name": "Slate"}, "hello")
        self.assertEqual([c.args[0] for c in app.overlay.set_send.call_args_list],
                         ["sending", "sent"])

    def test_muxpane_gone_keeps_the_words_and_says_so(self) -> None:
        app = self._app()
        with mock.patch.object(flow.muxpane, "deliver", return_value=False), \
             mock.patch.object(flow.subprocess, "run") as run:
            app._to_muxpane({"pane": "%7", "name": "Slate"}, "hello")
        run.assert_called_once()
        self.assertEqual(app.overlay.set_send.call_args_list[-1].args[0], "kept")


if __name__ == "__main__":
    unittest.main()
